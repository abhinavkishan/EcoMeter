import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrendingDown, Target, Award, ArrowRight, BarChart3, Users, Globe } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Track Your Impact',
      description: 'Monitor your daily carbon emissions across transportation, food, waste, and energy consumption with detailed analytics.',
    },
    {
      icon: Target,
      title: 'Set Meaningful Goals',
      description: 'Create personalized sustainability goals and track your progress with our gamified achievement system.',
    },
    {
      icon: TrendingDown,
      title: 'Reduce Your Footprint',
      description: 'Get AI-powered recommendations tailored to your lifestyle to effectively reduce your environmental impact.',
    },
    {
      icon: Award,
      title: 'Earn Rewards',
      description: 'Complete challenges, unlock badges, and compete with friends on our global leaderboard.',
    },
  ];

  const stats = [
    { number: '16 tons', label: 'Average annual CO2 per person' },
    { number: '29%', label: 'Transportation emissions share' },
    { number: '75%', label: 'Energy savings with LED bulbs' },
    { number: '35%', label: 'Footprint reduction with less meat' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Leaf className="h-16 w-16 text-green-600" />
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Globe className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-green-600">Eco</span>meter
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your personal carbon footprint analyzer and sustainability companion
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* What is Carbon Footprint Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What is a Carbon Footprint?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your carbon footprint is the total amount of greenhouse gases produced directly and 
              indirectly by your activities, measured in equivalent tons of carbon dioxide (CO2).
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Ecometer Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why We Built Ecometer
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Climate change is one of the most pressing challenges of our time. While the problem seems overwhelming, 
              individual actions matter. Ecometer empowers you to understand, track, and reduce your environmental impact 
              through data-driven insights and actionable recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Responsibility</h3>
                  <p className="text-gray-600">
                    Every individual has the power to make a difference. By understanding your carbon footprint, 
                    you can make informed decisions that contribute to a sustainable future.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Data-Driven Change</h3>
                  <p className="text-gray-600">
                    What gets measured gets managed. Ecometer provides clear, actionable data to help you 
                    identify the most impactful changes you can make in your daily life.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable Habits</h3>
                  <p className="text-gray-600">
                    Building sustainable habits requires motivation and tracking. Our gamified approach 
                    makes environmental responsibility engaging and rewarding.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Mission</h3>
              <p className="text-gray-600 text-center leading-relaxed mb-6">
                To democratize carbon footprint awareness and empower individuals to take meaningful 
                climate action through accessible technology and personalized insights.
              </p>
              <div className="text-center">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg">
                  <Globe className="h-5 w-5 mr-2" />
                  Together for a Better Planet
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Ecometer Helps You
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides everything you need to understand, track, and reduce your carbon footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-200 group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of users who are already reducing their carbon footprint with Ecometer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-200"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <Leaf className="h-8 w-8 text-green-400 mr-2" />
            <span className="text-xl font-bold">Ecometer</span>
          </div>
          <p className="text-gray-400">
            Making sustainability accessible, one footprint at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;