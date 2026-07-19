import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Settings } from 'lucide-react';

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
    return <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-500 animate-spin" />;
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

const SkillCard = ({ skill, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  const radius = 40;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;

  // Animate progress offset from empty (circumference) to filled level when visible
  const strokeDashoffset = isVisible
    ? circumference - (circumference * skill.level) / 100
    : circumference;

  // Stagger reveal animation based on screen position grid columns (6 columns on desktop)
  const delay = (index % 6) * 50;

  return (
    <div
      ref={domRef}
      className={`group flex flex-col items-center justify-center relative p-2 transition-all duration-[1000ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] transform-gpu will-change-transform ${isVisible
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-6 scale-[0.99]'
        }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {/* Donut Progress Ring + Flipping Logo */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 flex items-center justify-center">
        {/* Circular Donut (SVG Progress Ring) */}
        <svg className="absolute top-0 left-0 w-full h-full -rotate-90 origin-center" viewBox="0 0 100 100">
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
            strokeOpacity={0.75}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-[1200ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]"
            style={{ transitionDelay: isVisible ? `${delay + 100}ms` : '0ms' }}
          />
        </svg>

        {/* 3D Flipping Card Container */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-26 md:h-26 lg:w-30 lg:h-30 perspective-1000">
          <div className="w-full h-full relative transition-transform duration-800 transform-style-3d group-hover:rotate-y-180">
            {/* Front Side: Skill Logo */}
            <div className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center backface-hidden p-1.5 sm:p-2">
              <SkillIcon name={skill.name} />
            </div>

            {/* Back Side: Skill Logo */}
            <div className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center backface-hidden rotate-y-180 p-1.5 sm:p-2">
              <SkillIcon name={skill.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Skill Name */}
      <span className="text-sm sm:text-sm md:text-md font-semibold text-neutral-300 mt-2 sm:mt-3 group-hover:text-white transition-colors duration-200 text-center truncate max-w-full">
        {skill.name}
      </span>
    </div>
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
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="loader"></div>
      </div>
    );
  }

  const hasSkills = Object.keys(groupedSkills).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 z-10 relative">

      <h1 className="text-3xl font-extrabold text-center mb-13 tracking-wide gradient-text text-glow animate-fade-in-up">
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
              <h2 className="text-2xl font-bold text-accent-blue border-b border-border-glass pb-2.5 text-glow animate-fade-in-up">
                {category}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 justify-items-center">
                {items.map((skill, index) => (
                  <SkillCard key={skill._id} skill={skill} index={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills;
