import api from './axios';

export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  getSubcategories: (categoryId) => api.get(`/categories/${categoryId}/subcategories`),
  createSubcategory: (categoryId, data) => api.post(`/categories/${categoryId}/subcategories`, data),
  updateSubcategory: (id, data) => api.put(`/categories/subcategories/${id}`, data),
  deleteSubcategory: (id) => api.delete(`/categories/subcategories/${id}`),
};
