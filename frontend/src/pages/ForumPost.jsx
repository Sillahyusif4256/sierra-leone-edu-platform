// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import useAuthStore from '../store/authStore';
import { FiArrowLeft, FiThumbsUp, FiThumbsDown, FiCheck, FiMessageSquare, FiClock, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForumPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [post, setPost] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forum/posts/${id}`);
      const data = await response.json();
      setPost(data.post);
      setAnswers(data.answers || []);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleVotePost = async (vote) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }
    try {
      const response = await fetch(`/api/forum/posts/${id}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`,
        },
        body: JSON.stringify({ vote }),
      });
      const data = await response.json();
      setPost({ ...post, votes: data.votes });
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    }
  };

  const handleVoteAnswer = async (answerId, vote) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }
    try {
      const response = await fetch(`/api/forum/answers/${answerId}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`,
        },
        body: JSON.stringify({ vote }),
      });
      const data = await response.json();
      setAnswers(
        answers.map((a) => (a._id === answerId ? { ...a, votes: data.votes } : a))
      );
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    if (!user) {
      toast.error('Please login to accept answers');
      return;
    }
    try {
      const response = await fetch(`/api/forum/answers/${answerId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`,
        },
      });
      if (response.ok) {
        setPost({ ...post, isResolved: true });
        setAnswers(
          answers.map((a) => ({
            ...a,
            isAccepted: a._id === answerId,
          }))
        );
        toast.success('Answer accepted!');
      }
    } catch (error) {
      console.error('Error accepting answer:', error);
      toast.error('Failed to accept answer');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to answer');
      return;
    }
    if (!answerText.trim()) {
      toast.error('Please write an answer');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/forum/posts/${id}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('edushare_token')}`,
        },
        body: JSON.stringify({ body: answerText }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnswers([...answers, data]);
        setAnswerText('');
        toast.success('Answer posted!');
      }
    } catch (error) {
      console.error('Error posting answer:', error);
      toast.error('Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Post Not Found</h1>
            <Link to="/forum" className="text-sl-blue hover:text-blue-700">
              Back to Forum
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <span>Back</span>
        </button>

        {/* Post */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-4">
            {/* Vote Section */}
            <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 min-w-[70px]">
              <button
                onClick={() => handleVotePost(1)}
                className="text-gray-600 hover:text-sl-green transition dark:text-gray-300"
              >
                <FiThumbsUp className="text-xl" />
              </button>
              <span className="text-2xl font-bold text-gray-800 my-2 dark:text-white">{post.votes}</span>
              <button
                onClick={() => handleVotePost(-1)}
                className="text-gray-600 hover:text-red-500 transition dark:text-gray-300"
              >
                <FiThumbsDown className="text-xl" />
              </button>
            </div>

            {/* Post Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 dark:text-white">{post.title}</h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-sl-green/10 text-sl-green px-3 py-1 rounded-full text-sm font-medium">
                  {post.subject}
                </span>
                {post.isResolved && (
                  <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <FiCheck className="mr-1" />
                    Solved
                  </span>
                )}
                {post.tags &&
                  post.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm dark:bg-gray-700 dark:text-gray-300">
                      {tag}
                    </span>
                  ))}
              </div>

              {/* Post Body */}
              <div className="text-gray-700 mb-6 whitespace-pre-wrap dark:text-gray-300">{post.body}</div>

              {/* Author Info */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sl-blue rounded-full flex items-center justify-center text-white font-semibold">
                    {post.author?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">{post.author?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                      <span className="bg-sl-blue/10 text-sl-blue px-2 py-0.5 rounded text-xs capitalize">
                        {post.author?.role || 'student'}
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiClock />
                        <span>{formatDate(post.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <FiMessageSquare />
                    <span>{answers.length} answers</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FiUser />
                    <span>{post.views} views</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Answer Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">Your Answer</h2>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={5}
              placeholder="Write your answer here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={!user}
            />
            {!user && (
              <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                Please <Link to="/login" className="text-sl-blue hover:text-blue-700">login</Link> to answer
              </p>
            )}
            {user && (
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 bg-sl-green text-white px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Answer'}
              </button>
            )}
          </form>
        </div>

        {/* Answers */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          {answers.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <FiMessageSquare className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">No answers yet</h3>
              <p className="text-gray-600 dark:text-gray-300">Be the first to answer!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {answers.map((answer) => (
                <div
                  key={answer._id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${
                    answer.isAccepted ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 min-w-[70px]">
                      <button
                        onClick={() => handleVoteAnswer(answer._id, 1)}
                        className="text-gray-600 hover:text-sl-green transition dark:text-gray-300"
                      >
                        <FiThumbsUp className="text-xl" />
                      </button>
                      <span className="text-2xl font-bold text-gray-800 my-2 dark:text-white">{answer.votes}</span>
                      <button
                        onClick={() => handleVoteAnswer(answer._id, -1)}
                        className="text-gray-600 hover:text-red-500 transition dark:text-gray-300"
                      >
                        <FiThumbsDown className="text-xl" />
                      </button>
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1">
                      {answer.isAccepted && (
                        <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center mb-3">
                          <FiCheck className="mr-1" />
                          Accepted Answer
                        </div>
                      )}
                      <div className="text-gray-700 mb-4 whitespace-pre-wrap dark:text-gray-300">{answer.body}</div>

                      {/* Author Info */}
                      <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-sl-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {answer.author?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-sm dark:text-white">
                              {answer.author?.name || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                              <span className="bg-sl-blue/10 text-sl-blue px-2 py-0.5 rounded text-xs capitalize">
                                {answer.author?.role || 'student'}
                              </span>
                              <span className="flex items-center space-x-1">
                                <FiClock />
                                <span>{formatDate(answer.createdAt)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        {user && post.author?._id === user._id && !post.isResolved && (
                          <button
                            onClick={() => handleAcceptAnswer(answer._id)}
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            Accept Answer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForumPost;
