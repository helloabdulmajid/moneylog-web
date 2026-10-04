import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const REFRESH_PATH = "/auth/refresh";
const AUTH_FREE_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/logout",
  REFRESH_PATH,
];

let refreshPromise = null;

function normalizePath(url = "") {
  const path = url.startsWith("/api") ? url.slice(4) : url;
  return path || "/";
}

function isAuthFreePath(url = "") {
  const path = normalizePath(url);
  return AUTH_FREE_PATHS.includes(path);
}

function clearAuthState() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

async function refreshTokens() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const { data } = await axios.post("/api" + REFRESH_PATH, { refreshToken });

  localStorage.setItem("accessToken", data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  return data.accessToken;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (!response || response.status !== 401) {
      return Promise.reject(error);
    }

    const url = config?.url || "";
    const hadAuthHeader = Boolean(config?.headers?.Authorization);

    const shouldAttemptRefresh =
      hadAuthHeader &&
      !config._retry &&
      !isAuthFreePath(url);

    if (!shouldAttemptRefresh) {
      if (!isAuthFreePath(url)) {
        clearAuthState();
        redirectToLogin();
      }
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshTokens().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      config._retry = true;
      return api(config);
    } catch {
      clearAuthState();
      redirectToLogin();
      return Promise.reject(error);
    }
  }
);

export default api;