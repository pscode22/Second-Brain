import { AxiosError } from 'axios';
import { ContentType } from './constants';
import { Dispatch, SetStateAction } from 'react';

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
  userName: string;
  ok: boolean;
}

export interface TokenConfig {
  accessToken: string;
  refreshToken: string;
  isValidated: boolean;
}

export interface AddContentProps {
  title: string;
  link: string;
  contentType: ContentType;
}

export interface Content {
  contentType: ContentType;
  link: string;
  title: string;
  userId: { _id: string; userName: string };
  _id: string;
}

export interface ModalProps {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}
