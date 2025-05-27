import React, { useEffect, useState } from 'react';
import '../../design.scss';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

interface Module {
  id: number;
  level_id: number;
  title: string;
  description: string;
  sequence: number;
  points: number;
  levelSlug: string;
}

interface ModuleLevel {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  modules: Module[];
}

// Helper to generate 15 modules per level
const generateModules = (levelId: number, levelSlug: string) => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: levelId * 100 + i + 1,
    level_id: levelId,
    title: `Module ${i + 1}`,
    description: `Description for Module ${i + 1}`,
    sequence: i + 1,
    points: 10 * (i + 1),
    levelSlug,
  }));
};

const fallbackModuleData: ModuleLevel[] = [
  {
    id: 1,
    name: 'A1-A2',
    slug: 'a1-a2',
    display_order: 1,
    modules: generateModules(1, 'a1-a2'),
  },
  {
    id: 2,
    name: 'B1-B2',
    slug: 'b1-b2',
    display_order: 2,
    modules: generateModules(2, 'b1-b2'),
  },
  {
    id: 3,
    name: 'C1-C2',
    slug: 'c1-c2',
    display_order: 3,
    modules: generateModules(3, 'c1-c2'),
  },
];

const Modules: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [moduleData, setModuleData] = useState<ModuleLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<{ [key: string]: boolean }>({}); // key: module.id
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }
        const response = await fetch('http://localhost:8080/api/modules', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const data = await response.json();
        const modulesWithSlug = data.data.map((level: ModuleLevel) => ({
          ...level,
          modules: level.modules.map(module => ({
            ...module,
            levelSlug: level.slug
          }))
        }));
        setModuleData(modulesWithSlug);
      } catch (err: any) {
        // On error, use fallback mock data
        setModuleData(fallbackModuleData);
        setError(null); // Hide error for demo
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchModules();
    }
  }, [isAuthenticated]);

  const handleModuleClick = (module: Module, idx: number, modules: Module[]) => {
    // Mark as completed for demo
    setCompleted(prev => ({ ...prev, [module.id]: true }));
    navigate(`/modules/${module.levelSlug}/${module.sequence}`);
  };

  if (loading) {
    return <div className="modules-container">Loading modules...</div>;
  }

  if (error) {
    return <div className="modules-container">Error: {error}</div>;
  }

  return (
    <div className="modules-container">
      <h1>Modules</h1>
      {
        moduleData.map(level => (
          <div key={level.id} className="module-level-section">
            <h3>{level.name}</h3>
            <div className="modules-grid">
              {level.modules.map((module, idx) => {
                // Sequential unlock logic
                const isFirst = idx === 0;
                const prevCompleted = idx > 0 ? completed[level.modules[idx - 1].id] : true;
                const isUnlocked = isFirst || prevCompleted;
                return (
                  <div
                    key={module.id}
                    className={`module-card${isUnlocked ? '' : ' locked'}`}
                    onClick={isUnlocked ? () => handleModuleClick(module, idx, level.modules) : undefined}
                  >
                    <h4>{module.title}</h4>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default Modules; 