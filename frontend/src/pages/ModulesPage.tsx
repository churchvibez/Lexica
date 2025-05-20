import React from 'react';
import ModuleCard from '../components/Modules/ModuleCard.tsx';
import '../design.scss';

const ModulesPage: React.FC = () => {
  const modules = [
    {
      title: "Title 1",
      description: "Description 1",
    },
    {
      title: "Title 2",
      description: "Description 2",
    },
    {
      title: "Title 3",
      description: "Description 3",
    },
  ];

  return (
    <div className="modules-page">
      <h2>Modules</h2>
      <div className="modules-grid">
        {modules.map((module, index) => (
          <ModuleCard key={index} title={module.title} description={module.description} />
        ))}
      </div>
      <button className="start-learning-button">Start Learning</button>
    </div>
  );
};

export default ModulesPage; 