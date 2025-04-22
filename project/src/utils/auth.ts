import { jwtDecode } from 'jwt-decode';

// Token storage keys
const TOKEN_KEY = 'second_brain_token';
const USER_ID_KEY = 'second_brain_user_id';
const USERNAME_KEY = 'second_brain_username';

// Store auth data
export const setAuth = (token: string, userId: string, username: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, userId);
  localStorage.setItem(USERNAME_KEY, username);
};

// Clear auth data
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USERNAME_KEY);
};

// Get token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get user ID
export const getUserId = (): string | null => {
  return localStorage.getItem(USER_ID_KEY);
};

// Get username
export const getUsername = (): string | null => {
  return localStorage.getItem(USERNAME_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};