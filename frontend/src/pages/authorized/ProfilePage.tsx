import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import bcrypt from 'bcryptjs';
import '../../design.scss';
import { API_BASE_URL } from '../../apiConfig.ts';

interface User {
  id: number;
  username: string;
  modules_completed: number;
  tests_completed: number;
  completed_A_modules: boolean;
  completed_B_modules: boolean;
  completed_C_modules: boolean;
  completed_A_tests: boolean;
  completed_B_tests: boolean;
  completed_C_tests: boolean;
  xp: number;
}

const achievementLabels: { [key: string]: string } = {
  completed_A_modules: 'Все модули A1-A2 завершены',
  completed_B_modules: 'Все модули B1-B2 завершены',
  completed_C_modules: 'Все модули C1-C2 завершены',
  completed_A_tests: 'Все тесты A1-A2 завершены',
  completed_B_tests: 'Все тесты B1-B2 завершены',
  completed_C_tests: 'Все тесты C1-C2 завершены',
};

const ProfilePage: React.FC = () => {
  const { username } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');
  const [popupType, setPopupType] = useState<'error' | 'success'>('success');

  useEffect(() => {
    const fetchUserAndRank = async () => {
      setLoading(true);
      try {
        // Fetch leaderboard for rank
        const leaderboardRes = await fetch(`${API_BASE_URL}/api/users/leaderboard`);
        const leaderboardData = await leaderboardRes.json();
        let userRank: number | null = null;
        let userData: User | null = null;
        if (leaderboardData.success) {
          leaderboardData.users.forEach((u: User, idx: number) => {
            if (u.username === username) {
              userRank = idx + 1;
              userData = u;
            }
          });
        }
        // Fetch user details (for completed_* fields)
        const userRes = await fetch(`${API_BASE_URL}/api/users/profile?username=${username}`);
        const userDetails = await userRes.json();
        console.log('DEBUG /api/users/profile response:', userDetails);
        if (userDetails.success) {
          if (userData && typeof userData === 'object' && !Array.isArray(userData)) {
            const mergedUser = Object.assign({}, userData, userDetails.user);
            console.log('DEBUG merged user object:', mergedUser);
            setUser(mergedUser);
          } else {
            setUser(userDetails.user);
          }
        } else {
          setUser(userData);
        }
        setRank(userRank);
      } catch (err) {
        setUser(null);
        setRank(null);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchUserAndRank();
  }, [username]);

  const handleChangePassword = async () => {
    setPasswordError('');
    setSuccessMsg('');
    if (!password || !confirmPassword) {
      setPasswordError('Пожалуйста, заполните оба поля.');
      setPopupType('error');
      setPopupMsg('Пожалуйста, заполните оба поля.');
      setShowPopup(true);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Пароли не совпадают.');
      setPopupType('error');
      setPopupMsg('Пароли не совпадают.');
      setShowPopup(true);
      return;
    }
    try {
      const hashed = await bcrypt.hash(password, 10);
      const res = await fetch(`${API_BASE_URL}/api/users/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: hashed }),
      });
      if (!res.ok) {
        setPopupType('error');
        setPopupMsg('Не удалось изменить пароль.');
        setShowPopup(true);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Пароль успешно изменён!');
        setPopupType('success');
        setPopupMsg('Пароль успешно изменён!');
        setShowPopup(true);
        setPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.message || 'Не удалось изменить пароль.');
        setPopupType('error');
        setPopupMsg(data.message || 'Не удалось изменить пароль.');
        setShowPopup(true);
      }
    } catch (err) {
      setPasswordError('Не удалось изменить пароль.');
      setPopupType('error');
      setPopupMsg('Не удалось изменить пароль.');
      setShowPopup(true);
    }
  };

  // Helper to get league label for a given rank
  const getLeagueLabel = (rank: number | null) => {
    if (!rank) return '';
    if (rank <= 5) return 'Золотая лига';
    if (rank <= 10) return 'Серебряная лига';
    if (rank <= 20) return 'Бронзовая лига';
    return 'Без лиги';
  };

  if (loading || !user) {
    return <div className="profile-page">Загрузка...</div>;
  }

  // Gather achievements
  const achievements: string[] = [];
  (['completed_A_modules', 'completed_B_modules', 'completed_C_modules', 'completed_A_tests', 'completed_B_tests', 'completed_C_tests'] as const).forEach(key => {
    if ((user as any)[key]) achievements.push(achievementLabels[key]);
  });

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2 className="profile-welcome">Добро пожаловать, {username}</h2>
        <div className="profile-password-form">
          <input
            className="auth-input"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button
            className="auth-btn"
            style={{ minWidth: '180px', width: '100%', maxWidth: '260px' }}
            onClick={handleChangePassword}
            disabled={!password || !confirmPassword}
          >
            Изменить пароль
          </button>
          {/* Popup modal for error/success */}
          {showPopup && (
            <div className={`profile-popup-modal ${popupType}`}> 
              <div className="profile-popup-content">
                <span>{popupMsg}</span>
                <button className="profile-popup-close" onClick={() => setShowPopup(false)}>OK</button>
              </div>
            </div>
          )}
        </div>
        <h3 className="profile-section-title">Статистика</h3>
        <div className="profile-stats-card">
          <div className="profile-stat-row">
            <span className="profile-stat-label">Ранг</span>
            <span className="profile-stat-value">{rank ? `${getLeagueLabel(rank)} #${rank}` : '-'}</span>
          </div>
          <div className="profile-stat-row">
            <span className="profile-stat-label">Модулей завершено</span>
            <span className="profile-stat-value">{user.modules_completed}</span>
          </div>
          <div className="profile-stat-row">
            <span className="profile-stat-label">Тестов завершено</span>
            <span className="profile-stat-value">{user.tests_completed}</span>
          </div>
          <div className="profile-stat-row">
            <span className="profile-stat-label">ОПЫТ</span>
            <span className="profile-stat-value">{user.xp}</span>
          </div>
        </div>
        <h3 className="profile-section-title">Достижения</h3>
        <div className="profile-achievements-card">
          {achievements.length === 0 ? (
            <div className="profile-achievement-row">Пока нет достижений.</div>
          ) : (
            achievements.map((ach, idx) => (
              <div key={idx} className="profile-achievement-badge">{ach}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 