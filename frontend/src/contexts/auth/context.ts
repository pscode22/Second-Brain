import { createContext } from "react";
import { AuthContextType } from "../../interfaces/generic";

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  isAuthenticated: false,
  isTokenValid: () => false, // Add default implementation
  login: () => {},
  logout: () => {},
});