// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { Link } from 'react-router-dom';
import { FiUpload, FiSearch, FiBookOpen } from 'react-icons/fi';

const EmptyState = ({ type, searchTerm = '', actionText, actionLink }) => {
  const states = {
    noResources: {
      icon: <FiBookOpen className="text-6xl text-gray-400" />,
      title: 'No resources found yet',
      description: 'Be the first to share something with the community!',
      actionText: actionText || 'Upload Resource',
      actionLink: actionLink || '/upload',
    },
    noNotifications: {
      icon: <span className="text-6xl">🔔</span>,
      title: "You're all caught up!",
      description: "We'll notify you when something happens.",
      actionText: null,
      actionLink: null,
    },
    noSearchResults: {
      icon: <FiSearch className="text-6xl text-gray-400" />,
      title: `No results for "${searchTerm}"`,
      description: 'Try different keywords or browse by subject',
      actionText: actionText || 'Browse All',
      actionLink: actionLink || '/browse',
    },
  };

  const state = states[type] || states.noResources;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">{state.icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">
        {state.title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md dark:text-gray-300">
        {state.description}
      </p>
      {state.actionText && state.actionLink && (
        <Link
          to={state.actionLink}
          className="bg-sl-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center space-x-2"
        >
          {type === 'noResources' && <FiUpload />}
          {type === 'noSearchResults' && <FiSearch />}
          <span>{state.actionText}</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
