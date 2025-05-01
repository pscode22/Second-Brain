export interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    isAuthenticated: boolean;
    isTokenValid: () => boolean; // Add this function to the interface
    login: (token: string) => void;
    logout: () => void;
  }
  