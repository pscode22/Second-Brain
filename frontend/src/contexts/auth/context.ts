// src/context/auth/context.tsx
import { createContext } from "react";
import { AuthContextType} from "../../interfaces/generic";

export const AuthContext = createContext<AuthContextType>({
  isTokenValid: null,
  loginValidation: () => ({ ok: false, message: "Auth context not initialized" }),
  logout: () => ({ ok: false, message: "Auth context not initialized" }),
});

