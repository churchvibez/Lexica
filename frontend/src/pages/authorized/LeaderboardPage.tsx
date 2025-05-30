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

const getLeague = (rank: number) => {
  if (rank <= 5) return 'gold';
  if (rank <= 10) return 'silver';
  if (rank <= 20) return 'bronze';
  return 'unranked';
};

const getLeagueIcon = (league: string) => {
  if (league === 'gold') return '🏆';
  if (league === 'silver') return '🛡️';
  if (league === 'bronze') return '🌿';
  return '🔰';
};

const getLeagueLabel = (league: string) => {
  if (league === 'gold') return 'Золотая лига';
  if (league === 'silver') return 'Серебряная лига';
  if (league === 'bronze') return 'Бронзовая лига';
  return 'Без лиги';
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

  // Find current user's rank
  const currentUserIndex = users.findIndex(u => u.username === currentUsername);
  const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : null;
  const showCondensed = currentUserRank && currentUserRank > 35;

  // Prepare the list to display
  let displayUsers: { user: User, rank: number }[] = [];
  if (showCondensed) {
    // Show top 35, then break, then current user
    displayUsers = users.slice(0, 35).map((user, idx) => ({ user, rank: idx + 1 }));
    // Add a break marker
    displayUsers.push({ user: { id: -1, username: '...', xp: -1 }, rank: -1 });
    // Add current user at their rank
    displayUsers.push({ user: users[currentUserIndex], rank: currentUserRank });
  } else {
    displayUsers = users.map((user, idx) => ({ user, rank: idx + 1 }));
  }

  // In the non-condensed view, only show the top 35 users
  const usersToShow = !showCondensed ? users.slice(0, 35) : users;

  // Split users into leagues
  const leagues = [
    { key: 'gold', min: 1, max: 5 },
    { key: 'silver', min: 6, max: 10 },
    { key: 'bronze', min: 11, max: 20 },
    { key: 'unranked', min: 21, max: usersToShow.length },
  ];

  // Always show top 35 in leagues
  const topUsers = users.slice(0, 35);
  const isUserInTop35 = currentUserRank && currentUserRank <= 35;

  let leaderboardContent = (
    <>
      {leagues.map(league => {
        const leagueUsers = topUsers.slice(league.min - 1, league.max);
        if (leagueUsers.length === 0) return null;
        return (
          <div key={league.key} className={`leaderboard-league-section league-${league.key}`}>
            <div className="league-heading">
              <span className="league-icon">{getLeagueIcon(league.key)}</span>
              <span className="league-label">{getLeagueLabel(league.key)}</span>
            </div>
            {leagueUsers.map((user, idx) => {
              const rank = league.min + idx;
              const isMedal = rank <= 3;
              return (
                <div
                  key={user.id}
                  className={`leaderboard-row league-row league-${league.key}${user.username === currentUsername ? ' current-user-row' : ''}${isMedal ? ' medal-row' : ''}`}
                >
                  <div className="leaderboard-rank">
                    {getMedal(rank) || rank}
                  </div>
                  <div className="leaderboard-avatar">
                    <div className="avatar-circle">{user.username[0]}</div>
                  </div>
                  <div className="leaderboard-username">{user.username}</div>
                  <div className="leaderboard-xp">{user.xp} XP</div>
                </div>
              );
            })}
          </div>
        );
      })}
      {/* If user is not in top 35, show break and their row */}
      {!isUserInTop35 && currentUserRank && (
        <div className="leaderboard-league-section league-condensed">
          <div className="leaderboard-row leaderboard-break-row" style={{ justifyContent: 'center', color: '#b0c4d4', fontStyle: 'italic' }}>
            ...
          </div>
          <div className="leaderboard-row league-row current-user-row" style={{ justifyContent: 'center' }}>
            <div className="leaderboard-rank">
              {getMedal(currentUserRank) || currentUserRank}
            </div>
            <div className="leaderboard-avatar">
              <div className="avatar-circle">{users[currentUserIndex].username[0]}</div>
            </div>
            <div className="leaderboard-username">{users[currentUserIndex].username}</div>
            <div className="leaderboard-xp">{users[currentUserIndex].xp} XP</div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h2>Таблица лидеров</h2>
        <div className="leaderboard-description">Сравните свои успехи с другими участниками. Зарабатывайте XP и поднимайтесь в рейтинге!</div>
      </div>
      <div className="leaderboard-list">
        {leaderboardContent}
      </div>
    </div>
  );
};

export default LeaderboardPage; 