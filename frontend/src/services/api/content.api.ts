// src/services/api/content.api.ts
import { apiPost, apiDelete } from '../apiClient';
import { publicGet } from '../publicApiClient';
import { ContentType } from '../../interfaces/constants';
import { AddContentProps, Content } from '../../interfaces/generic';

/**
 * 🧠 Add new content
 */
export const AddContent = (
  contentProps: AddContentProps,
): Promise<{ ok: boolean; message: string }> => apiPost('/content', contentProps);

/**
 * 📂 Get contents by type (or all)
 */
export const GetContent = ({
  contentType,
}: {
  contentType: ContentType;
}): Promise<{
  ok: boolean;
  message: string;
  data: Content[];
}> => apiPost('get/content', { contentType });

/**
 * 🗑️ Delete content by ID
 */
export const DeleteContent = ({
  contentId,
}: {
  contentId: string;
}): Promise<{ ok: boolean; message: string }> => apiDelete(`/content`, { contentId });

/**
 * 🔗 Get shared brain content by share link
 * (public endpoint — doesn’t need auth)
 */
export const GetAllContentsByShareLink = ({
  shareLink,
}: {
  shareLink: string;
}): Promise<{
  ok: boolean;
  message: string;
  data: {
    user: { _id: string; userName: string };
    content: Content[];
  };
}> => publicGet(`/brain/${shareLink}`);
