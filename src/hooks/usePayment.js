import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/payment';

export const usePaymentApps = () => {
  return useQuery({
    queryKey: ['paymentApps'],
    queryFn: paymentApi.getApps,
    select: (data) => data.data,
  });
};

export const usePaymentAccounts = () => {
  return useQuery({
    queryKey: ['paymentAccounts'],
    queryFn: paymentApi.getAccounts,
    select: (data) => data.data,
  });
};

export const useActivePaymentAccounts = () => {
  return useQuery({
    queryKey: ['paymentAccounts', 'active'],
    queryFn: paymentApi.getActiveAccounts,
    select: (data) => data.data,
  });
};

export const useCreatePaymentApp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentApi.createApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentApps'] });
    },
  });
};

export const useCreatePaymentAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: paymentApi.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentAccounts'] });
    },
  });
};
