import axios from 'axios';
import { useAuthStore } from '../store/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    // Unwrap our { success, data, meta } envelope
    if (response.data && response.data.success !== undefined) {
      if (response.data.success) {
        return {
           ...response,
           data: response.data.data,
           meta: response.data.meta 
        } as any;
      }
      return Promise.reject(response.data.error);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Auto-refresh token on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;
      
      if (refreshToken) {
        try {
          // Explicitly call the refresh endpoint
          const res = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
            refreshToken
          });
          
          if (res.data?.success) {
            const { accessToken, refreshToken: newRefresh, user } = res.data.data;
            useAuthStore.getState().login(accessToken, newRefresh, user);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, log out
          useAuthStore.getState().logout();
        }
      } else {
        useAuthStore.getState().logout();
      }
    }
    
    // Format error to match our API error envelope
    if (error.response?.data?.error) {
      return Promise.reject(error.response.data.error);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
