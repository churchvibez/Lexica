import React, { useEffect, useState } from 'react';
import '../../design.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { API_BASE_URL } from '../../apiConfig.ts';

interface Test {
  id: number;
  level_id: number;
  title: string;
  description: string;
  sequence: number;
}

interface TestLevel {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  tests: Test[];
}

const TestsPage: React.FC = () => {
  const [testData, setTestData] = useState<TestLevel[]>([]);
  const [userProgress, setUserProgress] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        console.log('Access Token:', accessToken); // Debug log
        console.log('Is Authenticated:', isAuthenticated); // Debug log
        
        if (!accessToken) {
          console.log('No access token found, redirecting to login...'); // Debug log
          navigate('/login');
          return;
        }

        console.log('Making API request to:', `${API_BASE_URL}/api/tests`); // Debug log
        const res = await fetch(`${API_BASE_URL}/api/tests`, {
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', res.status); // Debug log
        const data = await res.json();
        console.log('Response data:', data); // Debug log

        if (!data.success) throw new Error(data.message || 'Failed to fetch tests');
        setTestData(data.data);
        setUserProgress(data.userProgress || {});
      } catch (err: any) {
        console.error('Error in fetchTests:', err); // Debug log
        setError(err.message);
        if (err.message.includes('Invalid token') || err.message.includes('No access token')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      console.log('User is authenticated, fetching tests...'); // Debug log
      fetchTests();
    } else {
      console.log('User is not authenticated, redirecting to login...'); // Debug log
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const getProgressKey = (levelId: number) => {
    if (levelId === 1) return 'progress_A_tests';
    if (levelId === 2) return 'progress_B_tests';
    if (levelId === 3) return 'progress_C_tests';
    return '';
  };

  const handleTestClick = (test: Test, unlocked: boolean) => {
    if (unlocked) navigate(`/tests/${test.id}`);
  };

  if (loading) return <div></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="modules-container">
      <h1>Тесты</h1>
      {
        testData.map((level, levelIdx) => {
          // Get previous level's progress and test count
          let prevProgress = 0;
          let prevTestCount = 0;
          if (levelIdx > 0) {
            const prevLevel = testData[levelIdx - 1];
            const prevProgressKey = getProgressKey(prevLevel.id);
            prevProgress = userProgress[prevProgressKey] || 0;
            prevTestCount = prevLevel.tests.length;
          }
          return (
            <div key={level.id} className="module-level-section">
              <h3>{level.name}</h3>
              <div className="modules-grid">
                {level.tests.map((test, testIdx) => {
                  const progressKey = getProgressKey(test.level_id);
                  const progress = userProgress[progressKey] || 0;
                  let unlocked = false;
                  if (test.sequence === 1 && levelIdx > 0) {
                    // Only unlock first test in B/C if previous level is fully completed
                    unlocked = prevProgress >= prevTestCount;
                  } else {
                    unlocked = progress >= (test.sequence - 1);
                  }
                  return (
                    <div
                      key={test.id}
                      className={`module-card${unlocked ? '' : ' module-card-locked'}`}
                      onClick={() => handleTestClick(test, unlocked)}
                      style={unlocked ? {} : { opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }}
                    >
                      <h4>{test.title}</h4>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default TestsPage; 