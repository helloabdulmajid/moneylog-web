import axios from "axios";

/**
 * Separate API client for the admin panel. Uses its own token storage keys so
 * admin sessions never collide with the regular user session, and a failed
 * admin refresh can never touch the user's tokens.
 */
const adminApi = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const ADMIN_ACCESS_KEY = "adminAccessToken";
export const ADMIN_REFRESH_KEY = "adminRefreshToken";
export const ADMIN_USER_KEY = "adminUser";

const REFRESH_PATH = "/admin/auth/refresh";
const AUTH_FREE_PATHS = ["/admin/auth/login", REFRESH_PATH, "/admin/auth/logout"];

let refreshPromise = null;

function normalizePath(url = "") {
  const path = url.startsWith("/api") ? url.slice(4) : url;
  return path || "/";
}

function isAuthFreePath(url = "") {
  return AUTH_FREE_PATHS.includes(normalizePath(url));
}

export function clearAdminAuthState() {
  localStorage.removeItem(ADMIN_ACCESS_KEY);
  localStorage.removeItem(ADMIN_REFRESH_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

function redirectToAdminLogin() {
  if (window.location.pathname !== "/admin/login") {
    window.location.href = "/admin/login";
  }
}

async function refreshAdminTokens() {
  const refreshToken = localStorage.getItem(ADMIN_REFRESH_KEY);
  if (!refreshToken) {
    throw new Error("No admin refresh token available");
  }

  const { data } = await axios.post("/api" + REFRESH_PATH, { refreshToken });

  localStorage.setItem(ADMIN_ACCESS_KEY, data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem(ADMIN_REFRESH_KEY, data.refreshToken);
  }
  if (data.admin) {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.admin));
  }
  return data.accessToken;
}

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_ACCESS_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (!response || response.status !== 401) {
      return Promise.reject(error);
    }

    const url = config?.url || "";
    const hadAuthHeader = Boolean(config?.headers?.Authorization);
    const shouldAttemptRefresh = hadAuthHeader && !config._retry && !isAuthFreePath(url);

    if (!shouldAttemptRefresh) {
      if (!isAuthFreePath(url)) {
        clearAdminAuthState();
        redirectToAdminLogin();
      }
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAdminTokens().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      config._retry = true;
      return adminApi(config);
    } catch {
      clearAdminAuthState();
      redirectToAdminLogin();
      return Promise.reject(error);
    }
  }
);

export const adminAuthApi = {
  login: (data) => adminApi.post("/admin/auth/login", data).then((r) => r.data),
  refresh: (refreshToken) => adminApi.post("/admin/auth/refresh", { refreshToken }).then((r) => r.data),
  logout: (refreshToken) => adminApi.post("/admin/auth/logout", { refreshToken }).then((r) => r.data),
  me: () => adminApi.get("/admin/auth/me").then((r) => r.data),
  changePassword: (data) => adminApi.post("/admin/auth/change-password", data).then((r) => r.data),
};

export const adminDashboardApi = {
  get: () => adminApi.get("/admin/dashboard").then((r) => r.data),
};

export const adminFeedbackApi = {
  list: (params) => adminApi.get("/admin/feedback", { params }).then((r) => r.data),
  get: (id) => adminApi.get(`/admin/feedback/${id}`).then((r) => r.data),
  updateStatus: (id, status) =>
    adminApi.patch(`/admin/feedback/${id}/status`, { status }).then((r) => r.data),
};

export const adminUsersApi = {
  list: (params) => adminApi.get("/admin/users", { params }).then((r) => r.data),
  get: (id) => adminApi.get(`/admin/users/${id}`).then((r) => r.data),
  revokeSessions: (id) =>
    adminApi.post(`/admin/users/${id}/revoke-sessions`).then((r) => r.data),
  verifyEmail: (id) =>
    adminApi.post(`/admin/users/${id}/verify-email`).then((r) => r.data),
};

export const adminFlagsApi = {
  list: () => adminApi.get("/admin/feature-flags").then((r) => r.data),
  create: (data) => adminApi.post("/admin/feature-flags", data).then((r) => r.data),
  update: (id, data) => adminApi.put(`/admin/feature-flags/${id}`, data).then((r) => r.data),
  remove: (id) => adminApi.delete(`/admin/feature-flags/${id}`).then((r) => r.data),
};

export const adminAuditApi = {
  list: (params) => adminApi.get("/admin/audit", { params }).then((r) => r.data),
};

export default adminApi;
