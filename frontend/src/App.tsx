import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/unauthorized/HomePage.tsx';
import LoginPage from './pages/unauthorized/LoginPage.tsx';
import SignupPage from './pages/unauthorized/SignupPage.tsx';
import Modules from './pages/authorized/Modules.tsx';
import SideNav from './components/SideNav/SideNav.tsx';
import Header from './components/Header/Header.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PublicRoute from './components/PublicRoute.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import ModuleDetail from './pages/authorized/ModuleDetail.tsx';
import TestsPage from './pages/authorized/TestsPage.tsx';
import LeaderboardPage from './pages/authorized/LeaderboardPage.tsx';
import ProfilePage from './pages/authorized/ProfilePage.tsx';
import './design.scss';

// Placeholder components for new pages
// const TestsPage = () => <div>Tests Page</div>;
// const LeaderboardPage = () => <div>Leaderboard Page</div>;

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {isAuthenticated ? <SideNav /> : <Header />}
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
            path="/modules/:levelSlug/:moduleSequence"
            element={
              <ProtectedRoute>
                <ModuleDetail />
              </ProtectedRoute>
            }
          />
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