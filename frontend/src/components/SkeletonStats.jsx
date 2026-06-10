// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const SkeletonStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 skeleton mb-2 w-24"></div>
              <div className="h-8 skeleton w-16"></div>
            </div>
            <div className="h-12 w-12 skeleton rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonStats;
