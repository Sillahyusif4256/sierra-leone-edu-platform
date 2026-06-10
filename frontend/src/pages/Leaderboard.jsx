// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import useAuthStore from '../store/authStore';
import { FiTrophy, FiAward, FiUpload, FiStar } from 'react-icons/fi';

const Leaderboard = () => {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [type, setType] = useState('points');
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [period, type]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/gamification/leaderboard?period=${period}&type=${type}&limit=10`);
      const data = await response.json();
      setLeaderboard(data);

      // Find current user's rank
      if (user) {
        const userRank = data.find(entry => entry.userId === user._id);
        setCurrentUserRank(userRank);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900';
    if (rank === 2) return 'bg-gray-300 text-gray-900';
    if (rank === 3) return 'bg-orange-400 text-orange-900';
    return 'bg-gray-100 text-gray-800';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 dark:text-white flex items-center justify-center">
            <FiTrophy className="mr-3 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Top contributors this month</p>
        </div>

        {/* Filters */}
        
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex bg-white rounded-lg shadow-md p-1 dark:bg-gray-800">
            {['week', 'month', 'all'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  period === p
                    ? 'bg-sl-green text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {p === 'all' ? 'All Time' : `This ${p}`}
              </button>
            ))}
          </div>

          <div className="flex bg-white rounded-lg shadow-md p-1 dark:bg-gray-800">
            {['points', 'uploads', 'reviews'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize flex items-center space-x-2 ${
                  type === t
                    ? 'bg-sl-green text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {t === 'points' && <FiStar />}
                {t === 'uploads' && <FiUpload />}
                {t === 'reviews' && <FiAward />}
                <span>{t}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <FiTrophy className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">No data yet</h3>
            <p className="text-gray-600 dark:text-gray-300">Be the first to earn points!</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Rank</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">User</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Level</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 capitalize">{type}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.userId}
                      className={`border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                        entry.userId === user?._id ? 'bg-sl-green/10' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getRankStyle(
                            entry.rank
                          )}`}
                        >
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-sl-blue rounded-full flex items-center justify-center text-white font-semibold">
                            {entry.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-white">
                              {entry.name}
                              {entry.userId === user?._id && (
                                <span className="ml-2 text-xs bg-sl-green text-white px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                              {entry.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-purple-900 dark:text-purple-200">
                          Level {entry.level}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-800 dark:text-white">
                          {type === 'points' && entry.points}
                          {type === 'uploads' && entry.uploadCount}
                          {type === 'reviews' && entry.helpfulVotes}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-1">
                          {entry.badges.slice(0, 5).map((badge) => (
                            <span key={badge.badgeId} className="text-xl" title={badge.name}>
                              {badge.icon}
                            </span>
                          ))}
                          {entry.badges.length > 5 && (
                            <span className="text-sm text-gray-500">+{entry.badges.length - 5}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className={`bg-white rounded-lg shadow-md p-4 dark:bg-gray-800 ${
                    entry.userId === user?._id ? 'border-2 border-sl-green' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 ${getRankStyle(
                        entry.rank
                      )}`}
                    >
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-sl-blue rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {entry.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 dark:text-white truncate">
                          {entry.name}
                          {entry.userId === user?._id && (
                            <span className="ml-2 text-xs bg-sl-green text-white px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {entry.role}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium dark:bg-purple-900 dark:text-purple-200">
                        Level {entry.level}
                      </span>
                    </div>
                    <div className="font-bold text-gray-800 dark:text-white">
                      {type === 'points' && `${entry.points} pts`}
                      {type === 'uploads' && `${entry.uploadCount} uploads`}
                      {type === 'reviews' && `${entry.helpfulVotes} votes`}
                    </div>
                  </div>
                  <div className="flex space-x-1 mt-3">
                    {entry.badges.slice(0, 5).map((badge) => (
                      <span key={badge.badgeId} className="text-2xl" title={badge.name}>
                        {badge.icon}
                      </span>
                    ))}
                    {entry.badges.length > 5 && (
                      <span className="text-sm text-gray-500 self-center">+{entry.badges.length - 5}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Current User Rank */}
        {currentUserRank && currentUserRank.rank > 10 && (
          <div className="mt-8 bg-gradient-to-r from-sl-green to-green-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{getRankIcon(currentUserRank.rank)}</div>
                <div>
                  <h3 className="font-bold text-lg">Your Rank: #{currentUserRank.rank}</h3>
                  <p className="text-green-100">Keep going to climb the leaderboard!</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{currentUserRank.points} points</p>
                <p className="text-green-100">Level {currentUserRank.level}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Leaderboard;
