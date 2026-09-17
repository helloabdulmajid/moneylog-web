import api from "./axios";

export const billPaymentApi = {
  list: (params) => api.get("/bill-payments", { params }).then((r) => r.data),
  create: (data) => api.post("/bill-payments", data).then((r) => r.data),
  update: (id, data) => api.put(`/bill-payments/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/bill-payments/${id}`),
};