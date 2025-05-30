import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../design.scss';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Аккаунт создан! Теперь вы можете войти.');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setError(data.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Произошла ошибка при регистрации');
    }
  };

  return (
    <div className="unauth-content auth-bg">
      <div className="auth-card">
        <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Lexica</div>
        {/* <h2 className="auth-title">Sign Up</h2> */}
        <form className="auth-form" onSubmit={handleSignup}>
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
          <input
            className="auth-input"
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          <button className="auth-btn" type="submit">Зарегистрироваться</button>
        </form>
        <div className="auth-footer">
          Уже есть аккаунт?{' '}
          <span className="auth-link" onClick={() => navigate('/login')}>Войти</span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 