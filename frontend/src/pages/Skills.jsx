import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Pages.css';

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
    return <div className="page-loader">Loading Skills...</div>;
  }

  const hasSkills = Object.keys(groupedSkills).length > 0;

  return (
    <div className="container">
      <h1 className="section-title gradient-text text-glow">My Skillset</h1>

      {!hasSkills ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          No skills registered yet. Populate them in the Admin Dashboard!
        </div>
      ) : (
        <div className="skills-wrapper">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <section key={category} className="skills-category-section">
              <h2 className="skills-category-title text-glow">{category}</h2>
              <div className="skills-grid">
                {items.map((skill) => (
                  <div key={skill._id} className="skill-card glass-panel">
                    <div className="skill-icon-container">
                      {skill.icon?.url ? (
                        <img src={skill.icon.url} alt={skill.name} className="skill-icon" />
                      ) : (
                        <span className="skill-icon-placeholder">⚙️</span>
                      )}
                    </div>
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-progress-bar">
                      <div 
                        className="skill-progress-fill" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.8rem', 
                        color: 'var(--color-accent-blue)', 
                        marginTop: '8px', 
                        fontWeight: '600' 
                      }}
                    >
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
