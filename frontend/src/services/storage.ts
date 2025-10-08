// src/services/storage.ts
import { TokenConfig } from "../interfaces/generic";

const StorageKeys = {
  token: "token",
  user: "user",
};

/**
 * 🧹 Clear all stored auth & user data
 */
export const ClearAllConfigs = (): void => {
  localStorage.removeItem(StorageKeys.token);
  localStorage.removeItem(StorageKeys.user);
};

/**
 * 📖 Read token configuration
 */
export const ReadTokenConfig = (): TokenConfig | null => {
  const raw = localStorage.getItem(StorageKeys.token);
  return raw ? (JSON.parse(raw) as TokenConfig) : null;
};

/**
 * 💾 Write token configuration
 */
export const WriteTokenConfig = (token: TokenConfig): void => {
  localStorage.setItem(StorageKeys.token, JSON.stringify(token));
};

/**
 * 📖 Read stored user info
 */
export const ReadUserConfig = (): { userName: string } | null => {
  const raw = localStorage.getItem(StorageKeys.user);
  return raw ? (JSON.parse(raw) as { userName: string }) : null;
};

/**
 * 💾 Write user info
 */
export const WriteUserConfig = ({ userName }: { userName: string }): void => {
  localStorage.setItem(StorageKeys.user, JSON.stringify({ userName }));
};

/**
 * 🔑 Get refresh token (for logout or refresh)
 */
export const ReadRefreshToken = (): string | null => {
  const tokenData = ReadTokenConfig();
  return tokenData?.refreshToken || null;
};

/**
 * 🔑 Get access token (for debugging or manual fetch)
 */
export const ReadAccessToken = (): string | null => {
  const tokenData = ReadTokenConfig();
  return tokenData?.accessToken || null;
};
