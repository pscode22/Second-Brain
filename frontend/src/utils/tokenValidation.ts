export const validateToken = (token: string | null) => {
  if (!token) {
    return false;
  }
  try {
    // Example validation for JWT
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }
    const payload = JSON.parse(atob(tokenParts[1]));
    const isValid = payload.exp > Date.now() / 1000;

    return isValid;
  } catch (error) {
    console.error('Token validation error:', error);

    return false;
  }
};
