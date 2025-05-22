import React, { useEffect, useState } from 'react';
import '../../design.scss';

interface Test {
  id: number;
  level_id: number;
  title: string;
  description: string;
  sequence: number;
  levelSlug: string;
}

interface TestLevel {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  tests: Test[];
}

const generateTests = (levelId: number, levelSlug: string) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: levelId * 100 + i + 1,
    level_id: levelId,
    title: `Test ${i + 1}`,
    description: `Description for Test ${i + 1}`,
    sequence: i + 1,
    levelSlug,
  }));
};

const fallbackTestData: TestLevel[] = [
  {
    id: 1,
    name: 'A1-A2',
    slug: 'a1-a2',
    display_order: 1,
    tests: generateTests(1, 'a1-a2'),
  },
  {
    id: 2,
    name: 'B1-B2',
    slug: 'b1-b2',
    display_order: 2,
    tests: generateTests(2, 'b1-b2'),
  },
  {
    id: 3,
    name: 'C1-C2',
    slug: 'c1-c2',
    display_order: 3,
    tests: generateTests(3, 'c1-c2'),
  },
];

const TestsPage: React.FC = () => {
  const [testData, setTestData] = useState<TestLevel[]>(fallbackTestData);

  // No backend fetch for now, just use fallbackTestData

  const handleTestClick = (test: Test) => {
    // No-op for now
  };

  return (
    <div className="modules-container">
      <h1>Tests</h1>
      {
        testData.map(level => (
          <div key={level.id} className="module-level-section">
            <h3>{level.name}</h3>
            <div className="modules-grid">
              {level.tests.map(test => (
                <div
                  key={test.id}
                  className="module-card"
                  onClick={() => handleTestClick(test)}
                >
                  <h4>{test.title}</h4>
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default TestsPage; 