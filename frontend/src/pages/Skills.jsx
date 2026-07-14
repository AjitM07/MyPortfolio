import { useState, useEffect } from 'react';
import api from '../utils/api';

const EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];

const SkillIcon = ({ name }) => {
  const [extIndex, setExtIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setExtIndex(0);
    setImgFailed(false);
  }, [name]);

  const baseName = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const imgPath = `/skills/${baseName}${EXTENSIONS[extIndex]}`;

  const handleImageError = () => {
    if (extIndex < EXTENSIONS.length - 1) {
      setExtIndex(extIndex + 1);
    } else {
      setImgFailed(true);
    }
  };

  if (imgFailed) {
    return <span className="text-3xl text-text-secondary">⚙️</span>;
  }

  return (
    <img
      src={imgPath}
      alt={name}
      className="w-full h-full object-contain p-1.5"
      onError={handleImageError}
    />
  );
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills');
        setSkills(res.data);
      } catch (err) {
        console.error('Error fetching skills:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Categories list to filter/group
  const categories = ['Languages', 'Frontend', 'Backend', 'Database', 'Deployment', 'CI/CD', 'Others'];

  // Group skills dynamically based on category
  const groupedSkills = categories.reduce((acc, cat) => {
    const catSkills = skills.filter((s) => s.category === cat);
    if (catSkills.length > 0) {
      acc[cat] = catSkills;
    }
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center min-height-[80vh] text-2xl font-semibold text-accent-blue text-glow">
        Loading Skills...
      </div>
    );
  }

  const hasSkills = Object.keys(groupedSkills).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 z-10 relative">

      <h1 className="text-4xl font-extrabold text-center mb-16 tracking-wide gradient-text text-glow">
        Skills
      </h1>

      {!hasSkills ? (
        <div className="glass-panel p-10 text-center text-text-secondary">
          No skills registered yet.
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <section key={category} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-accent-blue border-b border-border-glass pb-2.5 text-glow">
                {category}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8 justify-items-center">
                {items.map((skill) => {
                  const radius = 40;
                  const strokeWidth = 3;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDashoffset = circumference - (circumference * skill.level) / 100;

                  return (
                    <div key={skill._id} className="group flex flex-col items-center justify-center relative p-2">
                      {/* Donut Progress Ring + Flipping Logo */}
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        {/* Circular Donut (SVG Progress Ring) */}
                        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                          {/* Background Circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="rgba(255, 255, 255, 0.17)"
                            strokeWidth={strokeWidth}
                          />
                          {/* Foreground progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="var(--color-accent-blue)"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>

                        {/* 3D Flipping Card Container */}
                        <div className="relative w-30 h-30 perspective-1000">
                          <div className="w-full h-full relative transition-transform duration-800 transform-style-3d group-hover:rotate-y-180">
                            {/* Front Side: Skill Logo */}
                            <div className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center backface-hidden p-2">
                              <SkillIcon name={skill.name} />
                            </div>

                            {/* Back Side: Skill Logo*/}
                            <div className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center backface-hidden rotate-y-180 p-2">
                              <SkillIcon name={skill.name} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Skill Name */}
                      <span className="text-sm font-semibold text-neutral-300 mt-3 group-hover:text-white transition-colors duration-200 text-center truncate max-w-full">
                        {skill.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills;
