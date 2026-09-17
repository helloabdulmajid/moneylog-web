import api from "./axios";

export const paymentApi = {
  listApps: () => api.get("/payment/apps").then((r) => r.data),
  createApp: (data) => api.post("/payment/apps", data).then((r) => r.data),
  updateApp: (id, data) => api.put(`/payment/apps/${id}`, data).then((r) => r.data),
  removeApp: (id) => api.delete(`/payment/apps/${id}`),

  listSources: () => api.get("/payment/sources").then((r) => r.data),
  listActiveSources: () => api.get("/payment/sources/active").then((r) => r.data),
  createSource: (data) => api.post("/payment/sources", data).then((r) => r.data),
  updateSource: (id, data) => api.put(`/payment/sources/${id}`, data).then((r) => r.data),
  removeSource: (id) => api.delete(`/payment/sources/${id}`),
};