import { AddContentProps } from '../../interfaces/generic';
import { axiosApiInstance as axios } from '../api-interceptors';


// login
export const AddContent = async (contentProps: AddContentProps) => {
  const response = await axios.post('/content', contentProps);
  return response.data;
};