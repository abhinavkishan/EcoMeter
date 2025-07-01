import React from 'react';
import { Trophy, Award, Star, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Rewards: React.FC = () => {
  const { user } = useAuth();
  const { badges, goals } = useData();

  const completedGoals = goals.filter(goal => goal.completed);
  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Alex Johnson', points: 1250, avatar: '👨‍💻' },
    { rank: 2, name: 'Sarah Chen', points: 1180, avatar: '👩‍🔬' },
    { rank: 3, name: 'Mike Rodriguez', points: 1050, avatar: '👨‍🎨' },
    { rank: 4, name: user?.name || 'You', points: user?.totalPoints || 0, avatar: '👤', isUser: true },
    { rank: 5, name: 'Emma Wilson', points: 890, avatar: '👩‍💼' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Rewards & Achievements</h1>
        <p className="text-gray-600">
          Track your progress, earn badges, and see how you rank against other eco-warriors.
        </p>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{user?.totalPoints || 0}</h3>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{earnedBadges.length}</h3>
              <p className="text-sm text-gray-600">Badges Earned</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{completedGoals.length}</h3>
              <p className="text-sm text-gray-600">Goals Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">#4</h3>
              <p className="text-sm text-gray-600">Global Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earned Badges */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🏆 Your Badges</h2>
          {earnedBadges.length > 0 ? (
            <div className="space-y-3">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl mr-3">{badge.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                    {badge.earnedDate && (
                      <p className="text-xs text-green-600">
                        Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No badges earned yet. Complete goals to earn your first badge!</p>
            </div>
          )}
        </div>

        {/* Available Badges */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 Available Badges</h2>
          <div className="space-y-3">
            {availableBadges.map((badge) => (
              <div key={badge.id} className="flex items-center p-3 bg-gray-50 rounded-lg opacity-75">
                <span className="text-2xl mr-3 grayscale">{badge.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Global Leaderboard
        </h2>
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.isUser ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  user.rank === 1 ? 'bg-yellow-500 text-white' :
                  user.rank === 2 ? 'bg-gray-400 text-white' :
                  user.rank === 3 ? 'bg-amber-600 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {user.rank}
                </div>
                <span className="text-2xl mx-3">{user.avatar}</span>
                <div>
                  <h3 className={`font-semibold ${user.isUser ? 'text-green-700' : 'text-gray-900'}`}>
                    {user.name} {user.isUser && '(You)'}
                  </h3>
                  <p className="text-sm text-gray-600">{user.points} points</p>
                </div>
              </div>
              {user.rank <= 3 && (
                <Trophy className={`h-6 w-6 ${
                  user.rank === 1 ? 'text-yellow-500' :
                  user.rank === 2 ? 'text-gray-400' :
                  'text-amber-600'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎁 How to Earn More Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Complete Goals</h4>
            <p className="text-sm text-gray-600">
              Each completed goal earns you points based on its difficulty and impact. Focus on high-impact goals for maximum points.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Daily Consistency</h4>
            <p className="text-sm text-gray-600">
              Log your daily activities consistently to earn bonus points and unlock achievement badges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;