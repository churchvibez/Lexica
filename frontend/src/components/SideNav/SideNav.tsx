import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import '../../design.scss';

const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const [pendingNav, setPendingNav] = React.useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);

  // Helper to detect if on a quiz (ModuleDetail, not review)
  const isQuizInProgress = React.useMemo(() => {
    // Example: /modules/:levelSlug/:moduleOrderId
    return location.pathname.startsWith('/modules/') && !location.pathname.endsWith('/review');
  }, [location.pathname]);

  const handleLogoClick = () => {
    if (isQuizInProgress) {
      setPendingNav('/modules');
      setShowExitConfirm(true);
    } else {
      navigate('/modules');
    }
  };

  const handleSignOut = () => {
    if (isQuizInProgress) {
      setPendingNav('/');
      setShowExitConfirm(true);
    } else {
      logout();
      navigate('/');
    }
  };

  const handleNavItemClick = (path: string) => {
    if (isQuizInProgress) {
      setPendingNav(path);
      setShowExitConfirm(true);
    } else {
      navigate(path);
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    if (pendingNav) {
      if (pendingNav === '/') logout();
      navigate(pendingNav);
      setPendingNav(null);
    }
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
    setPendingNav(null);
  };

  return (
    <div className="side-nav dark-side-nav">
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <h1>Lexica</h1>
      </div>
      <div className="side-nav-links-group">
        <nav className="nav-menu">
          <div className="nav-item" onClick={() => handleNavItemClick('/modules')}>
            Модули
          </div>
          <div className="nav-item" onClick={() => handleNavItemClick('/tests')}>
            Тесты
          </div>
          <div className="nav-item" onClick={() => handleNavItemClick('/leaderboard')}>
            Таблица лидеров
          </div>
          <div className="nav-item" onClick={() => handleNavItemClick('/profile')}>
            Профиль
          </div>
        </nav>
        <div className="sign-out-container">
          <button className="signout-button" onClick={handleSignOut}>
            Выйти
          </button>
        </div>
      </div>
      {showExitConfirm && (
        <div className="exit-confirm-overlay">
          <div className="exit-confirm-dialog">
            <h3>Выйти из модуля?</h3>
            <p>Вы уверены, что хотите выйти? Ваш прогресс будет потерян.</p>
            <div className="exit-confirm-buttons">
              <button onClick={confirmExit} className="confirm-exit">Да, выйти</button>
              <button onClick={cancelExit} className="cancel-exit">Нет, остаться</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNav; 