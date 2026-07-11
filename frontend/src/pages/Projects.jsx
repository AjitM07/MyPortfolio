import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Pages.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);

        // Extract unique categories from projects list
        const uniqueCats = new Set(res.data.map((p) => p.category).filter(Boolean));
        setCategories(['All', ...Array.from(uniqueCats)]);
      } catch (err) {
        console.error('Error fetching projects:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter);

  if (loading) {
    return <div className="page-loader">Loading Projects...</div>;
  }

  return (
    <div className="container">
      <h1 className="section-title gradient-text text-glow">My Projects</h1>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="projects-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`glass-button ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          No projects found in this category. Check back later!
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article key={project._id} className="project-card glass-panel">
              <div className="project-image-container">
                {project.image?.url ? (
                  <img src={project.image.url} alt={project.title} className="project-img" />
                ) : (
                  <div className="about-image-placeholder">
                    <span className="placeholder-text">No Screenshot Available</span>
                  </div>
                )}
              </div>
              <div className="project-card-content">
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-tech-tags">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                )}
                <div className="project-links">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-button"
                      style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                    >
                      Code
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-button active"
                      style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
