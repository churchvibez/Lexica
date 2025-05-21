import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/unauthorized/HomePage.tsx';
import LoginPage from './pages/unauthorized/LoginPage.tsx';
import SignupPage from './pages/unauthorized/SignupPage.tsx';
import Modules from './pages/authorized/Modules.tsx';
import Header from './components/Header/Header.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PublicRoute from './components/PublicRoute.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ModuleDetail from './pages/authorized/ModuleDetail.tsx';
import './design.scss';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
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
                path="/modules/:levelSlug/:moduleSequence"
                element={
                  <ProtectedRoute>
                    <ModuleDetail />
                  </ProtectedRoute>
                }
              />
              {/* Catch all route - must be last */}
              <Route 
                path="*" 
                element={
                  <ProtectedRoute>
                    <Navigate to="/modules" replace />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 