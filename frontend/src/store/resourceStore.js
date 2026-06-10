// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { create } from 'zustand';
import api from '../utils/api';

const useResourceStore = create((set, get) => ({
  resources: [],
  currentResource: null,
  myResources: [],
  pendingResources: [],
  isLoading: false,
  uploadProgress: 0,
  pagination: { page: 1, limit: 10, total: 0, pages: 0 },

  getAllResources: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/resources', { params });
      set({
        resources: response.data.resources,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching resources:', error);
    }
  },

  getResourceById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/resources/${id}`);
      set({ currentResource: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching resource:', error);
    }
  },

  getMyResources: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/resources/my-resources');
      set({ myResources: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching my resources:', error);
    }
  },

  getPendingResources: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/resources/pending');
      set({ pendingResources: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching pending resources:', error);
    }
  },

  uploadResource: async (formData) => {
    set({ isLoading: true, uploadProgress: 0 });
    try {
      const response = await api.post('/resources/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          set({ uploadProgress: progress });
        },
      });
      set({ isLoading: false, uploadProgress: 100 });
      return { success: true, data: response.data };
    } catch (error) {
      set({ isLoading: false, uploadProgress: 0 });
      return {
        success: false,
        error: error.response?.data?.error || 'Upload failed',
      };
    }
  },

  deleteResource: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/resources/${id}`);
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

  approveResource: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/resources/approve/${id}`);
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.error || 'Approval failed',
      };
    }
  },

  downloadResource: async (id) => {
    try {
      const response = await api.get(`/resources/download/${id}`);
      return { success: true, fileURL: response.data.fileURL };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Download failed',
      };
    }
  },
}));

export default useResourceStore;
