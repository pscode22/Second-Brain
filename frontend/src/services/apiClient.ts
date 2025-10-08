// src/services/apiClient.ts
import { axiosApiInstance } from './axiosInterceptor';

/**
 * 🔹 Generic GET helper
 */
export const apiGet = async <T>(url: string, params?: unknown): Promise<T> => {
  const res = await axiosApiInstance.get<T>(url, { params });
  return res.data;
};

/**
 * 🔹 Generic POST helper
 */
export const apiPost = async <T>(url: string, data?: unknown): Promise<T> => {
  const res = await axiosApiInstance.post<T>(url, data);
  return res.data;
};

/**
 * 🔹 Generic PUT helper
 */
export const apiPut = async <T>(url: string, data?: unknown): Promise<T> => {
  const res = await axiosApiInstance.put<T>(url, data);
  return res.data;
};

/**
 * 🔹 Generic DELETE helper (supports body)
 */
export const apiDelete = async <T>(url: string, data?: unknown): Promise<T> => {
  const res = await axiosApiInstance.delete<T>(url, { data });
  return res.data;
};
