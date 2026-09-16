import api from "./axios";

export const paymentApi = {
  listApps: () => api.get("/payment/apps").then((r) => r.data),
  createApp: (data) => api.post("/payment/apps", data).then((r) => r.data),
  updateApp: (id, data) => api.put(`/payment/apps/${id}`, data).then((r) => r.data),
  removeApp: (id) => api.delete(`/payment/apps/${id}`),

  listAccounts: () => api.get("/payment/accounts").then((r) => r.data),
  listActiveAccounts: () => api.get("/payment/accounts/active").then((r) => r.data),
  createAccount: (data) => api.post("/payment/accounts", data).then((r) => r.data),
  updateAccount: (id, data) =>
    api.put(`/payment/accounts/${id}`, data).then((r) => r.data),
  removeAccount: (id) => api.delete(`/payment/accounts/${id}`),
};