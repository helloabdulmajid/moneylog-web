import api from "./axios";

export const categoryApi = {
  list: () => api.get("/categories").then((r) => r.data),
  create: (data) => api.post("/categories", data).then((r) => r.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`),
  listSubcategories: (categoryId) =>
    api.get(`/categories/${categoryId}/subcategories`).then((r) => r.data),
  createSubcategory: (categoryId, data) =>
    api.post(`/categories/${categoryId}/subcategories`, data).then((r) => r.data),
  updateSubcategory: (subcategoryId, data) =>
    api
      .put(`/categories/subcategories/${subcategoryId}`, data)
      .then((r) => r.data),
  removeSubcategory: (subcategoryId) =>
    api.delete(`/categories/subcategories/${subcategoryId}`),
};