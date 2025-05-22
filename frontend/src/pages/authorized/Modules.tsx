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

const Modules: React.FC = () => {
  const { username, isAuthenticated } = useAuth();
  const [moduleData, setModuleData] = useState<ModuleLevel[]>([]);
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
        
        const response = await fetch('http://localhost:8080/api/modules', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch modules');
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
        console.error('Error fetching modules:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchModules();
    }
  }, [isAuthenticated]);

  const handleModuleClick = (module: Module) => {
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
            {/* Add progress message here later */}
            <div className="modules-grid">
              {level.modules.map(module => (
                <div
                  key={module.id}
                  className="module-card"
                  onClick={() => handleModuleClick(module)}
                >
                  <h4>{module.title}</h4>
                  {/* Add lock/completion status here later */}
                </div>
              ))}
            </div>
            {/* Add visual separator here later */}
          </div>
        ))
      }
    </div>
  );
};

export default Modules; 