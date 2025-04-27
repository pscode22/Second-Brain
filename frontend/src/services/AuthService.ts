import axios from 'axios';

axios.defaults.baseURL = '/api/v1';

interface SignInProps {
  userName: string;
  password: string;
}

// login
export const signin = async (userCredentials: SignInProps) => {
  const response = await axios.post('/signin', userCredentials, { withCredentials: true });
  return response.data;
};


export const refreshToken = async () => {
    
}