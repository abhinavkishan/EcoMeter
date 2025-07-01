import React from 'react';
import { Target, CheckCircle, Circle, Calendar, Award } from 'lucide-react';
import { useData } from '../context/DataContext';

const Goals: React.FC = () => {
  const { goals, completeGoal } = useData();

  const completedGoals = goals.filter(goal => goal.completed);
  const activeGoals = goals.filter(goal => !goal.completed);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transport':
        return 'bg-red-100 text-red-800';
      case 'food':
        return 'bg-orange-100 text-orange-800';
      case 'electricity':
        return 'bg-yellow-100 text-yellow-800';
      case 'waste':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transport':
        return '🚗';
      case 'food':
        return '🍃';
      case 'electricity':
        return '⚡';
      case 'waste':
        return '♻️';
      default:
        return '🎯';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sustainability Goals</h1>
        <p className="text-gray-600">
          Set and track specific goals to reduce your carbon footprint and earn reward points.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{activeGoals.length}</h3>
              <p className="text-sm text-gray-600">Active Goals</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{completedGoals.length}</h3>
              <p className="text-sm text-gray-600">Completed Goals</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {completedGoals.reduce((total, goal) => total + goal.points, 0)}
              </h3>
              <p className="text-sm text-gray-600">Points Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Goals */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Goals</h2>
        {activeGoals.length > 0 ? (
          <div className="space-y-4">
            {activeGoals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getCategoryIcon(goal.category)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        +{goal.points} points
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => completeGoal(goal.id)}
                    className="ml-4 flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                  >
                    <Circle className="h-4 w-4 mr-1" />
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No active goals. All goals completed!</p>
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Goals</h2>
          <div className="space-y-4">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getCategoryIcon(goal.category)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        +{goal.points} points earned
                      </span>
                      {goal.dateCompleted && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(goal.dateCompleted).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-500 ml-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goal Suggestions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Goal Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🌱 Start Small</h4>
            <p className="text-sm text-gray-600">
              Begin with achievable daily goals like using a reusable water bottle or taking the stairs instead of the elevator.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">📈 Track Progress</h4>
            <p className="text-sm text-gray-600">
              Monitor your carbon footprint reduction over time and celebrate milestones to stay motivated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;