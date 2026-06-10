// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResourceCard from '../components/ResourceCard';
import { FiSearch, FiFilter, FiX, FiTrendingUp, FiClock } from 'react-icons/fi';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    subject: searchParams.get('subject') || '',
    level: searchParams.get('level') || '',
    fileType: searchParams.get('fileType') || '',
    sort: searchParams.get('sort') || 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('edushare_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fetch popular searches
  useEffect(() => {
    fetchPopularSearches();
  }, []);

  // Perform search when debounced query or filters change
  useEffect(() => {
    if (debouncedQuery) {
      performSearch();
    }
  }, [debouncedQuery, filters]);

  const fetchPopularSearches = async () => {
    try {
      const response = await fetch('/api/search/popular');
      const data = await response.json();
      setPopularSearches(data);
    } catch (error) {
      console.error('Error fetching popular searches:', error);
    }
  };

  const performSearch = async () => {
    if (!debouncedQuery) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: debouncedQuery,
        ...filters
      });

      const response = await fetch(`/api/resources/search?${params}`);
      const data = await response.json();
      setResults(data.resources || []);

      // Track search
      await fetch('/api/search/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchTerm: debouncedQuery,
          resultsCount: data.pagination?.total || 0
        })
      });

      // Save to recent searches
      if (!recentSearches.includes(debouncedQuery)) {
        const updated = [debouncedQuery, ...recentSearches].slice(0, 10);
        setRecentSearches(updated);
        localStorage.setItem('edushare_recent_searches', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query, ...filters });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSearchParams({ q: query, ...filters, [key]: value });
  };

  const clearFilter = (key) => {
    handleFilterChange(key, '');
  };

  const handlePopularSearch = (term) => {
    setQuery(term);
    setSearchParams({ q: term, ...filters });
  };

  const handleRecentSearch = (term) => {
    setQuery(term);
    setSearchParams({ q: term, ...filters });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('edushare_recent_searches');
  };

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'ICT', 'Biology', 'Chemistry', 'Physics', 'Other'];
  const levels = ['Primary', 'JSS', 'SSS', 'University', 'Other'];
  const fileTypes = ['pdf', 'video', 'image', 'document'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources by title, description, tags, or subject..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-800 dark:border-gray-600 dark:text-white text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sl-green text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-sl-green transition mb-4"
          >
            <FiFilter />
            <span>Filters</span>
          </button>

          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <select
                    value={filters.subject}
                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* File Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File Type</label>
                  <select
                    value={filters.fileType}
                    onChange={(e) => handleFilterChange('fileType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">All Types</option>
                    {fileTypes.map(type => (
                      <option key={type} value={type}>{type.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="latest">Latest</option>
                    <option value="downloads">Most Downloaded</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {filters.subject && (
                  <span className="bg-sl-green/10 text-sl-green px-3 py-1 rounded-full text-sm flex items-center">
                    {filters.subject}
                    <button onClick={() => clearFilter('subject')} className="ml-2 hover:text-red-500">
                      <FiX />
                    </button>
                  </span>
                )}
                {filters.level && (
                  <span className="bg-sl-green/10 text-sl-green px-3 py-1 rounded-full text-sm flex items-center">
                    {filters.level}
                    <button onClick={() => clearFilter('level')} className="ml-2 hover:text-red-500">
                      <FiX />
                    </button>
                  </span>
                )}
                {filters.fileType && (
                  <span className="bg-sl-green/10 text-sl-green px-3 py-1 rounded-full text-sm flex items-center">
                    {filters.fileType.toUpperCase()}
                    <button onClick={() => clearFilter('fileType')} className="ml-2 hover:text-red-500">
                      <FiX />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {query && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {loading ? 'Searching...' : `${results.length} results for "${query}"`}
            </h2>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(resource => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            ) : !loading && (
              <div className="text-center py-12">
                <FiSearch className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-300">Try different keywords or filters</p>
              </div>
            )}
          </div>
        )}

        {/* Popular Searches (when no query) */}
        {!query && (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                    <FiClock className="mr-2" />
                    Recent Searches
                  </h3>
                  <button onClick={clearRecentSearches} className="text-sm text-red-500 hover:text-red-700">
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => handleRecentSearch(term)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiTrendingUp className="mr-2" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(search => (
                  <button
                    key={search.term}
                    onClick={() => handlePopularSearch(search.term)}
                    className="px-4 py-2 bg-sl-green/10 text-sl-green rounded-full hover:bg-sl-green/20 transition"
                  >
                    {search.term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;
