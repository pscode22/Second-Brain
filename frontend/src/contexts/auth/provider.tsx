import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './context';
import { registerAccessTokenContextSetter, setAccessTokenService } from '../../services/config';

interface AuthProviderProps {
  children: ReactNode;
}

const { log } = console;

// Provider component that wraps your app and makes auth object available to all child components
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Validate token and update authentication state
  const validateToken = useCallback((token: string | null) => {
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }

    try {
      // Example validation for JWT
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        setIsAuthenticated(false);
        return false;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const isValid = payload.exp > Date.now() / 1000;

      setIsAuthenticated(isValid);
      return isValid;
    } catch (error) {
      log(error);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // Function to handle login with validation
  const login = useCallback(
    (token: string) => {
      setAccessToken(token);
      validateToken(token);
      setAccessTokenService(token);
    },
    [validateToken],
  ); // Include validateToken in dependencies

  // Function to check token validity
  const isTokenValid = useCallback(() => {
    return validateToken(accessToken);
  }, [accessToken, validateToken]); // Include validateToken in dependencies

  // Function to handle logout
  const logout = useCallback(() => {
    setAccessToken(null);
    setIsAuthenticated(false); // Also update authentication state
  }, []);

  // Effect to validate token on mount and when token changes
  useEffect(() => {
    if (accessToken) {
      setAccessTokenService(accessToken);
      validateToken(accessToken);

      // // Optional: Set up periodic validation
      // const validationInterval = setInterval(() => {
      //   validateToken(accessToken);
      // }, 60000); // Check every minute

      // return () => clearInterval(validationInterval);
    }
  }, [accessToken, validateToken]);

  useEffect(() => {
    registerAccessTokenContextSetter(setAccessToken);
  }, [setAccessToken]);

  const value = useMemo(
    () => ({
      accessToken,
      setAccessToken,
      isAuthenticated,
      isTokenValid,
      login,
      logout,
    }),
    [accessToken, isAuthenticated, isTokenValid, login, logout],
  ); // Include all function dependencies

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
