import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/unauthorized/HomePage.tsx';
import LoginPage from './pages/unauthorized/LoginPage.tsx';
import SignupPage from './pages/unauthorized/SignupPage.tsx';
import Modules from './pages/authorized/Modules.tsx';
import SideNav from './components/SideNav/SideNav.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PublicRoute from './components/PublicRoute.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import ModuleDetail from './pages/authorized/ModuleDetail.tsx';
import TestsPage from './pages/authorized/TestsPage.tsx';
import LeaderboardPage from './pages/authorized/LeaderboardPage.tsx';
import ProfilePage from './pages/authorized/ProfilePage.tsx';
import TestDetail from './pages/authorized/TestDetail.tsx';
import './design.scss';

// Placeholder components for new pages
// const TestsPage = () => <div>Tests Page</div>;
// const LeaderboardPage = () => <div>Leaderboard Page</div>;

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {isAuthenticated ? <SideNav /> : null}
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/modules" 
            element={
              <ProtectedRoute>
                <Modules />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/tests" 
            element={
              <ProtectedRoute>
                <TestsPage />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/modules/:levelSlug/:moduleOrderId"
            element={
              <ProtectedRoute>
                <ModuleDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests/:testId"
            element={
              <ProtectedRoute>
                <TestDetail />
              </ProtectedRoute>
            }
          />
          {/* Catch-all route to redirect unknown URLs to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App; 