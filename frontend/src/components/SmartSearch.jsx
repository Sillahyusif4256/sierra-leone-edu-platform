// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiClock, FiTrendingUp, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'ICT', 'Biology', 'Chemistry', 'Physics'];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('edushare_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Load trending searches (mock data - in production, fetch from API)
    setTrendingSearches(['Algebra', 'Photosynthesis', 'Essay Writing', 'Chemistry Formulas']);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch suggestions as user types
    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async (searchQuery) => {
    try {
      // In production, fetch from API
      // const response = await fetch(`/api/resources/suggestions?q=${searchQuery}`);
      // const data = await response.json();
      
      // Mock suggestions for now
      const mockSuggestions = [
        { type: 'resource', text: `${searchQuery} notes`, highlight: searchQuery },
        { type: 'resource', text: `${searchQuery} textbook`, highlight: searchQuery },
        { type: 'subject', text: subjects.find(s => s.toLowerCase().includes(searchQuery.toLowerCase())) || null, highlight: searchQuery },
      ].filter(s => s.text);

      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearch = (searchTerm = query) => {
    if (searchTerm.trim()) {
      // Save to recent searches
      const updatedRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      localStorage.setItem('edushare_recent_searches', JSON.stringify(updatedRecent));
      setRecentSearches(updatedRecent);

      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e) => {
    const allItems = [...suggestions, ...recentSearches, ...trendingSearches];
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selectedItem = allItems[selectedIndex];
      handleSearch(typeof selectedItem === 'string' ? selectedItem : selectedItem.text);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 text-gray-800 px-1 rounded">{part}</mark>
        : part
    );
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('edushare_recent_searches');
    setRecentSearches([]);
  };

  return (
    <div className="relative w-full max-w-2xl" ref={dropdownRef}>
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search resources, subjects, or topics..."
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setShowSuggestions(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          {query.length > 2 && suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase">Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion.text)}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 ${
                    selectedIndex === index ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <span className="text-gray-400">
                    {suggestion.type === 'resource' ? '📄' : '📚'}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {highlightText(suggestion.text, suggestion.highlight)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {recentSearches.length > 0 && query.length === 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase flex items-center space-x-2">
                  <FiClock />
                  <span>Recent</span>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-sl-blue hover:text-blue-700"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 ${
                    selectedIndex === suggestions.length + index ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <FiClock className="text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200">{search}</span>
                </button>
              ))}
            </div>
          )}

          {trendingSearches.length > 0 && query.length === 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase flex items-center space-x-2">
                <FiTrendingUp />
                <span>Trending</span>
              </div>
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 ${
                    selectedIndex === suggestions.length + recentSearches.length + index ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <FiTrendingUp className="text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200">{search}</span>
                </button>
              ))}
            </div>
          )}

          {suggestions.length === 0 && recentSearches.length === 0 && query.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <p>Start typing to search...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
