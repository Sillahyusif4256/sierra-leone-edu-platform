// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiHome, FiBookOpen } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-9xl mb-4">📚</div>
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to learning!
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-sl-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            <FiHome />
            <span>Back to Home</span>
          </Link>
          <div className="mt-8">
            <Link to="/browse" className="text-sl-blue hover:text-blue-700 font-semibold flex items-center justify-center space-x-2">
              <FiBookOpen />
              <span>Browse Resources</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
