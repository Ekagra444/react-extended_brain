import { create } from 'zustand';
import { Content, ContentFilter } from '../types';
import contentService from '../services/contentService';
import { getUserId } from '../utils/auth';
import { useAuthStore } from './authStore';

interface ContentState {
  contents: Content[];
  currentContent: Content | null;
  filters: ContentFilter;
  tags: string[];
  isLoading: boolean;
  setFilters: (filters: ContentFilter) => void;
  fetchContents: () => Promise<void>;
  fetchContent: (id: string) => Promise<void>;
  createContent: (data: Omit<Content, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Content>;
  updateContent: (id: string, data: Partial<Content>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  fetchTags: () => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  contents: [],
  currentContent: null,
  filters: {},
  tags: [],
  isLoading: false,
  
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchContents();
  },
  
  fetchContents: async () => {
    set({ isLoading: true });
    try {
      const contents = await contentService.getContents(get().filters);
      set({ contents, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch contents:', error);
      set({ isLoading: false });
    }
  },
  
  fetchContent: async (id) => {
    set({ isLoading: true });
    try {
      const content = await contentService.getContent(id);
      set({ currentContent: content, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch content:', error);
      set({ isLoading: false });
    }
  },
  
  createContent: async (data) => {
    const userId = getUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const response = await contentService.createContent({
      userId,
      title: data.title,
      content: data.content,
      url: data.url,
      type: data.type,
      tags: data.tags,
    });
    
    set((state) => ({ 
      contents: [response.content, ...state.contents] 
    }));
    const { fetchProfile } = useAuthStore.getState();
    await fetchProfile();
    
    return response.content;
  },
  
  updateContent: async (id, data) => {
    
    const response = await contentService.updateContent(id, data);
    
    set((state) => ({
      contents: state.contents.map(content => 
        content._id === id ? response.content : content
      ),
      currentContent: response.content
    }));
  },
  
  deleteContent: async (id) => {
    await contentService.deleteContent(id);
    
    set((state) => ({
      contents: state.contents.filter(content => content._id !== id),
      currentContent: state.currentContent?._id === id ? null : state.currentContent
    }));
  },
  
  fetchTags: async () => {
    try {
      const tags = await contentService.getTags();
      set({ tags });
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  },
}));