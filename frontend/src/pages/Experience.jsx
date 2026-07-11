import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Pages.css';

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
    return <div className="page-loader">Loading Work History...</div>;
  }

  return (
    <div className="container">
      <h1 className="section-title gradient-text text-glow">Professional Journey</h1>
      
      {experiences.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          No experience items found. Add some in the Admin Panel!
        </div>
      ) : (
        <div className="timeline">
          {experiences.map((exp, index) => (
            <div 
              key={exp._id} 
              className={`timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}
            >
              <div className="timeline-content glass-panel">
                <div className="timeline-date">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
                <h3 className="timeline-role">{exp.role}</h3>
                <h4 className="timeline-company">{exp.company} {exp.location && `| ${exp.location}`}</h4>
                <ul className="timeline-bullets">
                  {exp.description.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="project-tech-tags" style={{ marginTop: '15px' }}>
                    {exp.technologies.map((tech, tIdx) => (
                      <span key={tIdx} className="tech-tag">{tech}</span>
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
