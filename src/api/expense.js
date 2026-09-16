import api from "./axios";

export const expenseApi = {
  list: (params) => api.get("/expenses", { params }).then((r) => r.data),
  recent: () => api.get("/expenses/recent").then((r) => r.data),
  get: (id) => api.get(`/expenses/${id}`).then((r) => r.data),
  create: (data) => api.post("/expenses", data).then((r) => r.data),
  update: (id, data) => api.put(`/expenses/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/expenses/${id}`),
};