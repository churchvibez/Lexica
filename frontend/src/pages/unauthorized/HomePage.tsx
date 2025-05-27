import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../design.scss';

const sections = [
  {
    title: 'Title 1',
    description: 'Description 1',
    img: 'https://via.placeholder.com/160x120?text=Image+1',
  },
  {
    title: 'Title 2',
    description: 'Description 2',
    img: 'https://via.placeholder.com/160x120?text=Image+2',
  },
  {
    title: 'Title 3',
    description: 'Description 3',
    img: 'https://via.placeholder.com/160x120?text=Image+3',
  },
  {
    title: 'Title 4',
    description: 'Description 4',
    img: 'https://via.placeholder.com/160x120?text=Image+4',
  },
  {
    title: 'Title 5',
    description: 'Description 5',
    img: 'https://via.placeholder.com/160x120?text=Image+5',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-root">
      <div className="homepage-header-center">
        <div className="homepage-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Lexica</div>
        <div className="homepage-header-buttons">
          <button className="homepage-login-btn" onClick={() => navigate('/login')}>Login</button>
          <button className="homepage-signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
      <main className="homepage-main">
        {sections.map((section, idx) => (
          <div className={`homepage-section ${idx % 2 === 0 ? 'left' : 'right'}`} key={idx}>
            {idx % 2 === 0 ? (
              <>
                <div className="homepage-section-text">
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>
                <img className="homepage-section-img" src={section.img} alt={section.title} />
              </>
            ) : (
              <>
                <img className="homepage-section-img" src={section.img} alt={section.title} />
                <div className="homepage-section-text">
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>
              </>
            )}
          </div>
        ))}
        <div className="homepage-bottom-btn-wrapper">
          <button className="homepage-start-btn" onClick={() => navigate('/login')}>Start Learning</button>
        </div>
      </main>
    </div>
  );
};

export default HomePage; 