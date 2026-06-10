// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResourceCard from '../components/ResourceCard';
import Spinner from '../components/Spinner';
import useResourceStore from '../store/resourceStore';
import useCommentStore from '../store/commentStore';
import useAuthStore from '../store/authStore';
import { FiArrowLeft, FiDownload, FiShare2, FiEye, FiStar, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getResourceById, currentResource, isLoading, downloadResource, getAllResources, resources } = useResourceStore();
  const { getComments, addComment, comments, isLoading: commentsLoading } = useCommentStore();
  const { user } = useAuthStore();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [studentsAlsoDownloaded, setStudentsAlsoDownloaded] = useState([]);
  const [fromSameTeacher, setFromSameTeacher] = useState([]);
  const [continueLearning, setContinueLearning] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    getResourceById(id);
    getComments(id);
    getAllResources({ limit: 6 });
  }, [id]);

  useEffect(() => {
    if (currentResource) {
      fetchRecommendations();
    }
  }, [currentResource]);

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      // Fetch resources from same teacher
      const sameTeacherRes = await fetch(`/api/resources?subject=${currentResource.subject}&limit=3`);
      const sameTeacherData = await sameTeacherRes.json();
      const filtered = sameTeacherData.resources?.filter(r => r._id !== id).slice(0, 3) || [];
      setFromSameTeacher(filtered);

      // Fetch continue learning (same subject, different level)
      const levels = ['Primary', 'JSS', 'SSS', 'University'];
      const currentIndex = levels.indexOf(currentResource.level);
      if (currentIndex >= 0) {
        const nextLevel = levels[currentIndex + 1] || levels[currentIndex - 1];
        if (nextLevel) {
          const continueRes = await fetch(`/api/resources?subject=${currentResource.subject}&level=${nextLevel}&limit=3`);
          const continueData = await continueRes.json();
          setContinueLearning(continueData.resources?.slice(0, 3) || []);
        }
      }

      // Fetch trending for "students also downloaded"
      const trendingRes = await fetch('/api/resources/trending');
      const trendingData = await trendingRes.json();
      setStudentsAlsoDownloaded(trendingData?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    if (user && comments) {
      const userReview = comments.find((c) => c.user._id === user._id);
      setHasReviewed(!!userReview);
    }
  }, [user, comments]);

  const handleDownload = async () => {
    const result = await downloadResource(id);
    if (result.success) {
      window.open(result.fileURL, '_blank');
    } else {
      toast.error(result.error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: currentResource?.title || 'Educational Resource',
      text: currentResource?.description || 'Check out this educational resource on EduShare SL',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          // Fallback to copy link
          navigator.clipboard.writeText(window.location.href);
          toast.success('Link copied to clipboard!');
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleRatingClick = (value) => {
    if (!user) {
      toast.error('Please login to rate this resource');
      return;
    }
    if (hasReviewed) {
      toast.error('You have already reviewed this resource');
      return;
    }
    setRating(value);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!commentText.trim()) {
      toast.error('Please write a comment');
      return;
    }

    const result = await addComment(id, commentText, rating);
    if (result.success) {
      toast.success('Review submitted successfully!');
      setRating(0);
      setCommentText('');
      setHasReviewed(true);
      getComments(id);
      getResourceById(id);
    } else {
      toast.error(result.error);
    }
  };

  const getFilePreview = () => {
    if (!currentResource) return null;

    switch (currentResource.fileType) {
      case 'pdf':
        return (
          <iframe
            src={currentResource.fileURL}
            className="w-full h-[600px] border rounded-lg"
            title="PDF Preview"
          />
        );
      case 'image':
        return (
          <img
            src={currentResource.fileURL}
            alt={currentResource.title}
            className="w-full max-h-[600px] object-contain rounded-lg"
          />
        );
      case 'video':
        return (
          <video
            src={currentResource.fileURL}
            controls
            className="w-full max-h-[600px] rounded-lg"
          />
        );
      case 'document':
        return (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">Document Preview</h3>
            <p className="text-gray-600 mb-4">Click the download button to view this document</p>
          </div>
        );
      default:
        return (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2">File Preview</h3>
            <p className="text-gray-600 mb-4">Click the download button to access this file</p>
          </div>
        );
    }
  };

  const getRatingBreakdown = () => {
    if (!comments || comments.length === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    comments.forEach((comment) => {
      breakdown[comment.rating]++;
    });
    
    return breakdown;
  };

  const getRatingPercentage = (count) => {
    if (!comments || comments.length === 0) return 0;
    return Math.round((count / comments.length) * 100);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!currentResource) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Resource Not Found</h1>
            <Link to="/browse" className="text-sl-blue hover:text-blue-700">
              Browse Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ratingBreakdown = getRatingBreakdown();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-sl-blue mb-6 transition"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        {/* Resource Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{currentResource.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-sl-green/10 text-sl-green px-3 py-1 rounded-full text-sm font-medium">
              {currentResource.subject}
            </span>
            <span className="bg-sl-blue/10 text-sl-blue px-3 py-1 rounded-full text-sm font-medium">
              {currentResource.level}
            </span>
            <span className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {currentResource.fileType}
            </span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <FiUser className="w-5 h-5" />
              <span>
                Uploaded by <span className="font-semibold">{currentResource.uploadedBy?.name || 'Unknown'}</span>
              </span>
              <span>on {formatDate(currentResource.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-600">
              <span className="flex items-center space-x-1">
                <FiEye />
                <span>{currentResource.views} views</span>
              </span>
              <span className="flex items-center space-x-1">
                <FiDownload />
                <span>{currentResource.downloads} downloads</span>
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-sl-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
            >
              <FiDownload />
              <span>Download / View Resource</span>
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
            >
              <FiShare2 />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* File Preview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">File Preview</h2>
          {getFilePreview()}
        </div>

        {/* Resource Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resource Details</h2>
          <p className="text-gray-600 mb-4">{currentResource.description}</p>
          
          {currentResource.tags && currentResource.tags.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentResource.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500">
              This resource is licensed under the MIT License. You are free to use, modify, and distribute it.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              This content is shared under MIT License. Please respect intellectual property rights.
            </p>
          </div>
        </div>

        {/* Ratings & Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ratings & Reviews</h2>
          
          <div className="flex items-start gap-8 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800 mb-1">
                {currentResource.averageRating?.toFixed(1) || '0.0'}
              </div>
              <div className="flex items-center space-x-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(currentResource.averageRating || 0)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{currentResource.totalRatings || 0} reviews</p>
            </div>

            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600 w-8">{star} star</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${getRatingPercentage(ratingBreakdown[star])}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {getRatingPercentage(ratingBreakdown[star])}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review Form */}
          {!hasReviewed && user && (
            <div className="border-t pt-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Add Your Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                      >
                        <FiStar
                          className={`w-8 h-8 ${
                            star <= (hoverRating || rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green"
                    placeholder="Share your thoughts about this resource..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-sl-green hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {hasReviewed && (
            <div className="border-t pt-6 mb-6">
              <p className="text-sm text-gray-600">You have already reviewed this resource.</p>
            </div>
          )}

          {!user && (
            <div className="border-t pt-6 mb-6">
              <p className="text-sm text-gray-600">
                Please <Link to="/login" className="text-sl-blue hover:text-blue-700">login</Link> to leave a review.
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Reviews ({comments.length})</h3>
            {commentsLoading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="border-b pb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-sl-blue rounded-full flex items-center justify-center text-white font-semibold">
                        {comment.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-800">{comment.user?.name || 'Unknown'}</span>
                          <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={`w-4 h-4 ${
                                star <= comment.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-8 mb-6">
          {/* Students Also Downloaded */}
          {studentsAlsoDownloaded.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Students Also Downloaded</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {studentsAlsoDownloaded.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {/* From the Same Teacher */}
          {fromSameTeacher.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">From the Same Teacher</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fromSameTeacher.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {/* Continue Your Learning */}
          {continueLearning.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Continue Your Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {continueLearning.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MIT License Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-100 border-l-4 border-sl-blue p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong>MIT License:</strong> This content is shared under MIT License. Please respect intellectual property rights.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResourceDetail;
