// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import ProtectedRoute from '../components/ProtectedRoute';
import BottomSheet from '../components/BottomSheet';
import useResourceStore from '../store/resourceStore';
import useAuthStore from '../store/authStore';
import api from '../utils/api';
import { FiUpload, FiDownload, FiClock, FiSettings, FiTrash2, FiUser, FiLock, FiCamera, FiEye, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getMyResources, myResources, isLoading, deleteResource } = useResourceStore();
  const { user, logout } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('my-resources');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUploadSheet, setShowUploadSheet] = useState(false);

  useEffect(() => {
    getMyResources();
    setProfileData({ ...profileData, name: user?.name || '', email: user?.email || '' });
  }, [user]);

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    const result = await deleteResource(id);
    if (result.success) {
      toast.success('Resource deleted successfully');
      getMyResources();
    } else {
      toast.error(result.error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const updateData = {
        name: profileData.name,
        email: profileData.email,
      };

      if (profileData.newPassword) {
        updateData.oldPassword = profileData.oldPassword;
        updateData.newPassword = profileData.newPassword;
      }

      const response = await api.put('/auth/update-profile', updateData);
      toast.success('Profile updated successfully');
      
      // Update user in authStore
      const { getMe } = useAuthStore.getState();
      await getMe();
      
      setProfileData({
        ...profileData,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleProfilePictureUpload(acceptedFiles[0]);
    }
  };

  const handleProfilePictureUpload = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await api.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile picture uploaded successfully');
      
      // Update user in authStore
      const { getMe } = useAuthStore.getState();
      await getMe();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload profile picture');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const stats = {
    myUploads: myResources.length,
    totalDownloads: myResources.reduce((sum, r) => sum + r.downloads, 0),
    pendingApproval: myResources.filter((r) => !r.isApproved).length,
    resourcesViewed: myResources.reduce((sum, r) => sum + r.views, 0),
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 mt-2">Manage your resources and account settings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 md:grid">
            <div className="bg-white rounded-lg shadow-md p-6 min-w-[280px] md:min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">My Uploads</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.myUploads}</p>
                </div>
                <FiUpload className="w-12 h-12 text-sl-green" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 min-w-[280px] md:min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Downloads</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalDownloads}</p>
                </div>
                <FiDownload className="w-12 h-12 text-sl-blue" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 min-w-[280px] md:min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Approval</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingApproval}</p>
                </div>
                <FiClock className="w-12 h-12 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 min-w-[280px] md:min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Resources Viewed</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.resourcesViewed}</p>
                </div>
                <FiEye className="w-12 h-12 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('my-resources')}
                  className={`py-4 px-1 border-b-2 font-medium transition ${
                    activeTab === 'my-resources'
                      ? 'border-sl-blue text-sl-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Resources
                </button>
                <button
                  onClick={() => setActiveTab('profile-settings')}
                  className={`py-4 px-1 border-b-2 font-medium transition ${
                    activeTab === 'profile-settings'
                      ? 'border-sl-blue text-sl-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile Settings
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* My Resources Tab */}
              {activeTab === 'my-resources' && (
                <>
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Spinner />
                    </div>
                  ) : myResources.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No resources yet</h3>
                      <p className="text-gray-600 mb-4">Start sharing your educational content</p>
                      <button
                        onClick={() => navigate('/upload')}
                        className="bg-sl-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                      >
                        Upload Resource
                      </button>
                    </div>
                  ) : (
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
                          {myResources.map((resource) => (
                            <tr key={resource._id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => navigate(`/resource/${resource._id}`)}
                                  className="text-sl-blue hover:text-blue-700 font-medium"
                                >
                                  {resource.title}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-gray-600">{resource.subject}</td>
                              <td className="py-3 px-4 text-gray-600">{resource.level}</td>
                              <td className="py-3 px-4">
                                {resource.isApproved ? (
                                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                    <span className="mr-1">✅</span> Approved
                                  </span>
                                ) : (
                                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                    <span className="mr-1">⚠️</span> Pending
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-gray-600">{resource.downloads}</td>
                              <td className="py-3 px-4 text-gray-600">{formatDate(resource.createdAt)}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => navigate(`/resource/${resource._id}`)}
                                    className="text-sl-blue hover:text-blue-700 transition"
                                    title="View"
                                  >
                                    <FiEye className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteResource(resource._id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    title="Delete"
                                  >
                                    <FiTrash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* Profile Settings Tab */}
              {activeTab === 'profile-settings' && (
                <div className="max-w-2xl">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    {/* Profile Picture */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Picture
                      </label>
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-sl-blue rounded-full flex items-center justify-center text-white text-3xl font-semibold overflow-hidden">
                          {user?.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{user?.name?.charAt(0) || 'U'}</span>
                          )}
                        </div>
                        <div {...getRootProps()} className="cursor-pointer">
                          <input {...getInputProps()} />
                          <button
                            type="button"
                            className="flex items-center space-x-2 text-sl-blue hover:text-blue-700 transition"
                          >
                            <FiCamera />
                            <span>Change Photo</span>
                          </button>
                          <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                        />
                      </div>
                    </div>

                    {/* Change Password */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              value={profileData.oldPassword}
                              onChange={(e) => setProfileData({ ...profileData, oldPassword: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              value={profileData.newPassword}
                              onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              value={profileData.confirmPassword}
                              onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full bg-sl-blue hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Button for Quick Upload */}
        <button
          onClick={() => setShowUploadSheet(true)}
          className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-sl-green text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-green-600 transition"
          aria-label="Quick upload"
        >
          <FiPlus className="w-6 h-6" />
        </button>

        {/* Quick Upload Bottom Sheet */}
        <BottomSheet
          isOpen={showUploadSheet}
          onClose={() => setShowUploadSheet(false)}
          height="auto"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Upload</h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                setShowUploadSheet(false);
                navigate('/upload');
              }}
              className="w-full flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <FiUpload className="w-6 h-6 text-sl-green" />
              <span>Upload a file</span>
            </button>
            <button
              onClick={() => {
                setShowUploadSheet(false);
                navigate('/upload');
              }}
              className="w-full flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <FiCamera className="w-6 h-6 text-sl-blue" />
              <span>Take a photo</span>
            </button>
          </div>
        </BottomSheet>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
