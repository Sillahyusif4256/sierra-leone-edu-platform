// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAccessibilityStore = create(
  persist(
    (set) => ({
      fontSize: 'normal', // small, normal, large, xlarge
      dataSaver: false,
      setFontSize: (fontSize) => set({ fontSize }),
      setDataSaver: (dataSaver) => set({ dataSaver }),
    }),
    {
      name: 'edushare_accessibility',
    }
  )
);

export default useAccessibilityStore;
