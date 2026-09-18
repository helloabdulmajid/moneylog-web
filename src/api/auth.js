import api from "./axios";

export const authApi = {
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  verifyEmail: (token) => api.post("/auth/verify-email", { token }).then((r) => r.data),
  resendVerification: (email) => api.post("/auth/resend-verification", { email }).then((r) => r.data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }).then((r) => r.data),
  resetPassword: (token, newPassword, confirmNewPassword) =>
    api.post("/auth/reset-password", { token, newPassword, confirmNewPassword }).then((r) => r.data),
};