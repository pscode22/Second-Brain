import { AxiosError } from 'axios';
import { ContentType } from './constants';
import { Dispatch, SetStateAction } from 'react';

export interface GenericResponse {
  ok: boolean;
  message: string;
  error?: Error | AxiosError | unknown;
}

/**
 * 🔐 Auth success response
 * (used for both signin and signup)
 */
// 🔹 Auth success response
export interface LoginOkRes extends GenericResponse {
  accessToken: string;
  refreshToken: string;
  userName: string;
}

/**
 * 🧩 Auth Context shape
 */
export interface AuthContextType {
  isTokenValid: boolean | null;
  loginValidation: (res: LoginOkRes) => GenericResponse;
  logout: () => GenericResponse;
}

/**
 * 💾 Token config stored in localStorage
 */
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

export interface DeleteContentProps {
  content?: Content;
  isModalOpen: boolean;
}

export interface DeleteContContext {
  delContent: DeleteContentProps;
  setDelContent: Dispatch<SetStateAction<DeleteContentProps>>;
}

export interface ShareContentProps {
  isModalOpen: boolean;
  shareableLink?: string;
}

export interface ShareContContext {
  shareContent: ShareContentProps;
  setShareContent: Dispatch<SetStateAction<ShareContentProps>>;
}

export interface SharedLinkRes {
  content: Content[];
  user: { _id: string; userName: string };
}
