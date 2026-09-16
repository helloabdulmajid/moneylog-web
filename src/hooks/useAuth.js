import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import useAuthStore from '../store/authStore';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.data, data.data);
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.data, data.data);
    },
  });
};
