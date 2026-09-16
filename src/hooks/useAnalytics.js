import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics';

export const useMonthlySummary = (month, year) => {
  return useQuery({
    queryKey: ['analytics', 'monthly', month, year],
    queryFn: () => analyticsApi.getMonthlySummary(month, year),
    select: (data) => data.data,
  });
};
