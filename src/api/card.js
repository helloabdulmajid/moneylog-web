import api from "./axios";

export const creditCardApi = {
  list: () => api.get("/credit-cards").then((r) => r.data),
  active: () => api.get("/credit-cards/active").then((r) => r.data),
  get: (id) => api.get(`/credit-cards/${id}`).then((r) => r.data),
  create: (data) => api.post("/credit-cards", data).then((r) => r.data),
  update: (id, data) => api.put(`/credit-cards/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/credit-cards/${id}`),
  expenses: (id, params) => api.get(`/credit-cards/${id}/expenses`, { params }).then((r) => r.data),
  billPayments: (id, params) => api.get(`/credit-cards/${id}/bill-payments`, { params }).then((r) => r.data),
};