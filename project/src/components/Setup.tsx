import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Setup: React.FC = () => {
  const [location, setLocation] = useState('');
  const [householdSize, setHouseholdSize] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const calculateBaselineFootprint = (location: string, size: number): number => {
    // Simplified baseline calculation
    const baseFootprints: { [key: string]: number } = {
      'urban': 12.5,
      'suburban': 16.2,
      'rural': 18.8,
    };
    
    const locationMultiplier = baseFootprints[location.toLowerCase()] || 15.0;
    return locationMultiplier * size;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const baselineFootprint = calculateBaselineFootprint(location, householdSize);
    
    updateUser({
      location,
      householdSize,
      baselineFootprint,
      setupComplete: true,
      isFirstLogin: false,
    });

    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <Zap className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Let's Set Up Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Help us calculate your baseline carbon footprint
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Where do you live?
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select your area type</option>
                <option value="urban">Urban (City center)</option>
                <option value="suburban">Suburban</option>
                <option value="rural">Rural</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Household size
              </label>
              <select
                value={householdSize}
                onChange={(e) => setHouseholdSize(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                Understanding Your Baseline
              </h3>
              <p className="text-sm text-green-700">
                Your baseline carbon footprint helps us understand your starting point and 
                track your progress over time. This calculation considers your location type 
                and household size to estimate your annual CO2 emissions.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setup;