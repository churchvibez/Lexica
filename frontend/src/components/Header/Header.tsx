import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import '../../design.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/modules');
    } else {
      navigate('/');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={handleLogoClick}>
          <h1>Lexica</h1>
        </div>
        <nav className="nav-menu">
          {isAuthenticated ? (
            <button className="signout-button" onClick={handleSignOut}>
              Выйти
            </button>
          ) : (
            <button className="login-button" onClick={handleLoginClick}>
              Войти
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 