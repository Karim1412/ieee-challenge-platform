import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChallengePage from './pages/ChallengePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import FinalPage from './pages/FinalPage';
import LoadingScreen from './components/ui/LoadingScreen';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="challenge/:id" element={<ChallengePage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="final" element={<FinalPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/ieee-challenge-platform">
      <AuthProvider>
        <div className="scanline-overlay" />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1528',
              color: '#e2e8f0',
              border: '1px solid rgba(0,212,255,0.3)',
              fontFamily: "'Exo 2', sans-serif",
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#00ff9d', secondary: '#0d1528' },
            },
            error: {
              iconTheme: { primary: '#ff2d7e', secondary: '#0d1528' },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
