import React, { useEffect, useState } from 'react';
import '../../design.scss';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) throw new Error('No access token');
        const res = await fetch('http://localhost:8080/api/tests', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to fetch tests');
        setTestData(data.data);
        setUserProgress(data.userProgress || {});
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

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