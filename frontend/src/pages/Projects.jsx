import { useState, useEffect } from 'react';
import api from '../utils/api';

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
    return (
      <div className="flex justify-center items-center min-height-[80vh] text-2xl font-semibold text-accent-blue text-glow">
        Loading Projects...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 z-10 relative">
      <h1 className="text-4xl font-extrabold text-center mb-16 tracking-wide gradient-text text-glow">
        My Projects
      </h1>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
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
        <div className="glass-panel p-10 text-center text-text-secondary">
          No projects found in this category. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <article key={project._id} className="project-card glass-panel flex flex-col overflow-hidden h-full">
              <div className="w-full h-48 border-b border-border-glass overflow-hidden relative">
                {project.image?.url ? (
                  <img src={project.image.url} alt={project.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex justify-center items-center text-center p-5 text-text-secondary">
                    <span className="italic text-sm">No Screenshot Available</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-text-secondary text-sm mb-5 flex-grow leading-relaxed">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-5">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="text-xs font-semibold text-accent-blue bg-accent-blue/8 border border-accent-blue/15 px-2.5 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-auto">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-button px-4 py-1.5 text-[0.85rem]"
                    >
                      Code
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-button active px-4 py-1.5 text-[0.85rem]"
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
