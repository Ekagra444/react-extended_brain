export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Content {
  _id: string;
  userId: string | User;
  title: string;
  content: string;
  url?: string;
  type: 'youtube' | 'twitter' | 'task' | 'blog' | 'other';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Share {
  _id: string;
  userId: string;
  contentIds: string[];
  shareId: string;
  expiresAt?: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  userId: string;
  username: string;
}

export interface ProfileResponse {
  user: User;
  stats: Array<{
    _id: 'youtube' | 'twitter' | 'task' | 'blog' | 'other';
    count: number;
  }>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface ContentFilter {
  type?: string;
  search?: string;
  tag?: string;
}

export interface CreateContentPayload {
  userId: string;
  title: string;
  content: string;
  url?: string;
  type: 'youtube' | 'twitter' | 'task' | 'blog' | 'other';
  tags: string[];
}

export interface ShareContentPayload {
  contentIds: string[];
  expiresIn?: number;
}

export interface ProfileUpdatePayload {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}