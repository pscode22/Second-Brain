import { AxiosError } from 'axios';

export interface GenericResponse {
  message: string;
  ok: boolean;
  error?: Error | AxiosError | unknown | undefined;
}

export interface AuthContextType {
  isTokenValid: boolean | null;
  loginValidation: (token: LoginOkRes) => Promise<void> | Promise<GenericResponse>;
  logout: () => void;
}

export interface LoginOkRes {
  message: string;
  accessToken: string;
  refreshToken: string;
  userName : string;
  ok: boolean;
}

export interface TokenConfig {
  accessToken: string;
  refreshToken: string;
  isValidated: boolean;
}
