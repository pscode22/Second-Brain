import { axiosApiInstance as axios } from '../api-interceptors';

// Get shareable link
export const GetShareableLink = async () => {
  const response = await axios.post('/brain/share', { share: true });
  return response.data;
};
