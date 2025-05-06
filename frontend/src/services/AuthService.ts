import { axiosApiInstance as axios } from './api';

interface SignInProps {
  userName: string;
  password: string;
}

// SignUp
export const signup = async (userCredentials: SignInProps) => {
  const response = await axios.post('/signup', userCredentials);
  return response.data;
};

// login
export const signin = async (userCredentials: SignInProps) => {
  const response = await axios.post('/signin', userCredentials);
  return response.data;
};

// refresh
export const refresh = async (currRefreshToken: string) => {
  const response = await axios.post<{ accessToken: string, refreshToken: string }>('/refresh', {
    currRefreshToken,
  });
  return response.data;
};
