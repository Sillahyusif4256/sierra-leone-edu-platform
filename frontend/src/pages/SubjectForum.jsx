// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { FiMessageSquare, FiClock, FiArrowLeft } from 'react-icons/fi';

const SubjectForum = () => {
  const { subject } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const subjectIcons = {
    Mathematics: '📐',
    Science: '🔬',
    English: '📝',
    History: '📚',
    Geography: '🌍',
    ICT: '💻',
    Biology: '🧬',
    Chemistry: '⚗️',
    Physics: '⚛️',
    Other: '📁',
  };

  const subjectColors = {
    Mathematics: 'bg-blue-500',
    Science: 'bg-green-500',
    English: 'bg-purple-500',
    History: 'bg-yellow-500',
    Geography: 'bg-teal-500',
    ICT: 'bg-indigo-500',
    Biology: 'bg-pink-500',
    Chemistry: 'bg-orange-500',
    Physics: 'bg-red-500',
    Other: 'bg-gray-500',
  };

  useEffect(() => {
    fetchPosts();
  }, [subject]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forum/posts/subject/${subject}?limit=20`);
      const data = await response.json();
      setPosts(data.posts || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/forum"
            className="flex items-center space-x-2 text-gray-600 hover:text-sl-blue mb-4 transition dark:text-gray-300"
          >
            <FiArrowLeft />
            <span>Back to Forum</span>
          </Link>

          <div className="flex items-center space-x-4 mb-4">
            <div className={`${subjectColors[subject] || 'bg-gray-500'} w-16 h-16 rounded-xl flex items-center justify-center text-3xl`}>
              {subjectIcons[subject] || '📁'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{subject}</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {pagination?.total || 0} {pagination?.total === 1 ? 'question' : 'questions'}
              </p>
            </div>
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <FiMessageSquare className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">No questions yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Be the first to ask a question in {subject}!</p>
            <Link
              to="/forum/new-post"
              state={{ subject }}
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
                      {post.isResolved && (
                        <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Solved
                        </span>
                      )}
                      {post.tags &&
                        post.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs dark:bg-gray-700 dark:text-gray-300">
                            {tag}
                          </span>
                        ))}
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

        {/* Ask Question Button */}
        <div className="mt-8">
          <Link
            to="/forum/new-post"
            state={{ subject }}
            className="block w-full bg-sl-green text-white text-center py-3 rounded-lg hover:bg-green-600 transition font-semibold"
          >
            Ask a Question in {subject}
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubjectForum;
