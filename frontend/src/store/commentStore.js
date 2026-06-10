// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { create } from 'zustand';
import api from '../utils/api';

const useCommentStore = create((set, get) => ({
  comments: [],
  isLoading: false,

  getComments: async (resourceId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/comments/${resourceId}`);
      set({ comments: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching comments:', error);
    }
  },

  addComment: async (resourceId, text, rating) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/comments/${resourceId}`, { text, rating });
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.error || 'Comment failed',
      };
    }
  },

  deleteComment: async (commentId) => {
    set({ isLoading: true });
    try {
      await api.delete(`/comments/${commentId}`);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.error || 'Delete failed',
      };
    }
  },
}));

export default useCommentStore;
