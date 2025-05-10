import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from './config';
import { validateToken } from '../utils/tokenValidation';
import { ClearAllConfigs, ReadTokenConfig, WriteTokenConfig } from './storage';

const allowedUrls = ['/signup', '/signin', '/refresh'];

export const axiosApiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// On Outgoing Req
axiosApiInstance.interceptors.request.use((req: InternalAxiosRequestConfig) => {
  const urlStr = (req.url || '').split('?')[0];

  const accessToken = async () => {
    const forageRes = await ReadTokenConfig();
    return forageRes?.accessToken || '';
  };

  // Attach Access Token to private-req Auth
  if (!allowedUrls.includes(urlStr)) {
    if (!accessToken) {
      window.location.href = '/signin';
      return Promise.reject(new Error('No access token found (req interceptors).'));
    }

    req.headers = req.headers || {};
    req.headers!['Authorization'] = `Bearer ${accessToken}`;
  }

  return req;
});

// On Incoming Res
axiosApiInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { config, response } = error;
    const originalRequest = config!;

    // If the refresh endpoint itself gives 401/403, user must re-login
    if (
      (response?.status === 401 || response?.status === 403) &&
      originalRequest.url === '/refresh'
    ) {
      
      window.location.href = '/signIn';
      await ClearAllConfigs()
      return Promise.reject(error);
    }

    // 401 (unAuthorized)
    if (response?.status === 401) {
      try {
        const refreshResponse = await axiosApiInstance.post<{
          accessToken: string;
          refreshToken: string;
        }>('/refresh');

        const newToken = refreshResponse.data.accessToken;

        if (!validateToken(newToken)) {
          throw new Error('Not a valid Token');
        }

        await WriteTokenConfig({
          accessToken: newToken,
          refreshToken: refreshResponse.data.refreshToken,
          isValidated: true,
        });

        // Replay the original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosApiInstance.request(originalRequest);
      } catch (refreshError) {
        const { error } = console;
        // If refresh failed (network error, server error, invalid cookie, etc.)
        // you must redirect to login or show a proper message
        error('Refresh token failed', refreshError);
        await ClearAllConfigs()
        window.location.href = '/signIn';
        return Promise.reject(refreshError);
      }
    }

    // Otherwise, just pass the error through
    return Promise.reject(error);
  },
);
