import { createContext } from 'react';
import { AuthContextType } from '../../interfaces/generic';

export const AuthContext = createContext<AuthContextType>({
  isTokenValid: false,
  loginValidation: async () => {},
  logout: async () => {},
});
