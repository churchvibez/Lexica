import React, { useEffect, useState } from 'react';
import '../../design.scss';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig.ts';

interface Module {
  id: number;
  level_id: number;
  title: string;
  description: string;
  order_id: number;
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
    order_id: i + 1,
    points: 10 * (i + 1),
    levelSlug,
  }));
};

const fallbackModuleData: ModuleLevel[] = [
  {
    id: 1,
    name: 'A1-A2',
    slug: 'beginner',
    display_order: 1,
    modules: generateModules(1, 'beginner'),
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
  const [userProgress, setUserProgress] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }
        const response = await fetch(`${API_BASE_URL}/api/modules`, {
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
        if (data.userProgress) {
          setUserProgress(data.userProgress);
        }
      } catch (err: any) {
        setError('Failed to fetch modules');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchModules();
    }
  }, [isAuthenticated]);

  const getProgressKey = (levelId: number) => {
    if (levelId === 1) return 'progress_A_modules';
    if (levelId === 2) return 'progress_B_modules';
    if (levelId === 3) return 'progress_C_modules';
    return '';
  };

  const handleModuleClick = (module: Module, unlocked: boolean) => {
    if (unlocked) navigate(`/modules/${module.levelSlug}/${module.order_id}`);
  };

  if (loading) {
    return <div className="modules-container">Loading modules...</div>;
  }

  if (error) {
    return <div className="modules-container">Error: {error}</div>;
  }

  return (
    <div className="modules-container">
      <h1>Модули</h1>
      {
        moduleData.map((level, levelIdx) => {
          // Get previous level's progress and module count
          let prevProgress = 0;
          let prevModuleCount = 0;
          if (levelIdx > 0) {
            const prevLevel = moduleData[levelIdx - 1];
            const prevProgressKey = getProgressKey(prevLevel.id);
            prevProgress = userProgress[prevProgressKey] || 0;
            prevModuleCount = prevLevel.modules.length;
          }
          return (
            <div key={level.id} className="module-level-section">
              <h3>{level.name}</h3>
              <div className="modules-grid">
                {level.modules.map((module, moduleIdx) => {
                  const progressKey = getProgressKey(module.level_id);
                  const progress = userProgress[progressKey] || 0;
                  let unlocked = false;
                  if (module.order_id === 1 && levelIdx > 0) {
                    unlocked = prevProgress >= prevModuleCount;
                  } else {
                    unlocked = progress >= (module.order_id - 1);
                  }
                  // Debug log
                  console.log(`Module: ${module.title}, order_id: ${module.order_id}, progress: ${progress}, unlocked: ${unlocked}`);
                  return (
                    <div
                      key={module.id}
                      className={`module-card${unlocked ? '' : ' locked'}`}
                      onClick={() => handleModuleClick(module, unlocked)}
                      style={unlocked ? {} : { opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }}
                    >
                      <h4>{module.title}</h4>
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

export default Modules; 