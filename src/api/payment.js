import api from './axios';

export const paymentApi = {
  getApps: () => api.get('/payment/apps'),
  createApp: (data) => api.post('/payment/apps', data),
  updateApp: (id, data) => api.put(`/payment/apps/${id}`, data),
  deleteApp: (id) => api.delete(`/payment/apps/${id}`),
  getAccounts: () => api.get('/payment/accounts'),
  getActiveAccounts: () => api.get('/payment/accounts/active'),
  createAccount: (data) => api.post('/payment/accounts', data),
  updateAccount: (id, data) => api.put(`/payment/accounts/${id}`, data),
  deleteAccount: (id) => api.delete(`/payment/accounts/${id}`),
};
