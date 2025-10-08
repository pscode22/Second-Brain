// src/services/publicApiClient.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const publicGet = async <T>(url: string, params?: unknown): Promise<T> => {
  const res = await publicAxios.get<T>(url, { params });
  return res.data;
};

export const publicPost = async <T>(url: string, data?: unknown): Promise<T> => {
  const res = await publicAxios.post<T>(url, data);
  return res.data;
};
