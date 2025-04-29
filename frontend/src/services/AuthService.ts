import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000/api/v1';

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
  const response = await axios.post('/signin', userCredentials, { withCredentials: true });
  return response.data;
};

export const refreshToken = async () => {};
