import React, { useEffect, useState } from 'react';
import '../../design.scss';
import { useAuth } from '../../context/AuthContext.tsx';

interface User {
  id: number;
  username: string;
  xp: number;
}

const getMedal = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

const LeaderboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { username: currentUsername } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users/leaderboard');
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        setUsers([]); // Show nothing if fetch fails
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <div className="leaderboard-description">See how you stack up against other learners. Climb the ranks by earning more XP!</div>
      </div>
      <div className="leaderboard-list">
        {users.map((user, idx) => (
          <div
            key={user.id}
            className={`leaderboard-row${user.username === currentUsername ? ' current-user-row' : ''}`}
          >
            <div className="leaderboard-rank">
              {getMedal(idx + 1) || idx + 1}
            </div>
            <div className="leaderboard-avatar">
              {/* Placeholder avatar: colored circle with first letter */}
              <div className="avatar-circle">{user.username[0]}</div>
            </div>
            <div className="leaderboard-username">{user.username}</div>
            <div className="leaderboard-xp">{user.xp} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage; 