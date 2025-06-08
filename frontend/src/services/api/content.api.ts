import { ContentType } from './../../interfaces/constants';
import { AddContentProps } from '../../interfaces/generic';
import { axiosApiInstance as axios } from '../api-interceptors';
import axioss from 'axios';
import { BASE_URL } from '../config';

const axiosInstance = axioss.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const AddContent = async (contentProps: AddContentProps) => {
  const response = await axios.post('/content', contentProps);
  return response.data;
};

export const GetContent = async ({ contentType }: { contentType: ContentType }) => {
  const response = await axios.post('/get/content', { contentType });
  return response.data;
};

export const DeleteContent = async ({ contentId }: { contentId: string }) => {
  const response = await axios.delete('/content', { data: { contentId } });
  return response.data;
};

export const GetAllContentsByShareLink = async ({ shareLink }: { shareLink: string }) => {
  const response = await axiosInstance.get(`/brain/${shareLink}`);
  return response.data;
};
