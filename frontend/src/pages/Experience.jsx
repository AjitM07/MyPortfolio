import { useState, useEffect } from 'react';
import api from '../utils/api';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await api.get('/experiences');
        setExperiences(res.data);
      } catch (err) {
        console.error('Error fetching experiences:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-height-[80vh] text-2xl font-semibold text-accent-blue text-glow">
        Loading Work History...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 z-10 relative">
      <h1 className="text-4xl font-extrabold text-center mb-16 tracking-wide gradient-text text-glow">
        Professional Journey
      </h1>

      {experiences.length === 0 ? (
        <div className="glass-panel p-10 text-center text-text-secondary">
          No experience items found. Add some in the Admin Panel!
        </div>
      ) : (
        <div className="relative max-w-7xl mx-auto py-8 after:content-[''] after:absolute after:w-[2px] after:bg-gradient-to-b after:from-accent-blue after:to-accent-purple after:via-transparent after:top-0 after:bottom-0 after:left-[31px] md:after:left-1/2 after:-translate-x-1/2">
          {experiences.map((exp, index) => (
            <div
              key={exp._id}
              className="relative w-full flex flex-col md:flex-row my-8 pl-16 md:pl-0"
            >
              {/* Timeline Bullet Dot */}
              <div className="absolute w-4 h-4 bg-bg-primary border-3 border-accent-blue rounded-full z-10 shadow-[0_0_10px_rgba(0,240,255,0.6)] top-[30px] left-[23px] md:left-1/2 md:-translate-x-1/2"></div>

              {/* Timeline Content Card */}
              <div className={`w-full md:w-[45%] glass-panel p-8 relative ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                <div className="text-sm font-semibold text-accent-blue mb-2">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                <h4 className="text-base font-semibold text-accent-purple mb-4">
                  {exp.company} {exp.location && `| ${exp.location}`}
                </h4>
                <ul className="list-none flex flex-col gap-2 mb-5">
                  {exp.description.map((bullet, bIdx) => (
                    <li key={bIdx} className="relative pl-5 text-text-secondary text-sm after:content-['✦'] after:absolute after:left-0 after:text-accent-blue after:text-xs after:top-0">
                      {bullet}
                    </li>
                  ))}
                </ul>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-4">
                    {exp.technologies.map((tech, tIdx) => (
                      <span key={tIdx} className="text-xs font-semibold text-accent-blue bg-accent-blue/8 border border-accent-blue/15 px-3 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
