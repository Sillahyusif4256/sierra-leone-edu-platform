// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useLanguageStore from '../store/languageStore';
import useThemeStore from '../store/themeStore';
import { FiLogOut, FiUser, FiUpload, FiHome, FiBookOpen, FiGlobe, FiChevronDown, FiMoon, FiSun, FiBarChart2, FiBell, FiSearch, FiMessageSquare, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Fetch notifications for logged-in users
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`
        }
      });
      const data = await response.json();
      setNotifications(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`
        }
      });
      const data = await response.json();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`
        }
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`
        }
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'resource_approved':
        return '✅';
      case 'new_comment':
        return '💬';
      case 'new_download':
        return '📥';
      case 'resource_rejected':
        return '❌';
      case 'welcome':
        return '🎉';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'krio' : 'english');
  };

  return (
    <nav className="bg-sl-blue text-white shadow-lg dark:bg-gray-900 dark:border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + EduShare SL */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="EduShare SL Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold hidden sm:block">EduShare SL</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition min-h-[44px] min-w-[44px]"
            aria-label="Toggle menu"
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-sl-green transition min-h-[44px] min-w-[44px] flex items-center justify-center" aria-current={window.location.pathname === '/' ? 'page' : undefined}>
              <FiHome aria-hidden="true" />
              <span>{t('home')}</span>
            </Link>
            <Link to="/browse" className="flex items-center space-x-1 hover:text-sl-green transition min-h-[44px] min-w-[44px] flex items-center justify-center" aria-current={window.location.pathname === '/browse' ? 'page' : undefined}>
              <FiBookOpen aria-hidden="true" />
              <span>{t('browse')}</span>
            </Link>
            <Link to="/forum" className="flex items-center space-x-1 hover:text-sl-green transition min-h-[44px] min-w-[44px] flex items-center justify-center" aria-current={window.location.pathname === '/forum' ? 'page' : undefined}>
              <FiMessageSquare aria-hidden="true" />
              <span>Forum</span>
            </Link>
            <Link to="/ai-assistant" className="flex items-center space-x-1 hover:text-sl-green transition min-h-[44px] min-w-[44px] flex items-center justify-center" aria-current={window.location.pathname === '/ai-assistant' ? 'page' : undefined}>
              <span aria-hidden="true">✨</span>
              <span>AI Assistant</span>
            </Link>
            {user && (user.role === 'teacher' || user.role === 'admin') && (
              <Link to="/upload" className="flex items-center space-x-1 hover:text-sl-green transition min-h-[44px] min-w-[44px] flex items-center justify-center" aria-current={window.location.pathname === '/upload' ? 'page' : undefined}>
                <FiUpload aria-hidden="true" />
                <span>{t('upload')}</span>
              </Link>
            )}
          </div>

          {/* Right Side: Search + Notifications + Theme Toggle + Language Toggle + Auth State */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center space-x-1 hover:text-sl-green transition px-2 py-1 rounded min-h-[44px] min-w-[44px]"
                aria-label="Search resources"
                aria-expanded={showSearch}
              >
                <FiSearch className="text-xl" />
              </button>

              {showSearch && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-2 z-50 dark:bg-gray-800 dark:border dark:border-gray-700">
                  <form onSubmit={handleSearch} className="flex">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search resources..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-sl-green text-white rounded-r-lg hover:bg-green-600 transition"
                    >
                      <FiSearch />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center space-x-1 hover:text-sl-green transition px-2 py-1 rounded min-h-[44px] min-w-[44px]"
                  aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
                  aria-expanded={showNotifications}
                >
                  <FiBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" aria-label={`${unreadCount} unread notifications`}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 dark:bg-gray-800 dark:border dark:border-gray-700">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-gray-800 dark:text-white">Notifications</span>
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-sl-blue hover:text-blue-700"
                      >
                        Mark all as read
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() => {
                              markAsRead(notification._id);
                              if (notification.resourceId) {
                                navigate(`/resource/${notification.resourceId}`);
                              }
                              setShowNotifications(false);
                            }}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 dark:text-white">{notification.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {formatTimeAgo(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="block px-4 py-2 text-sm text-sl-blue hover:text-blue-700 text-center"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1 hover:text-sl-green transition px-2 py-1 rounded border border-white/20 dark:border-gray-700 min-h-[44px] min-w-[44px]"
              title="Toggle Dark Mode"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 hover:text-sl-green transition px-2 py-1 rounded border border-white/20 dark:border-gray-700 min-h-[44px] min-w-[44px]"
              title="Switch Language"
              aria-label={`Switch to ${language === 'english' ? 'Krio' : 'English'} language`}
            >
              <FiGlobe />
              <span className="text-sm font-semibold">{language === 'english' ? 'EN' : 'KR'}</span>
            </button>

            {/* Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 hover:text-sl-green transition px-2 py-1 rounded min-h-[44px] min-w-[44px]"
                  aria-label="User menu"
                  aria-expanded={showDropdown}
                >
                  <div className="w-8 h-8 bg-sl-green rounded-full flex items-center justify-center text-white font-semibold overflow-hidden" aria-hidden="true">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user.name?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <span className="text-sm">{user.name}</span>
                  <FiChevronDown aria-hidden="true" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 dark:bg-gray-800 dark:border dark:border-gray-700">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <FiUser className="inline mr-2" />
                      {t('dashboard')}
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/analytics"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <FiBarChart2 className="inline mr-2" />
                        Analytics
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <FiUser className="inline mr-2" />
                        {t('admin')}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <FiLogOut className="inline mr-2" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-sl-green transition">
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-sl-green hover:bg-green-600 px-4 py-2 rounded-lg transition"
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-sl-blue dark:bg-gray-900 border-t border-white/10 dark:border-gray-700">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition"
              >
                <FiHome />
                <span>{t('home')}</span>
              </Link>
              <Link
                to="/browse"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition"
              >
                <FiBookOpen />
                <span>{t('browse')}</span>
              </Link>
              <Link
                to="/forum"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition"
              >
                <FiMessageSquare />
                <span>Forum</span>
              </Link>
              <Link
                to="/ai-assistant"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition"
              >
                <span>✨</span>
                <span>AI Assistant</span>
              </Link>
              {user && (user.role === 'teacher' || user.role === 'admin') && (
                <Link
                  to="/upload"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition"
                >
                  <FiUpload />
                  <span>{t('upload')}</span>
                </Link>
              )}
              <div className="border-t border-white/10 dark:border-gray-700 pt-3">
                <button
                  onClick={() => {
                    setShowSearch(!showSearch);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition w-full"
                >
                  <FiSearch />
                  <span>Search</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition w-full"
                >
                  {theme === 'dark' ? <FiSun /> : <FiMoon />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition w-full"
                >
                  <FiGlobe />
                  <span>{language === 'english' ? 'Switch to Krio' : 'Switch to English'}</span>
                </button>
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition"
                    >
                      <FiUser />
                      <span>{t('dashboard')}</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/analytics"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition"
                      >
                        <FiBarChart2 />
                        <span>Analytics</span>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition"
                      >
                        <FiUser />
                        <span>{t('admin')}</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition w-full"
                    >
                      <FiLogOut />
                      <span>{t('logout')}</span>
                    </button>
                  </>
                )}
                {!user && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition"
                    >
                      <span>{t('login')}</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 py-2 text-white hover:text-sl-green transition"
                    >
                      <span>{t('register')}</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
