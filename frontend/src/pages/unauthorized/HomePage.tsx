import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../design.scss';

const sections = [
  {
    title: 'Изучайте английский!',
    description: 'Готовьтесь к реальным ситуациям, экзаменам и путешествиям с интерактивными уроками.'
  },
  {
    title: 'Практикуйтесь на тестах',
    description: 'Проверьте свои знания с помощью разнообразных тестов и мгновенной обратной связи.'
  },
  {
    title: 'Следите за прогрессом',
    description: 'Видьте свой рост и получайте достижения по мере обучения.'
  },
  {
    title: 'Современный и удобный дизайн',
    description: 'Учитесь в красивой и комфортной среде без отвлекающих факторов.'
  },
  {
    title: 'Соревнуйтесь в рейтинге',
    description: 'Сравнивайте успехи с другими и поднимайтесь в таблице лидеров.'
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="unauth-content" style={{ textAlign: 'center' }}>
      <div className="homepage-header-center" style={{ textAlign: 'center' }}>
        <div className="homepage-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', textAlign: 'center' }}>Lexica</div>
        <div className="homepage-header-buttons" style={{ justifyContent: 'center' }}>
          <button className="homepage-login-btn" onClick={() => navigate('/login')}>Войти</button>
          <button className="homepage-signup-btn" onClick={() => navigate('/signup')}>Регистрация</button>
        </div>
      </div>
      <main className="homepage-main" style={{ alignItems: 'center', textAlign: 'center' }}>
        {sections.map((section, idx) => (
          <div
            className="homepage-section"
            key={idx}
            style={{
              justifyContent: 'center',
              textAlign: 'center',
              background: '#292d36',
              color: '#f3f3f3',
              borderRadius: 24,
              boxShadow: '0 4px 24px rgba(108,99,255,0.10)',
              padding: '40px 32px',
              margin: '32px 0',
              width: '80vw',
              maxWidth: 700,
              minHeight: 120,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="homepage-section-text" style={{ width: '100%', textAlign: 'center' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 10 }}>{section.title}</h2>
              <p style={{ fontSize: '1.08rem', color: '#e0e0e0', margin: 0 }}>{section.description}</p>
            </div>
          </div>
        ))}
        <div className="homepage-bottom-btn-wrapper" style={{ justifyContent: 'center' }}>
          <button className="homepage-start-btn" style={{ margin: '0 auto' }} onClick={() => navigate('/login')}>Начать обучение</button>
        </div>
      </main>
    </div>
  );
};

export default HomePage; 