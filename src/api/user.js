import api from "./axios";

export const userApi = {
  getProfile: () => api.get("/users/me").then((r) => r.data),
  updateProfile: (data) => api.put("/users/me", data).then((r) => r.data),
  getPreferences: () => api.get("/users/me/preferences").then((r) => r.data),
  updatePreferences: (data) =>
    api.put("/users/me/preferences", data).then((r) => r.data),
  changePassword: (data) =>
    api.put("/users/me/password", data).then((r) => r.data),
  deleteAccount: () => api.delete("/users/me").then((r) => r.data),
};
