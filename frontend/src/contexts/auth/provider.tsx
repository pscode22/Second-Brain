import { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { AuthContext } from './context';
import { GenericResponse, LoginOkRes } from '../../interfaces/generic';
import {
  ClearAllConfigs,
  ReadTokenConfig,
  WriteTokenConfig,
  WriteUserConfig,
} from '../../services/storage';
import { validateToken } from '../../utils/tokenValidation';
import { refresh } from '../../services/AuthService';

interface AuthProviderProps {
  children: ReactNode;
}

const { error } = console;

// Provider component that wraps your app and makes auth object available to all child components
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  // Function to handle login with validation
  const loginValidation = useCallback(async (res: LoginOkRes): Promise<GenericResponse> => {
    try {
      const isValidToken = validateToken(res.accessToken);
      if (isValidToken) {
        const { accessToken, refreshToken, userName } = res;
        await WriteTokenConfig({ accessToken, refreshToken, isValidated: isValidToken });
        await WriteUserConfig({ userName });
        setIsTokenValid(isValidToken);
        return { message: 'Token is Valid', ok: true };
      } else {
        setIsTokenValid(false);
        return { message: 'Token is not valid', ok: false };
      }
    } catch (error) {
      return {
        message: 'Something went wrong',
        ok: false,
        error,
      };
    }
  }, []);

  const logout = useCallback(async (): Promise<GenericResponse> => {
    try {
      await ClearAllConfigs();
      setIsTokenValid(false);
      window.location.href = '/signin';
      return { message: 'Logout Successful', ok: true };
    } catch (error) {
      return {
        message: 'Cannot logout.',
        ok: false,
        error,
      };
    }
  }, []);
  console.log(isTokenValid);

  useLayoutEffect(() => {
    try {
      const setTokenValidation = async () => {
        const token = await ReadTokenConfig();
        if (token) {
          const tokenValidation = validateToken(token.accessToken);

          console.log(tokenValidation, token.refreshToken);

          if (tokenValidation) {
            setIsTokenValid(true);
            return;
          }

          if (!tokenValidation && token.refreshToken) {
            const newToken = await refresh(token.refreshToken);

            if (newToken.accessToken && newToken.refreshToken) {
              const { accessToken, refreshToken } = newToken;
              const tokenValidation = validateToken(accessToken);

              if (!tokenValidation) {
                setIsTokenValid(false);
                return;
              }
              await WriteTokenConfig({ accessToken, refreshToken, isValidated: tokenValidation });
              setIsTokenValid(tokenValidation);
            } else {
              setIsTokenValid(false);
              return;
            }
          } else {
            setIsTokenValid(false);
            return;
          }
        } else {
          setIsTokenValid(false);
          return;
        }
      };
      setTokenValidation();
    } catch (err) {
      error(err);
      logout();
    }
  }, [logout]);

  const value = useMemo(
    () => ({
      isTokenValid,
      loginValidation,
      logout,
    }),
    [isTokenValid, loginValidation, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
