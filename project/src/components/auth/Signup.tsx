import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, MapPin, Users } from 'lucide-react';

const CombinedSignup: React.FC = () => {
  // 🔐 State for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [locationType, setLocationType] = useState('');
  const [householdSize, setHouseholdSize] = useState(1);

  // 🔄 UI control states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // 🚀 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // API call to backend
    try {
      const res = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email,
          password,
          full_name: fullName,
          location_type: locationType,
          household_size: householdSize,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user_id',data.user_id);
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🧾 JSX UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Leaf className="h-10 w-10 mx-auto text-green-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Create Your Ecometer Account</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            required
            className="input"
          />

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="input"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>

          {/* Location Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline h-4 w-4 mr-1" /> Location Type
            </label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              required
              className="input"
            >
              <option value="">Select your area</option>
              <option value="urban">Urban</option>
              <option value="suburban">Suburban</option>
              <option value="rural">Rural</option>
            </select>
          </div>

          {/* Household Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="inline h-4 w-4 mr-1" /> Household Size
            </label>
            <select
              value={householdSize}
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
              className="input"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CombinedSignup;
