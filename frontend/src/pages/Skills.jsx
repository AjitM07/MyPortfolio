import { useState, useEffect } from 'react';
import api from '../utils/api';

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
  const categories = ['Frontend', 'Backend', 'Database', 'Tools & Technologies', 'Others'];
  
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
    <div className="max-w-5xl mx-auto px-4 py-16 z-10 relative">
      <h1 className="text-4xl font-extrabold text-center mb-16 tracking-wide gradient-text text-glow">
        My Skillset
      </h1>

      {!hasSkills ? (
        <div className="glass-panel p-10 text-center text-text-secondary">
          No skills registered yet. Populate them in the Admin Dashboard!
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <section key={category} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-accent-blue border-b border-border-glass pb-2.5 text-glow">
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {items.map((skill) => (
                  <div key={skill._id} className="glass-panel p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden mb-4 flex justify-center items-center bg-white/2 border border-border-glass">
                      {skill.icon?.url ? (
                        <img src={skill.icon.url} alt={skill.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl text-text-secondary">⚙️</span>
                      )}
                    </div>
                    <span className="text-base font-semibold mb-3">{skill.name}</span>
                    
                    {/* HTML5 Progress element styled with Tailwind v4 utilities */}
                    <progress 
                      value={skill.level} 
                      max="100" 
                      className="w-full h-1.5 rounded-full overflow-hidden [&::-webkit-progress-bar]:bg-white/5 [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-accent-blue [&::-webkit-progress-value]:to-accent-purple [&::-moz-progress-bar]:bg-accent-blue"
                    />
                    
                    <span className="text-xs text-accent-blue mt-2 font-semibold">
                      {skill.level}%
                    </span>
                  </div>
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
