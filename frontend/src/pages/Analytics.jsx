// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { FiUsers, FiFileText, FiDownload, FiActivity, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const COLORS = ['#1EB53A', '#0072C6', '#FFD700', '#FF6B6B', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71', '#F39C12', '#1ABC9C'];

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [uploadsOverTime, setUploadsOverTime] = useState([]);
  const [downloadsPerSubject, setDownloadsPerSubject] = useState([]);
  const [resourceDistribution, setResourceDistribution] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [topResources, setTopResources] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [geographicDistribution, setGeographicDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
    // Auto-refresh activity every 30 seconds
    const interval = setInterval(() => {
      fetchRecentActivity();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        overviewRes,
        uploadsRes,
        downloadsRes,
        distributionRes,
        registrationsRes,
        topResourcesRes,
        topContributorsRes,
        activityRes,
        geographicRes
      ] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/analytics/uploads-over-time'),
        api.get('/analytics/downloads-per-subject'),
        api.get('/analytics/resource-distribution'),
        api.get('/analytics/user-registrations'),
        api.get('/analytics/top-resources'),
        api.get('/analytics/top-contributors'),
        api.get('/analytics/recent-activity'),
        api.get('/analytics/geographic-distribution')
      ]);

      setOverview(overviewRes.data);
      setUploadsOverTime(uploadsRes.data);
      setDownloadsPerSubject(downloadsRes.data);
      setResourceDistribution(distributionRes.data);
      setUserRegistrations(registrationsRes.data);
      setTopResources(topResourcesRes.data);
      setTopContributors(topContributorsRes.data);
      setRecentActivity(activityRes.data);
      setGeographicDistribution(geographicRes.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await api.get('/analytics/recent-activity');
      setRecentActivity(res.data);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const StatCard = ({ title, value, growth, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
          <div className="flex items-center mt-2">
            {growth >= 0 ? (
              <span className="text-green-500 text-sm font-medium flex items-center">
                <FiTrendingUp className="mr-1" />
                {growth.toFixed(1)}%
              </span>
            ) : (
              <span className="text-red-500 text-sm font-medium flex items-center">
                <FiTrendingDown className="mr-1" />
                {growth.toFixed(1)}%
              </span>
            )}
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">this month</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-sl-green/10 rounded-lg flex items-center justify-center">
          <Icon className="text-sl-green text-xl" />
        </div>
      </div>
    </div>
  );

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Analytics Dashboard</h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={overview?.totalUsers || 0}
            growth={overview?.userGrowth || 0}
            icon={FiUsers}
          />
          <StatCard
            title="Total Resources"
            value={overview?.totalResources || 0}
            growth={overview?.resourceGrowth || 0}
            icon={FiFileText}
          />
          <StatCard
            title="Total Downloads"
            value={overview?.totalDownloads || 0}
            growth={overview?.downloadsGrowth || 0}
            icon={FiDownload}
          />
          <StatCard
            title="Active Users Today"
            value={overview?.activeUsersToday || 0}
            growth={0}
            icon={FiActivity}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Uploads */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Daily Uploads (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={uploadsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uploads" stroke="#1EB53A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Downloads per Subject */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Downloads per Subject</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={downloadsPerSubject}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="downloads" fill="#0072C6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Resource Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Resource Distribution by Level</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resourceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {resourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* User Registrations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">User Registrations (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="registrations" stroke="#1EB53A" fill="#1EB53A" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Top 10 Most Downloaded Resources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topResources} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="title" type="category" width={200} />
              <Tooltip />
              <Legend />
              <Bar dataKey="downloads" fill="#1EB53A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-200">{activity.message}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Top Contributors</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Uploads</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Downloads</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {topContributors.map((contributor) => (
                    <tr key={contributor.rank} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">#{contributor.rank}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{contributor.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{contributor.uploads}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{contributor.totalDownloads}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{contributor.badge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Geographic Distribution (Uploads by District)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">District</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Uploads</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {geographicDistribution.map((district) => (
                  <tr key={district.district} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{district.district}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{district.uploads}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">
                      {((district.uploads / geographicDistribution.reduce((sum, d) => sum + d.uploads, 0)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Analytics;
