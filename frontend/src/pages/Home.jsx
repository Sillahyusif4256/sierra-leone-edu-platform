// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResourceCard from '../components/ResourceCard';
import Spinner from '../components/Spinner';
import useResourceStore from '../store/resourceStore';
import useAuthStore from '../store/authStore';
import { FiBookOpen, FiUpload, FiUsers, FiDownload, FiStar, FiArrowRight, FiClock, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  const { getAllResources, resources, isLoading } = useResourceStore();
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [popularInLevel, setPopularInLevel] = useState([]);
  const [newInSubjects, setNewInSubjects] = useState([]);
  const [loadingPersonalized, setLoadingPersonalized] = useState(false);

  const subjects = [
    { name: 'Mathematics', icon: '📐', color: 'bg-blue-500' },
    { name: 'Science', icon: '🔬', color: 'bg-green-500' },
    { name: 'English', icon: '📚', color: 'bg-purple-500' },
    { name: 'History', icon: '🏛️', color: 'bg-yellow-500' },
    { name: 'Geography', icon: '🌍', color: 'bg-teal-500' },
    { name: 'ICT', icon: '💻', color: 'bg-indigo-500' },
    { name: 'Biology', icon: '🧬', color: 'bg-pink-500' },
    { name: 'Chemistry', icon: '⚗️', color: 'bg-orange-500' },
    { name: 'Physics', icon: '⚛️', color: 'bg-red-500' },
  ];

  useEffect(() => {
    getAllResources({ limit: 6 });
    fetchStats();
    if (user) {
      fetchPersonalizedContent();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/resources/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPersonalizedContent = async () => {
    setLoadingPersonalized(true);
    try {
      // Fetch recommended resources
      const recRes = await fetch(`/api/resources/recommended/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`
        }
      });
      const recData = await recRes.json();
      setRecommended(recData || []);

      // Fetch trending for popular in level
      const trendingRes = await fetch('/api/resources/trending');
      const trendingData = await trendingRes.json();
      setPopularInLevel(trendingData?.slice(0, 4) || []);

      // Fetch recently viewed from localStorage
      const viewed = JSON.parse(localStorage.getItem('edushare_recently_viewed') || '[]');
      if (viewed.length > 0) {
        const recentRes = await fetch(`/api/resources?limit=4`);
        const recentData = await recentRes.json();
        const filtered = recentData.resources?.filter(r => viewed.includes(r._id)).slice(0, 4) || [];
        setRecentlyViewed(filtered);
      }

      // Fetch new in subjects (recent resources)
      const newRes = await fetch(`/api/resources?sort=latest&limit=4`);
      const newData = await newRes.json();
      setNewInSubjects(newData.resources?.slice(0, 4) || []);
    } catch (error) {
      console.error('Error fetching personalized content:', error);
    } finally {
      setLoadingPersonalized(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sl-green via-white to-sl-blue py-20 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl font-bold text-gray-800 mb-6 dark:text-white">
                Free Educational Resources for Sierra Leone
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl dark:text-gray-300">
                Empowering students and teachers across Sierra Leone with quality educational materials. 
                Supporting Quality Education and bridging the education gap in our communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/browse"
                  className="bg-sl-blue hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                >
                  <FiBookOpen />
                  <span>Browse Resources</span>
                </Link>
                <Link
                  to="/upload"
                  className="bg-sl-green hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                >
                  <FiUpload />
                  <span>Share Your Knowledge</span>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <img src="/student.png.jpeg" alt="Students learning" className="max-w-md w-full h-auto" style={{ background: 'transparent' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Sections (for logged-in users) */}
      {user && (
        <div className="space-y-12 py-16 bg-gray-50 dark:bg-gray-900">
          {/* Continue Where You Left Off */}
          {recentlyViewed.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  <FiClock className="mr-2" />
                  Continue Where You Left Off
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentlyViewed.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            </section>
          )}

          {/* Recommended For You */}
          {recommended.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  <FiStar className="mr-2" />
                  Recommended For You
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommended.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            </section>
          )}

          {/* Popular in Your Level */}
          {popularInLevel.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  <FiTrendingUp className="mr-2" />
                  Popular in {user.role || 'Your Level'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularInLevel.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            </section>
          )}

          {/* New in Your Subjects */}
          {newInSubjects.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  <FiBookOpen className="mr-2" />
                  New in Your Subjects
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newInSubjects.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-sl-green/10 to-sl-green/5 rounded-xl">
                <FiBookOpen className="h-12 w-12 mx-auto text-sl-green mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-2 dark:text-white">{stats.totalResources}</h3>
                <p className="text-gray-600 dark:text-gray-300">Total Resources</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-sl-blue/10 to-sl-blue/5 rounded-xl">
                <FiUsers className="h-12 w-12 mx-auto text-sl-blue mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-2 dark:text-white">{stats.totalUsers}</h3>
                <p className="text-gray-600 dark:text-gray-300">Total Users</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl">
                <FiDownload className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-2 dark:text-white">{stats.totalDownloads}</h3>
                <p className="text-gray-600 dark:text-gray-300">Total Downloads</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl">
                <FiStar className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-2 dark:text-white">{stats.totalSubjects}</h3>
                <p className="text-gray-600 dark:text-gray-300">Subjects Covered</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Featured Resources</h2>
            <Link to="/browse" className="text-sl-blue hover:text-blue-700 font-semibold flex items-center space-x-2">
              <span className="dark:text-gray-300">View All</span>
              <FiArrowRight />
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.slice(0, 6).map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subject Categories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center dark:text-white">Browse by Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {subjects.map((subject) => (
              <Link
                key={subject.name}
                to={`/browse?subject=${subject.name}`}
                className={`${subject.color} hover:opacity-90 text-white p-6 rounded-xl text-center transition`}
              >
                <div className="text-4xl mb-2">{subject.icon}</div>
                <h3 className="font-semibold">{subject.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center dark:text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-sl-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">Register</h3>
              <p className="text-gray-600 dark:text-gray-300">Create your free account as a student or teacher</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-sl-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">Upload or Browse</h3>
              <p className="text-gray-600 dark:text-gray-300">Share your knowledge or discover resources</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">Learn & Grow</h3>
              <p className="text-gray-600 dark:text-gray-300">Download materials and enhance your education</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
