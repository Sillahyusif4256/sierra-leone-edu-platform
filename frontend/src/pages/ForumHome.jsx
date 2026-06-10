// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { FiMessageSquare, FiUsers, FiSearch, FiTrendingUp, FiClock } from 'react-icons/fi';

const ForumHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');

  const subjects = [
    { name: 'Mathematics', icon: '📐', color: 'bg-blue-500' },
    { name: 'Science', icon: '🔬', color: 'bg-green-500' },
    { name: 'English', icon: '📝', color: 'bg-purple-500' },
    { name: 'History', icon: '📚', color: 'bg-yellow-500' },
    { name: 'Geography', icon: '🌍', color: 'bg-teal-500' },
    { name: 'ICT', icon: '💻', color: 'bg-indigo-500' },
    { name: 'Biology', icon: '🧬', color: 'bg-pink-500' },
    { name: 'Chemistry', icon: '⚗️', color: 'bg-orange-500' },
    { name: 'Physics', icon: '⚛️', color: 'bg-red-500' },
    { name: 'Other', icon: '📁', color: 'bg-gray-500' },
  ];

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [selectedSubject, searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSubject) params.append('subject', selectedSubject);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '10');

      const response = await fetch(`/api/forum/posts?${params}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/forum/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchQuery, subject: selectedSubject });
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setSearchParams({ subject });
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sl-green via-white to-sl-blue py-16 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 dark:text-white">
              Ask Questions, Share Knowledge
            </h1>
            <p className="text-xl text-gray-600 mb-8 dark:text-gray-300">
              Connect with students and teachers across Sierra Leone
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search forum posts..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-sl-green text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
                >
                  <FiSearch />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Subject Categories */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Browse by Subject</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.name}
                    onClick={() => handleSubjectClick(subject.name === selectedSubject ? '' : subject.name)}
                    className={`${subject.color} hover:opacity-90 text-white p-4 rounded-xl text-center transition ${
                      selectedSubject === subject.name ? 'ring-4 ring-offset-2 ring-sl-green' : ''
                    }`}
                  >
                    <div className="text-3xl mb-1">{subject.icon}</div>
                    <div className="text-sm font-semibold">{subject.name}</div>
                    {stats && (
                      <div className="text-xs opacity-80 mt-1">
                        {stats.postsBySubject?.find(s => s._id === subject.name)?.count || 0} posts
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Latest Questions */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {selectedSubject ? `${selectedSubject} Questions` : 'Latest Questions'}
                </h2>
                <button
                  onClick={() => setSelectedSubject('')}
                  className="text-sm text-sl-blue hover:text-blue-700"
                >
                  Clear filter
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <FiMessageSquare className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">No posts yet</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Be the first to ask a question!</p>
                  <Link
                    to="/forum/new-post"
                    className="inline-block bg-sl-green text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Ask a Question
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Link
                      key={post._id}
                      to={`/forum/post/${post._id}`}
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-start gap-4">
                        {/* Vote Count */}
                        <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2 min-w-[60px]">
                          <span className="text-xl font-bold text-gray-800 dark:text-white">{post.votes}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">votes</span>
                        </div>

                        {/* Post Content */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-sl-blue dark:text-white dark:hover:text-sl-blue">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 dark:text-gray-300">
                            {post.body}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="bg-sl-green/10 text-sl-green px-2 py-1 rounded-full text-xs font-medium">
                              {post.subject}
                            </span>
                            {post.isResolved && (
                              <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                                ✓ Solved
                              </span>
                            )}
                            <span>by {post.author?.name || 'Unknown'}</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <FiMessageSquare />
                              <span>{post.answerCount || 0} answers</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <FiClock />
                              <span>{formatDate(post.createdAt)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Forum Stats */}
            {stats && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 dark:text-white">Forum Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Total Posts</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{stats.totalPosts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Total Answers</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{stats.totalAnswers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Solved</span>
                    <span className="font-semibold text-green-600">{stats.resolvedPosts}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Most Active Members */}
            {stats && stats.activeUsers && stats.activeUsers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 dark:text-white flex items-center">
                  <FiUsers className="mr-2" />
                  Most Active
                </h3>
                <div className="space-y-3">
                  {stats.activeUsers.map((user) => (
                    <div key={user._id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-sl-blue rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 dark:text-white text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.postCount} posts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ask Question Button */}
            <Link
              to="/forum/new-post"
              className="block w-full bg-sl-green text-white text-center py-3 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForumHome;
