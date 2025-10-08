// src/services/axiosInterceptor.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";
import {
  ReadTokenConfig,
  WriteTokenConfig,
  ClearAllConfigs,
} from "./storage";
import { validateToken } from "../utils/tokenValidation";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
const PUBLIC_PATHS = ["/signin", "/signup", "/refresh"];

export const axiosApiInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true, // ✅ optional for cookie auth
});

let refreshPromise: Promise<void> | null = null;

interface RetriableAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// 🧠 Request Interceptor — attach token for protected routes
axiosApiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const isPublic = PUBLIC_PATHS.some((path) => config.url?.includes(path));
    if (!isPublic) {
      const tokenData = ReadTokenConfig();
      const accessToken = tokenData?.accessToken;
      if (accessToken && validateToken(accessToken)) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// ♻️ Perform refresh
const performRefresh = async (): Promise<void> => {
  const tokenData = ReadTokenConfig();
  const refreshToken = tokenData?.refreshToken;
  if (!refreshToken) throw new Error("No refresh token found");

  const response = await axios.post<{
    accessToken: string;
    refreshToken: string;
  }>(`${BASE_URL}/refresh`, { refreshToken });

  const { accessToken, refreshToken: newRefreshToken } = response.data;
  WriteTokenConfig({
    accessToken,
    refreshToken: newRefreshToken,
    isValidated: true,
  });
};

// 🧩 Ensure only one refresh call runs at a time
const ensureRefreshed = async (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

// 🧱 Response Interceptor — global error handling + 401 refresh logic
axiosApiInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | void> => {
    const originalRequest = error.config as RetriableAxiosRequestConfig;

    if (!error.response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message =
      (error.response.data as { message?: string })?.message ||
      "Something went wrong";

    const isRefreshRequest = originalRequest?.url?.includes("/refresh");

    if (!isRefreshRequest && status >= 400 && status < 500 && status !== 401) {
      toast.error(message);
    }

    if (
      status === 401 &&
      !isRefreshRequest &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await ensureRefreshed();
        const newTokens = ReadTokenConfig();
        const newAccessToken = newTokens?.accessToken;

        if (newAccessToken && originalRequest.headers) {
          (originalRequest.headers as Record<string, string>).Authorization =
            `Bearer ${newAccessToken}`;
        }

        if (!originalRequest.url) return Promise.reject(error);
        return axiosApiInstance(originalRequest);
      } catch (refreshError) {
        toast.error("Session expired. Please sign in again.");
        ClearAllConfigs();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
