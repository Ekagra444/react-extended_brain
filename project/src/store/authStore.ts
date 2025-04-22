import { create } from 'zustand';
import { User } from '../types';
import { setAuth, clearAuth, getUsername, getUserId } from '../utils/auth';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string | null;
    username: string | null;
  };
  stats: Array<{
    _id: string;
    count: number;
  }>;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}
//const navigate= useNavigate();
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getUserId(),
  user: {
    id: getUserId(),
    username: getUsername(),
  },
  stats: [],
  
  login: async (email, password) => {
    const response = await authService.login({ email, password });
    setAuth(response.token, response.userId, response.username);
    set({ 
      isAuthenticated: true,
      user: {
        id: response.userId,
        username: response.username,
      }
    });
  },
  
  signup: async (username, email, password) => {
    const response = await authService.signup({ username, email, password });
    setAuth(response.token, response.userId, response.username);
    set({ 
      isAuthenticated: true,
      user: {
        id: response.userId,
        username: response.username,
      }
    });
  },
  
  
  logout: () => {
    clearAuth();
    set({ 
      isAuthenticated: false,
      user: {
        id: null,
        username: null,
      },
      stats: []
    });
    //navigate("/auth/login");
  },
  
  fetchProfile: async () => {
    try {
      const response = await authService.getProfile();
      set({
        user: {
          id: response.user._id,
          username: response.user.username,
        },
        stats: response.stats
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }
}));