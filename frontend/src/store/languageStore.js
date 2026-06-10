// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const translations = {
  english: {
    // Navbar
    home: 'Home',
    browse: 'Browse',
    upload: 'Upload',
    dashboard: 'Dashboard',
    admin: 'Admin',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    
    // Home
    heroTitle: 'Free Educational Resources for Sierra Leone',
    heroSubtitle: 'Empowering students and teachers across Sierra Leone with quality educational materials. Supporting SDG 4: Quality Education and bridging the education gap in our communities.',
    browseResources: 'Browse Resources',
    shareKnowledge: 'Share Your Knowledge',
    totalResources: 'Total Resources',
    totalUsers: 'Total Users',
    totalDownloads: 'Total Downloads',
    subjectsCovered: 'Subjects Covered',
    featuredResources: 'Featured Resources',
    browseBySubject: 'Browse by Subject',
    howItWorks: 'How It Works',
    registerStep: 'Register',
    uploadStep: 'Upload or Browse',
    learnStep: 'Learn & Grow',
    
    // Browse
    searchPlaceholder: 'Search by title, description, or tags...',
    filters: 'Filters',
    clear: 'Clear',
    subject: 'Subject',
    level: 'Level',
    fileType: 'File Type',
    sortBy: 'Sort By',
    latest: 'Latest',
    mostDownloaded: 'Most Downloaded',
    highestRated: 'Highest Rated',
    noResourcesFound: 'No resources found',
    tryAdjusting: 'Try adjusting your filters or search terms',
    clearAllFilters: 'Clear all filters',
    previous: 'Previous',
    next: 'Next',
    
    // Common
    download: 'Download',
    viewDetails: 'View Details',
    views: 'views',
    approved: 'Approved',
    pending: 'Pending',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
  krio: {
    // Navbar
    home: 'Ome',
    browse: 'Luk Dem Buk',
    upload: 'Pot Am Up',
    dashboard: 'Dasbod',
    admin: 'Admin',
    logout: 'Lɔgaut',
    login: 'Enta',
    register: 'Jɔyn',
    
    // Home
    heroTitle: 'Gratis Edukashonal Resos Fɔ Sierra Leone',
    heroSubtitle: 'We de hep pikin en ticha for Sierra Leone wit gud buk. Wi de sopot SDG 4: Gud Edukashun en de brid di edukashon gap for wi komuniti.',
    browseResources: 'Luk Dem Buk',
    shareKnowledge: 'Share Yu Nolej',
    totalResources: 'Ol Buk',
    totalUsers: 'Ol Ppl',
    totalDownloads: 'Ol We Tek Am',
    subjectsCovered: 'Ol Leson',
    featuredResources: 'Gud Buk',
    browseBySubject: 'Luk Bai Leson',
    howItWorks: 'E de wok ɔn',
    registerStep: 'Jɔyn',
    uploadStep: 'Pot Am Up ɔ Luk Am',
    learnStep: 'Lɛn ɔ Grɔ',
    
    // Browse
    searchPlaceholder: 'Find am bai nem, diskripshun ɔ tag...',
    filters: 'Filtɔ',
    clear: 'Kliɛ',
    subject: 'Leson',
    level: 'Klas',
    fileType: 'Fayl Tip',
    sortBy: 'Ɔda Bai',
    latest: 'Nyun',
    mostDownloaded: 'Plenti Pipul Tek Am',
    highestRated: 'Gud Wan',
    noResourcesFound: 'Ai no si buk',
    tryAdjusting: 'Chenj yu filtɔ ɔ sɛch wod',
    clearAllFilters: 'Kliɛ ɔl filtɔ',
    previous: 'Bak',
    next: 'Neks',
    
    // Common
    download: 'Tek Am',
    viewDetails: 'Luk Mor',
    views: 'ppl luk am',
    approved: 'Oke',
    pending: 'Wait',
    loading: 'Dɔ wok...',
    error: 'Prɔblɛm',
    success: 'Dɔ wok',
  },
};

const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: 'english',
      setLanguage: (lang) => set({ language: lang }),
      t: (key) => {
        const lang = get().language;
        return translations[lang][key] || key;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);

export default useLanguageStore;
