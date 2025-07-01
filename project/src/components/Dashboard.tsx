import React, { useState } from 'react';
import { Car, Utensils, Trash2, Zap, TrendingUp, Target, Gift, BookOpen } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { addDailyData, getChartData, getDailyFact } = useData();
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [inputs, setInputs] = useState({
    travel: 0,
    food: 0,
    waste: 0,
    electricity: 0,
  });

  const chartData = getChartData(filter);
  const dailyFact = getDailyFact();

  const handleInputChange = (category: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDailyData({
      date: new Date().toISOString(),
      ...inputs,
    });
    setInputs({ travel: 0, food: 0, waste: 0, electricity: 0 });
  };

  const pieData = [
    { name: 'Travel', value: inputs.travel, color: '#ef4444' },
    { name: 'Food', value: inputs.food, color: '#f97316' },
    { name: 'Waste', value: inputs.waste, color: '#eab308' },
    { name: 'Electricity', value: inputs.electricity, color: '#22c55e' },
  ].filter(item => item.value > 0);

  const totalFootprint = Object.values(inputs).reduce((sum, val) => sum + val, 0);

  const categories = [
    { key: 'travel', name: 'Travel', icon: Car, color: '#ef4444' },
    { key: 'food', name: 'Food', icon: Utensils, color: '#f97316' },
    { key: 'waste', name: 'Waste', icon: Trash2, color: '#eab308' },
    { key: 'electricity', name: 'Electricity', icon: Zap, color: '#22c55e' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Carbon Footprint Dashboard</h1>
        <p className="text-gray-600">Track your daily emissions and monitor your progress</p>
      </div>

      {/* Daily Input Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Activities</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Car className="h-4 w-4 mr-2 text-red-500" />
                Travel (km)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={inputs.travel}
                onChange={(e) => handleInputChange('travel', Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Utensils className="h-4 w-4 mr-2 text-orange-500" />
                Food (kg CO2)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={inputs.food}
                onChange={(e) => handleInputChange('food', Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Trash2 className="h-4 w-4 mr-2 text-yellow-500" />
                Waste (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={inputs.waste}
                onChange={(e) => handleInputChange('waste', Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Zap className="h-4 w-4 mr-2 text-green-500" />
                Electricity (kWh)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={inputs.electricity}
                onChange={(e) => handleInputChange('electricity', Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total CO2 today: <span className="font-semibold text-gray-900">{totalFootprint.toFixed(2)} kg</span>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Overall Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Carbon Footprint Trend</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} name="Total CO2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category-wise Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.key} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Icon className="h-5 w-5 mr-2" style={{ color: category.color }} />
                  <h3 className="text-lg font-semibold text-gray-900">{category.name} Trend</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey={category.key} 
                      stroke={category.color} 
                      strokeWidth={2}
                      name={category.name}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>

        {/* Today's Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-72 text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Add your daily activities to see the breakdown</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons & Fact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Link
          to="/recommendations"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500 group-hover:text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
              <p className="text-sm text-gray-600">Get personalized tips to reduce your footprint</p>
            </div>
          </div>
        </Link>

        <Link
          to="/goals"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-500 group-hover:text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Goals</h3>
              <p className="text-sm text-gray-600">Set and track your sustainability goals</p>
            </div>
          </div>
        </Link>

        <Link
          to="/rewards"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center">
            <Gift className="h-8 w-8 text-purple-500 group-hover:text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Rewards</h3>
              <p className="text-sm text-gray-600">View your achievements and badges</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Daily Fact */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Daily Eco Fact</h3>
        <p className="text-gray-700">{dailyFact}</p>
      </div>
    </div>
  );
};

export default Dashboard;