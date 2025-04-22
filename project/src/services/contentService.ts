import api from '../utils/api';
import { Content, ContentFilter, CreateContentPayload, ShareContentPayload } from '../types';

export const contentService = {
  // Get all content with optional filters
  async getContents(filters: ContentFilter = {}): Promise<Content[]> {
    const response = await api.get('/content', { params: filters });
    return response.data;
  },

  // Get a single content item
  async getContent(id: string): Promise<Content> {
    const response = await api.get(`/content/${id}`);
    return response.data;
  },

  // Create a new content item
  async createContent(data: CreateContentPayload): Promise<{ message: string; content: Content }> {
    const response = await api.post('/content', data);
    return response.data;
  },

  // Update an existing content item
  async updateContent(id: string, data: Partial<CreateContentPayload>): Promise<{ message: string; content: Content }> {
    const response = await api.put(`/content/${id}`, data);
    return response.data;
  },

  // Delete a content item
  async deleteContent(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/content/${id}`);
    return response.data;
  },

  // Share content
  async shareContent(data: ShareContentPayload): Promise<{ message: string; shareId: string; shareLink: string; expiresAt?: string }> {
    const response = await api.post('/brain/share', data);
    return response.data;
  },

  // Get shared content
  async getSharedContent(shareId: string): Promise<{ sharedBy: string; contents: Content[] }> {
    const response = await api.get(`/brain/${shareId}`);
    return response.data;
  },

  // Get all tags
  async getTags(): Promise<string[]> {
    const response = await api.get('/tags');
    return response.data;
  }
};

export default contentService;