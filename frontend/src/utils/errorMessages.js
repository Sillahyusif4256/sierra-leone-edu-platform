// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

/**
 * Friendly error messages for Sierra Leone users
 * Replaces technical error codes with human-friendly messages
 */
const errorMessages = {
  // Authentication errors
  '401': 'Please log in to do that 😊',
  '403': "You don't have permission to do that",
  '404': "We couldn't find what you're looking for",
  '409': 'This already exists. Try something different',
  
  // Server errors
  '500': "Something went wrong on our end. Please try again in a moment 🔄",
  '502': 'Our servers are taking a break. Please try again soon',
  '503': 'We are under maintenance. Please check back later',
  '504': 'This is taking too long. Please try again',
  
  // Network errors
  'Network Error': 'Please check your internet connection and try again',
  'timeout': 'This is taking too long. Please check your connection',
  
  // File upload errors
  'File size exceeds limit': 'That file is too large (max 50MB). Try compressing it first 📦',
  'Invalid file type': 'This file type is not supported. Try a PDF, image, or document',
  'Upload failed': 'Could not upload your file. Please try again',
  
  // Form validation errors
  'Required field': 'This field is required',
  'Invalid email': 'Please enter a valid email address',
  'Password too short': 'Password must be at least 6 characters',
  'Passwords do not match': 'Passwords do not match',
  
  // Resource errors
  'Resource not found': 'This resource does not exist or has been removed',
  'Download failed': 'Could not download the file. Please try again',
  
  // Default fallback
  'default': 'Something unexpected happened. Please try again',
};

/**
 * Get a friendly error message for a given error
 * @param {string|Error} error - The error object or message
 * @returns {string} A friendly error message
 */
export const getFriendlyErrorMessage = (error) => {
  if (!error) return errorMessages.default;
  
  const errorMessage = error?.response?.data?.error || error?.message || error?.toString() || '';
  
  // Check for specific error codes
  if (error?.response?.status) {
    const statusCode = error.response.status.toString();
    if (errorMessages[statusCode]) {
      return errorMessages[statusCode];
    }
  }
  
  // Check for specific error messages
  for (const [key, message] of Object.entries(errorMessages)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return message;
    }
  }
  
  // Return original message if no match, or default
  return errorMessage || errorMessages.default;
};

export default errorMessages;
