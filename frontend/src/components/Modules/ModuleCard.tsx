import React from 'react';
import '../../design.scss';

interface ModuleCardProps {
  title: string;
  description: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description }) => {
  return (
    <div className="module-card">
      <div className="module-card-image-placeholder"></div>
      <div className="module-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ModuleCard; 