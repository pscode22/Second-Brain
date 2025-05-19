import { ContentType } from './../../interfaces/constants';
import { AddContentProps } from '../../interfaces/generic';
import { axiosApiInstance as axios } from '../api-interceptors';

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
