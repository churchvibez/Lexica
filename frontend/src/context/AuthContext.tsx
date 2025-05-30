import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  username: string;
  userId: number;
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  authChecked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const checkTokenExpiration = (token: string): boolean => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const isExpired = (decoded.exp * 1000) <= (Date.now() + 30000);
      return !isExpired;
    } catch {
      return false;
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    if (isRefreshing) {
      console.log('Already refreshing token, skipping...');
      return false;
    }
    
    try {
      console.log('Attempting to refresh access token...');
      setIsRefreshing(true);
      const response = await fetch('http://localhost:8080/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Successfully refreshed access token');
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return true;
      }
      console.log('Failed to refresh token:', data.message);
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out user...');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername(null);
    window.location.href = '/';
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth state...');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedUsername = localStorage.getItem('username');

      if (accessToken && refreshToken && storedUsername) {
        console.log('Found stored tokens, checking expiration...');
        if (checkTokenExpiration(accessToken)) {
          console.log('Access token is still valid');
          setIsAuthenticated(true);
          setUsername(storedUsername);
        } else {
          console.log('Access token expired, attempting refresh...');
          const refreshSuccess = await refreshAccessToken(refreshToken);
          if (refreshSuccess) {
            console.log('Token refresh successful');
            setIsAuthenticated(true);
            setUsername(storedUsername);
          } else {
            console.log('Token refresh failed, logging out...');
            handleLogout();
          }
        }
      } else {
        console.log('No stored tokens found');
      }
      setAuthChecked(true);
    };

    initializeAuth();

    // Set up periodic token check
    const interval = setInterval(async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        if (!checkTokenExpiration(accessToken)) {
          console.log('Access token expired, attempting refresh...');
          const refreshSuccess = await refreshAccessToken(refreshToken);
          if (!refreshSuccess) {
            console.log('Token refresh failed, logging out...');
            handleLogout();
          }
        }
      }
    }, 5000); // Check every 5 seconds for testing

    return () => clearInterval(interval);
  }, []);

  const login = (username: string, accessToken: string, refreshToken: string) => {
    console.log('Logging in user:', username);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = async () => {
    console.log('Initiating logout...');
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        console.log('Logout API call successful');
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    handleLogout();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, authChecked }}>
      {authChecked ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 