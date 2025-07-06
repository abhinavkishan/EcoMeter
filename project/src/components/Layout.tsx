import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Target, Gift, BookOpen, LogOut, Leaf } from 'lucide-react';
import axios from 'axios';

interface User {
  full_name: string;
  totalPoints: number;
}

const Layout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Recommendations', href: '/recommendations', icon: BookOpen },
    { name: 'Rewards', href: '/rewards', icon: Gift },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/auth/me?user_id=${userId}`);
        console.log("user_data",res.data);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // await axios.post('http://localhost:5000/auth/logout'); // optional depending on backend
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">Ecometer</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.full_name || 'User'}</span>
                <div className="text-xs text-green-600">{user?.totalPoints ?? 0} points</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
