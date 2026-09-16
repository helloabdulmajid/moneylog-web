import api from './axios';

export const expenseApi = {
  getExpenses: (params) => api.get('/expenses', { params }),
  getRecentExpenses: () => api.get('/expenses/recent'),
  getExpenseById: (id) => api.get(`/expenses/${id}`),
  createExpense: (data) => api.post('/expenses', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};
