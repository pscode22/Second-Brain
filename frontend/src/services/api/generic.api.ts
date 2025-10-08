// src/services/api/generic.api.ts
import { axiosApiInstance as axios } from "../axiosInterceptor";

/**
 * 🔗 Get or create shareable link for user's brain
 */
export const GetShareableLink = async (): Promise<{
  ok: boolean;
  message: string;
  sharableLink?: string;
}> => {
  const response = await axios.post("/brain/share", { share: true });
  return response.data;
};

/**
 * ❌ Remove existing shareable link
 */
export const DeleteShareableLink = async (): Promise<{
  ok: boolean;
  message: string;
}> => {
  const response = await axios.post("brain/share", { share: false });
  return response.data;
};
