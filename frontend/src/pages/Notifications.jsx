// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiCheck, FiTrash2, FiFilter } from 'react-icons/fi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`
        }
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
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
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
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

  const getGroupLabel = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffDays = Math.floor((now - notificationDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return 'This Week';
    return 'Older';
  };

  const groupNotifications = (notifications) => {
    const groups = {};
    notifications.forEach(notification => {
      const group = getGroupLabel(notification.createdAt);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(notification);
    });
    return groups;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const groupedNotifications = groupNotifications(filteredNotifications);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sl-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Notifications</h1>
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 bg-sl-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiCheck />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center space-x-4">
            <FiFilter className="text-gray-600 dark:text-gray-300" />
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'all' ? 'bg-sl-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'unread' ? 'bg-sl-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'read' ? 'bg-sl-green text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                Read
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No notifications</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {filter === 'unread' ? 'No unread notifications' : 'You have no notifications'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
              <div key={group}>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{group}</h2>
                <div className="space-y-3">
                  {groupNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition ${
                        !notification.isRead ? 'border-l-4 border-sl-blue' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification._id);
                        if (notification.resourceId) {
                          navigate(`/resource/${notification.resourceId}`);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1">
                            <p className={`text-gray-800 dark:text-white ${!notification.isRead ? 'font-semibold' : ''}`}>
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition p-2"
                          title="Delete notification"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Notifications;
