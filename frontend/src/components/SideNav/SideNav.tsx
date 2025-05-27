import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import '../../design.scss';

const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogoClick = () => {
    navigate('/modules'); // Always go to modules when authenticated
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleNavItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="side-nav dark-side-nav">
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <h1>Lexica</h1>
      </div>
      <div className="side-nav-links-group">
        <nav className="nav-menu">
          <div className="nav-item" onClick={() => handleNavItemClick('/modules')}>
            Modules
          </div>
          <div className="nav-item" onClick={() => handleNavItemClick('/tests')}>
            Tests
          </div>
          <div className="nav-item" onClick={() => handleNavItemClick('/leaderboard')}>
            Leaderboard
          </div>
          <div className="nav-item" onClick={() => handleNavItemClick('/profile')}>
            Profile
          </div>
        </nav>
        <div className="sign-out-container">
          <button className="signout-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav; 