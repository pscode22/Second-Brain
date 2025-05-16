import { AddContentProps } from '../../interfaces/generic';
import { axiosApiInstance as axios } from '../api-interceptors';

export const AddContent = async (contentProps: AddContentProps) => {
  const response = await axios.post('/content', contentProps);
  return response.data;
};

export const GetContent = async () => {
  const response = await axios.get('/content');
  return response.data;
};
