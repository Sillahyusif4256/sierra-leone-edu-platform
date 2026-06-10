// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { Component } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <FiAlertTriangle className="h-20 w-20 mx-auto text-red-500 mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page or go back to the home page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-red-800 mb-2">Error Details:</p>
                <p className="text-xs text-red-700 font-mono">{this.state.error.toString()}</p>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-sl-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="bg-sl-green hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center space-x-2"
              >
                <FiHome />
                <span>Go Home</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
