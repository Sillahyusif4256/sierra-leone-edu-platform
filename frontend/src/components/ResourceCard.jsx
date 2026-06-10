// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiDownload, FiEye, FiStar, FiUser, FiFileText, FiPlay, FiImage as FiImageIcon, FiVolume2, FiShare2, FiBookmark } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import useResourceStore from '../store/resourceStore';

const ResourceCard = ({ resource }) => {
  const navigate = useNavigate();
  const { downloadResource } = useResourceStore();
  const [swipeOffset, setSwipeOffset] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setSwipeOffset(e.deltaX);
    },
    onSwipedLeft: () => {
      setSwipeOffset(-100);
      setTimeout(() => setSwipeOffset(0), 2000);
    },
    onSwipedRight: () => {
      setSwipeOffset(100);
      setTimeout(() => setSwipeOffset(0), 2000);
    },
    onSwiped: () => {
      setSwipeOffset(0);
    },
    trackMouse: true,
    trackTouch: true,
  });

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="w-16 h-16 text-red-500" />;
      case 'video':
        return <FiPlay className="w-16 h-16 text-blue-500" />;
      case 'image':
        return <FiImageIcon className="w-16 h-16 text-green-500" />;
      case 'document':
        return <FiFileText className="w-16 h-16 text-blue-500" />;
      default:
        return <FiFileText className="w-16 h-16 text-gray-500" />;
    }
  };

  const getFileThumbnail = () => {
    if (resource.fileType === 'image' && resource.thumbnailURL) {
      return <img src={resource.thumbnailURL} alt={resource.title} className="w-full h-full object-cover" />;
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-sl-green to-sl-blue flex items-center justify-center">
        {getFileIcon(resource.fileType)}
      </div>
    );
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    const result = await downloadResource(resource._id);
    if (result.success) {
      window.open(result.fileURL, '_blank');
    }
  };

  const handleCardClick = () => {
    navigate(`/resource/${resource._id}`);
  };

  const handleTextToSpeech = (e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const text = `${resource.title}. ${resource.description || ''}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          className={`w-4 h-4 ${i <= Math.round(rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <motion.div
      {...handlers}
      className="relative overflow-hidden"
    >
      {/* Swipe Actions - Left (Download + Share) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end bg-sl-green z-0"
        style={{ x: swipeOffset }}
      >
        <div className="flex space-x-2 pr-4">
          <button
            onClick={handleDownload}
            className="p-3 bg-white rounded-full shadow-lg"
            aria-label="Download"
          >
            <FiDownload className="w-6 h-6 text-sl-green" />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: resource.title,
                  url: window.location.href
                });
              }
            }}
            className="p-3 bg-white rounded-full shadow-lg"
            aria-label="Share"
          >
            <FiShare2 className="w-6 h-6 text-sl-green" />
          </button>
        </div>
      </motion.div>

      {/* Swipe Actions - Right (Bookmark) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-start bg-sl-blue z-0"
        style={{ x: swipeOffset }}
      >
        <div className="flex space-x-2 pl-4">
          <button
            onClick={() => {
              // Toggle bookmark functionality
              console.log('Bookmark toggled');
            }}
            className="p-3 bg-white rounded-full shadow-lg"
            aria-label="Bookmark"
          >
            <FiBookmark className="w-6 h-6 text-sl-blue" />
          </button>
        </div>
      </motion.div>

      {/* Card Content */}
      <motion.div
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer dark:bg-gray-800 dark:border dark:border-gray-700 relative z-10"
        onClick={handleCardClick}
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)" 
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ x: swipeOffset }}
      >
        <div className="h-48">
          {getFileThumbnail()}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-sl-blue transition dark:text-white">
            {resource.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-sl-green/10 text-sl-green px-2 py-1 rounded text-xs font-medium">
              {resource.subject}
            </span>
            <span className="bg-sl-blue/10 text-sl-blue px-2 py-1 rounded text-xs font-medium">
              {resource.level}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <FiUser className="w-4 h-4" />
              <span className="truncate">{resource.uploadedBy?.name || 'Unknown'}</span>
            </div>
            <span className="text-xs">{formatDate(resource.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <FiEye />
                <span>{resource.views}</span>
              </span>
              <span className="flex items-center space-x-1">
                <FiDownload />
                <span>{resource.downloads}</span>
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {renderStars(resource.averageRating)}
              <span className="ml-1 text-xs">({resource.totalRatings || 0})</span>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="flex-1 bg-sl-blue hover:bg-blue-700 text-white text-center py-2 rounded-lg transition text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              View Resource
            </motion.button>
            <motion.button
              onClick={handleDownload}
              className="px-4 py-2 border border-sl-blue text-sl-blue hover:bg-blue-50 rounded-lg transition dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              aria-label="Download resource"
            >
              <FiDownload />
            </motion.button>
            <motion.button
              onClick={handleTextToSpeech}
              className="px-4 py-2 border border-sl-green text-sl-green hover:bg-green-50 rounded-lg transition dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              aria-label="Read aloud"
              title="Read resource description"
            >
              <FiVolume2 />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResourceCard;
