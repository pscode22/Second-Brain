// src/services/api/auth.api.ts
import { apiPost } from '../apiClient';
import { LoginOkRes, GenericResponse } from '../../interfaces/generic';
import { ReadTokenConfig } from '../storage';

interface AuthCredentials {
  userName: string;
  password: string;
}

/**
 * 🧾 Sign Up
 */
export const signup = (userCredentials: AuthCredentials): Promise<LoginOkRes> =>
  apiPost<LoginOkRes>('/signup', userCredentials);

/**
 * 🔐 Sign In
 */
export const signin = (userCredentials: AuthCredentials): Promise<LoginOkRes> =>
  apiPost<LoginOkRes>('/signin', userCredentials);

/**
 * ♻️ Refresh Token
 */
export const refresh = (
  refreshToken: string,
): Promise<{ ok: boolean; message: string; accessToken: string; refreshToken: string }> =>
  apiPost('/refresh', { refreshToken });

/**
 * 🚪 Logout
 * Pass refreshToken from localStorage
 */
export const logout = async (): Promise<GenericResponse> => {
  const tokenData = ReadTokenConfig();
  const refreshToken = tokenData?.refreshToken;

  if (!refreshToken) {
    return {
      ok: false,
      message: 'No refresh token found in storage.',
    };
  }

  return apiPost<GenericResponse>('/logout', { refreshToken });
};
