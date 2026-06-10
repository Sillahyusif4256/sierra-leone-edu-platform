// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:border dark:border-gray-700">
      <div className="h-48 skeleton"></div>
      <div className="p-4">
        <div className="h-6 skeleton mb-3"></div>
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-20 skeleton rounded"></div>
          <div className="h-6 w-16 skeleton rounded"></div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-32 skeleton"></div>
          <div className="h-4 w-20 skeleton"></div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-4">
            <div className="h-4 w-12 skeleton"></div>
            <div className="h-4 w-12 skeleton"></div>
          </div>
          <div className="h-4 w-20 skeleton"></div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-10 skeleton rounded"></div>
          <div className="w-12 h-10 skeleton rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
