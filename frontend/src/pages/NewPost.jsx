// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAuthStore from '../store/authStore';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const NewPost = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'ICT',
    'Biology',
    'Chemistry',
    'Physics',
    'Other',
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          subject,
          tags,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Post created successfully!');
        navigate(`/forum/post/${data._id}`);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-sl-blue mb-6 transition dark:text-gray-300"
        >
          <FiArrowLeft />
          <span>Back to Forum</span>
        </button>

        {/* Create Post Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">Ask a Question</h1>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question? Be specific."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                {title.length}/200 characters
              </p>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Body */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                placeholder="Include all the information someone would need to answer your question..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                {body.length}/5000 characters
              </p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Tags (optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-sl-green text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
                >
                  <FiPlus />
                  <span>Add</span>
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-sl-green/10 text-sl-green px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500 transition"
                      >
                        <FiX />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-sl-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Question'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Tips */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-sl-blue p-4 rounded">
            <h3 className="font-semibold text-gray-800 mb-2 dark:text-white">Tips for a good question:</h3>
            <ul className="text-sm text-gray-600 space-y-1 dark:text-gray-300">
              <li>• Be specific and concise</li>
              <li>• Include relevant context and details</li>
              <li>• Use appropriate tags to help others find your question</li>
              <li>• Check if your question has already been asked</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewPost;
