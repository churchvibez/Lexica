import React from 'react';
import '../../design.scss';

const DashboardPage: React.FC = () => {
  // TODO: Get username from auth context/state
  const username = 'admin'; // Temporary hardcoded value

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Welcome, {username}!</h1>
      </div>
    </div>
  );
};

export default DashboardPage; 