import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import bcrypt from 'bcryptjs';
import '../../design.scss';

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
  completed_A_modules: 'Completed all A1-A2 Modules',
  completed_B_modules: 'Completed all B1-B2 Modules',
  completed_C_modules: 'Completed all C1-C2 Modules',
  completed_A_tests: 'Completed all A1-A2 Tests',
  completed_B_tests: 'Completed all B1-B2 Tests',
  completed_C_tests: 'Completed all C1-C2 Tests',
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

  useEffect(() => {
    const fetchUserAndRank = async () => {
      setLoading(true);
      try {
        // Fetch leaderboard for rank
        const leaderboardRes = await fetch('http://localhost:8080/api/users/leaderboard');
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
        const userRes = await fetch(`http://localhost:8080/api/users/profile?username=${username}`);
        const userDetails = await userRes.json();
        if (userDetails.success) {
          if (userData && typeof userData === 'object' && !Array.isArray(userData)) {
            setUser(Object.assign({}, userData, userDetails.user));
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
      setPasswordError('Please fill in both fields.');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    try {
      const hashed = await bcrypt.hash(password, 10);
      const res = await fetch('http://localhost:8080/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: hashed }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Password changed successfully!');
        setPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.message || 'Failed to change password.');
      }
    } catch (err) {
      setPasswordError('Failed to change password.');
    }
  };

  if (loading || !user) {
    return <div className="profile-page">Loading...</div>;
  }

  // Gather achievements
  const achievements: string[] = [];
  (['completed_A_modules', 'completed_B_modules', 'completed_C_modules', 'completed_A_tests', 'completed_B_tests', 'completed_C_tests'] as const).forEach(key => {
    if ((user as any)[key]) achievements.push(achievementLabels[key]);
  });

  return (
    <div className="profile-page">
      <h2 className="profile-welcome">Welcome, {username}</h2>
      <div className="profile-avatar">{username ? username[0].toUpperCase() : 'U'}</div>
      <div className="profile-password-form">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button
          className="profile-change-password-btn"
          onClick={handleChangePassword}
          disabled={!password || !confirmPassword || password !== confirmPassword}
        >
          Change Password
        </button>
        {passwordError && <div className="profile-error">{passwordError}</div>}
        {successMsg && <div className="profile-success">{successMsg}</div>}
      </div>
      <h3 className="profile-section-title">Statistics</h3>
      <div className="profile-stats">
        <div className="profile-stat-row">
          <span>Rank</span>
          <span>{rank ?? '-'}</span>
        </div>
        <div className="profile-stat-row">
          <span>Modules Completed</span>
          <span>{user.modules_completed}</span>
        </div>
        <div className="profile-stat-row">
          <span>Tests Completed</span>
          <span>{user.tests_completed}</span>
        </div>
      </div>
      <h3 className="profile-section-title">Recent Achievements</h3>
      <div className="profile-achievements">
        {achievements.length === 0 ? (
          <div className="profile-achievement-row">No achievements yet.</div>
        ) : (
          achievements.map((ach, idx) => (
            <div className="profile-achievement-row" key={idx}>{ach}</div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 