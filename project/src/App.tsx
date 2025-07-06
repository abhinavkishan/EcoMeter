import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import CombinedSignup from './components/auth/Signup'; 
import Dashboard from './components/Dashboard';
import Recommendations from './components/Recommendations';
import Goals from './components/Goals';
import Rewards from './components/Rewards';

const isLoggedIn = (): boolean => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <CombinedSignup />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="goals" element={<Goals />} />
          <Route path="rewards" element={<Rewards />} />
        </Route>
      </Routes>
    </Router>
  );
};

function App() {
  return <AppContent />;
}

export default App;
