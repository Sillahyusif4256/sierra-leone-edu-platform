// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import ProtectedRoute from '../components/ProtectedRoute';
import useResourceStore from '../store/resourceStore';
import useAuthStore from '../store/authStore';
import { FiUsers, FiBookOpen, FiClock, FiDownload, FiCheck, FiX, FiEye, FiTrash2, FiShield, FiBarChart2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { getPendingResources, pendingResources, getAllResources, resources, approveResource, deleteResource } = useResourceStore();
  const { user } = useAuthStore();
  
  const [activeSection, setActiveSection] = useState('overview');
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [pendingRes, allRes, statsData, usersData] = await Promise.all([
        getPendingResources(),
        getAllResources({ limit: 100 }),
        fetch('/api/resources/stats').then((res) => res.json()),
        fetch('/api/users').then((res) => res.json()),
      ]);
      setStats(statsData);
      setAllUsers(usersData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const result = await approveResource(id);
    if (result.success) {
      toast.success('Resource approved successfully');
      fetchAdminData();
    } else {
      toast.error(result.error);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject/delete this resource?')) return;
    
    const result = await deleteResource(id);
    if (result.success) {
      toast.success('Resource rejected successfully');
      fetchAdminData();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    const result = await deleteResource(id);
    if (result.success) {
      toast.success('Resource deleted successfully');
      fetchAdminData();
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        toast.success('User role updated successfully');
        fetchAdminData();
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('User deleted successfully');
        fetchAdminData();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getChartData = () => {
    if (!resources) return [];
    
    const subjectCounts = {};
    resources.forEach((resource) => {
      subjectCounts[resource.subject] = (subjectCounts[resource.subject] || 0) + 1;
    });
    
    return Object.entries(subjectCounts).map(([subject, count]) => ({
      subject,
      count,
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!user || user.role !== 'admin') {
    return (
      <ProtectedRoute adminOnly>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-sl-blue text-white fixed h-full">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeSection === 'overview' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <FiBarChart2 />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveSection('pending')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeSection === 'pending' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <FiClock />
                <span>Pending Resources</span>
              </button>
              <button
                onClick={() => setActiveSection('all-resources')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeSection === 'all-resources' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <FiBookOpen />
                <span>All Resources</span>
              </button>
              <button
                onClick={() => setActiveSection('all-users')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeSection === 'all-users' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <FiUsers />
                <span>All Users</span>
              </button>
              <button
                onClick={() => setActiveSection('reports')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeSection === 'reports' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <FiShield />
                <span>Reports</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <Navbar />
          
          <div className="p-8">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <>
                {/* Overview Section */}
                {activeSection === 'overview' && (
                  <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">Total Users</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.totalUsers || 0}</p>
                          </div>
                          <FiUsers className="w-12 h-12 text-sl-blue" />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">Total Resources</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.totalResources || 0}</p>
                          </div>
                          <FiBookOpen className="w-12 h-12 text-sl-green" />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">Pending Approvals</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{pendingResources.length}</p>
                          </div>
                          <FiClock className="w-12 h-12 text-yellow-500" />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">Total Downloads</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.totalDownloads || 0}</p>
                          </div>
                          <FiDownload className="w-12 h-12 text-purple-500" />
                        </div>
                      </div>
                    </div>

                    {/* Export Button */}
                    <div className="mb-8">
                      <button
                        onClick={() => {
                          const token = localStorage.getItem('token');
                          window.open('/api/resources/export', '_blank');
                        }}
                        className="bg-sl-green hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center space-x-2"
                      >
                        <FiDownload />
                        <span>Export Data (JSON)</span>
                      </button>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Uploads by Subject</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#1EB53A" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                      <div className="space-y-4">
                        {resources.slice(0, 5).map((resource) => (
                          <div key={resource._id} className="flex items-center justify-between py-2 border-b">
                            <div>
                              <p className="font-medium text-gray-800">{resource.title}</p>
                              <p className="text-sm text-gray-600">
                                Uploaded by {resource.uploadedBy?.name || 'Unknown'} • {formatDate(resource.createdAt)}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              resource.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {resource.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Pending Resources Section */}
                {activeSection === 'pending' && (
                  <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Resources</h1>
                    <div className="bg-white rounded-lg shadow-md">
                      {pendingResources.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">✅</div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">No pending resources</h3>
                          <p className="text-gray-600">All resources have been reviewed</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Level</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Uploader</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pendingResources.map((resource) => (
                                <tr key={resource._id} className="border-b hover:bg-gray-50">
                                  <td className="py-3 px-4 font-medium">{resource.title}</td>
                                  <td className="py-3 px-4 text-gray-600">{resource.subject}</td>
                                  <td className="py-3 px-4 text-gray-600">{resource.level}</td>
                                  <td className="py-3 px-4 text-gray-600">{resource.uploadedBy?.name || 'Unknown'}</td>
                                  <td className="py-3 px-4 text-gray-600">{formatDate(resource.createdAt)}</td>
                                  <td className="py-3 px-4 text-gray-600 capitalize">{resource.fileType}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => window.open(resource.fileURL, '_blank')}
                                        className="text-sl-blue hover:text-blue-700 transition"
                                        title="Preview"
                                      >
                                        <FiEye className="w-5 h-5" />
                                      </button>
                                      <button
                                        onClick={() => handleApprove(resource._id)}
                                        className="text-green-500 hover:text-green-700 transition"
                                        title="Approve"
                                      >
                                        <FiCheck className="w-5 h-5" />
                                      </button>
                                      <button
                                        onClick={() => handleReject(resource._id)}
                                        className="text-red-500 hover:text-red-700 transition"
                                        title="Reject"
                                      >
                                        <FiX className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* All Resources Section */}
                {activeSection === 'all-resources' && (
                  <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">All Resources</h1>
                    <div className="bg-white rounded-lg shadow-md">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Level</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Downloads</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resources.map((resource) => (
                              <tr key={resource._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{resource.title}</td>
                                <td className="py-3 px-4 text-gray-600">{resource.subject}</td>
                                <td className="py-3 px-4 text-gray-600">{resource.level}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    resource.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {resource.isApproved ? 'Approved' : 'Pending'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-gray-600">{resource.downloads}</td>
                                <td className="py-3 px-4 text-gray-600">{formatDate(resource.createdAt)}</td>
                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => handleDeleteResource(resource._id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    title="Delete"
                                  >
                                    <FiTrash2 className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* All Users Section */}
                {activeSection === 'all-users' && (
                  <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">All Users</h1>
                    <div className="bg-white rounded-lg shadow-md">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Join Date</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allUsers.map((user) => (
                              <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{user.name}</td>
                                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                <td className="py-3 px-4">
                                  <select
                                    value={user.role}
                                    onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                                  >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                </td>
                                <td className="py-3 px-4 text-gray-600">{formatDate(user.createdAt)}</td>
                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    title="Delete User"
                                  >
                                    <FiTrash2 className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* Reports Section */}
                {activeSection === 'reports' && (
                  <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Reports coming soon</h3>
                        <p className="text-gray-600">Detailed analytics and reporting features will be added soon</p>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPanel;
