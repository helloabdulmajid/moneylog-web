import api from './axios';

export const analyticsApi = {
  getMonthlySummary: (month, year) => api.get('/analytics/monthly', { params: { month, year } }),
};
