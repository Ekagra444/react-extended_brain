import api from '../utils/api';
import { AuthResponse, LoginCredentials, SignupCredentials, ProfileUpdatePayload, ProfileResponse } from '../types';

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials);
    return response.data;
  },

  // Register user
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/signup', credentials);
    return response.data;
  },

  // Get user profile
  async getProfile(): Promise<ProfileResponse> {
    const response = await api.get<ProfileResponse>('/user/profile');
    return response.data;
  },

  // Update user profile
  async updateProfile(data: ProfileUpdatePayload): Promise<{ message: string; user: any }> {
    const response = await api.put('/user/profile', data);
    return response.data;
  }
};

export default authService;