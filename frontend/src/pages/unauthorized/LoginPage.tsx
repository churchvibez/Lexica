import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import '../../design.scss';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Пожалуйста, введите имя пользователя и пароль.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        login(data.username, data.accessToken, data.refreshToken);
        navigate('/modules');
      } else {
        setError(data.message || 'Ошибка входа');
      }
    } catch (error) {
      setError('Произошла ошибка при входе');
    }
  };

  return (
    <div className="unauth-content auth-bg">
      <div className="auth-card">
        <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Lexica</div>
        {/* <h2 className="auth-title">Login</h2> */}
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" type="submit">Войти</button>
        </form>
        <div className="auth-footer">
          Нет аккаунта?{' '}
          <span className="auth-link" onClick={() => navigate('/signup')}>Зарегистрироваться</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 