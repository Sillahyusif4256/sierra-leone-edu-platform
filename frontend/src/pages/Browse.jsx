// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResourceCard from '../components/ResourceCard';
import Spinner from '../components/Spinner';
import useResourceStore from '../store/resourceStore';
import { FiSearch, FiFilter, FiX, FiRefreshCw } from 'react-icons/fi';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAllResources, resources, isLoading, pagination } = useResourceStore();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedSubjects, setSelectedSubjects] = useState(
    searchParams.get('subject') ? [searchParams.get('subject')] : []
  );
  const [selectedLevels, setSelectedLevels] = useState(
    searchParams.get('level') ? [searchParams.get('level')] : []
  );
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'ICT', 'Biology', 'Chemistry', 'Physics', 'Other'];
  const levels = ['Primary', 'JSS', 'SSS', 'University', 'Other'];
  const fileTypes = ['pdf', 'video', 'image', 'document'];

  // Debounce search input by 500ms
  const debouncedSearchHandler = useCallback(
    (value) => {
      const handler = setTimeout(() => {
        setDebouncedSearch(value);
      }, 500);
      return () => clearTimeout(handler);
    },
    []
  );

  useEffect(() => {
    debouncedSearchHandler(search);
  }, [search, debouncedSearchHandler]);

  useEffect(() => {
    const params = {
      search: debouncedSearch || undefined,
      subject: selectedSubjects.length > 0 ? selectedSubjects[0] : undefined,
      level: selectedLevels.length > 0 ? selectedLevels[0] : undefined,
      page: searchParams.get('page') || 1,
      limit: 12,
    };
    getAllResources(params);
  }, [debouncedSearch, selectedSubjects, selectedLevels, searchParams.get('page')]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search, page: 1 });
  };

  const toggleSubject = (subject) => {
    setSelectedSubjects([subject]);
    setSearchParams({ subject, page: 1 });
  };

  const toggleLevel = (level) => {
    setSelectedLevels([level]);
    setSearchParams({ level, page: 1 });
  };

  const toggleFileType = (fileType) => {
    setSelectedFileTypes((prev) =>
      prev.includes(fileType) ? prev.filter((t) => t !== fileType) : [...prev, fileType]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedSubjects([]);
    setSelectedLevels([]);
    setSelectedFileTypes([]);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setSearchParams({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pull to refresh handlers
  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && startY.current > 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;

      if (distance > 0) {
        setIsPulling(true);
        setPullDistance(Math.min(distance, 100));
      }
    }
  };

  const handleTouchEnd = () => {
    if (isPulling && pullDistance > 60) {
      setIsRefreshing(true);
      const params = {
        search: debouncedSearch || undefined,
        subject: selectedSubjects.length > 0 ? selectedSubjects[0] : undefined,
        level: selectedLevels.length > 0 ? selectedLevels[0] : undefined,
        page: 1,
        limit: 12,
      };
      getAllResources(params).then(() => {
        setIsRefreshing(false);
      });
    }
    setIsPulling(false);
    setPullDistance(0);
    startY.current = 0;
  };

  // Swipe handlers for pagination
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (pagination && pagination.currentPage < pagination.totalPages) {
        const params = {
          search: debouncedSearch || undefined,
          subject: selectedSubjects.length > 0 ? selectedSubjects[0] : undefined,
          level: selectedLevels.length > 0 ? selectedLevels[0] : undefined,
          page: pagination.currentPage + 1,
          limit: 12,
        };
        getAllResources(params);
      }
    },
    onSwipedRight: () => {
      if (pagination && pagination.currentPage > 1) {
        const params = {
          search: debouncedSearch || undefined,
          subject: selectedSubjects.length > 0 ? selectedSubjects[0] : undefined,
          level: selectedLevels.length > 0 ? selectedLevels[0] : undefined,
          page: pagination.currentPage - 1,
          limit: 12,
        };
        getAllResources(params);
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  const filteredResources = resources.filter((resource) => {
    if (selectedFileTypes.length > 0 && !selectedFileTypes.includes(resource.fileType)) {
      return false;
    }
    return true;
  });

  return (
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...swipeHandlers}
    >
      <Navbar />
      
      {/* Pull to refresh indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-sl-green text-white transition-all duration-300"
          style={{ height: `${pullDistance}px`, opacity: pullDistance / 100 }}
        >
          <div className="flex items-center space-x-2">
            <FiRefreshCw className={`text-xl ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Pull to refresh'}</span>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description, or tags..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-sl-blue text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <FiFilter />
              <span>Filters</span>
            </button>
          </form>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 dark:bg-gray-800 dark:border dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-sl-blue hover:text-blue-700 flex items-center space-x-1"
                >
                  <FiX />
                  <span>Clear</span>
                </button>
              </div>

              {/* Subject Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3 dark:text-gray-300">Subject</h4>
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={() => toggleSubject(subject)}
                        className="w-4 h-4 text-sl-green rounded focus:ring-sl-green"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3 dark:text-gray-300">Level</h4>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <label key={level} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={() => toggleLevel(level)}
                        className="w-4 h-4 text-sl-green rounded focus:ring-sl-green"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3 dark:text-gray-300">File Type</h4>
                <div className="space-y-2">
                  {fileTypes.map((fileType) => (
                    <label key={fileType} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFileTypes.includes(fileType)}
                        onChange={() => toggleFileType(fileType)}
                        className="w-4 h-4 text-sl-green rounded focus:ring-sl-green"
                      />
                      <span className="text-sm text-gray-600 capitalize dark:text-gray-300">{fileType}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 dark:text-gray-300">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="latest">Latest</option>
                  <option value="downloads">Most Downloaded</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resource Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:border dark:border-gray-700">
                    <div className="h-48 skeleton" />
                    <div className="p-4 space-y-3">
                      <div className="h-6 skeleton rounded" />
                      <div className="h-4 skeleton rounded w-3/4" />
                      <div className="flex gap-2">
                        <div className="h-6 skeleton rounded w-1/3" />
                        <div className="h-6 skeleton rounded w-1/3" />
                      </div>
                      <div className="h-10 skeleton rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">No resources found</h3>
                <p className="text-gray-600 mb-4 dark:text-gray-300">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="text-sl-blue hover:text-blue-700 font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {pagination && `Showing ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} results`}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <ResourceCard key={resource._id} resource={resource} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg ${
                          page === pagination.page
                            ? 'bg-sl-blue text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Browse;
