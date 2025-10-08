import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./context";
import { GenericResponse, LoginOkRes } from "../../interfaces/generic";
import {
  ClearAllConfigs,
  ReadTokenConfig,
  WriteTokenConfig,
  WriteUserConfig,
} from "../../services/storage";
import { validateToken } from "../../utils/tokenValidation";
import { logout as apiLogout } from "../../services/api/auth.api";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 🧠 AuthProvider — Centralized authentication context
 * Handles token persistence, login state, and logout cleanup.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  /**
   * ✅ After a successful login or signup.
   * Stores tokens & user info in localStorage and marks auth as valid.
   */
  const loginValidation = useCallback((res: LoginOkRes): GenericResponse => {
    if (!res.accessToken || !res.refreshToken) {
      return { ok: false, message: "Missing tokens from server response" };
    }

    WriteTokenConfig({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      isValidated: true,
    });

    if (res.userName) WriteUserConfig({ userName: res.userName });

    setIsTokenValid(true);
    return { ok: true, message: "Login successful" };
  }, []);

  /**
   * 🚪 Logout handler
   * - Calls backend to revoke refresh token
   * - Clears all local data
   * - Redirects to /signin
   */
  const logout = useCallback((): GenericResponse => {
    (async () => {
      await apiLogout(); // revoke token on backend
      ClearAllConfigs(); // cleanup FE storage
      setIsTokenValid(false);
      window.location.href = "/signin";
    })();

    return { ok: true, message: "Logging out..." };
  }, []);

  /**
   * 🧩 On mount — validate existing token if available
   */
  useEffect(() => {
    const tokenData = ReadTokenConfig();
    if (!tokenData || !tokenData.accessToken) {
      setIsTokenValid(false);
      return;
    }

    const valid = validateToken(tokenData.accessToken);
    setIsTokenValid(valid);
  }, []);

  /**
   * ⚡ Memoized context value
   */
  const value = useMemo(
    () => ({
      isTokenValid,
      loginValidation,
      logout,
    }),
    [isTokenValid, loginValidation, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
