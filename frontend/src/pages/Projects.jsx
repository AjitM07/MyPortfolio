import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Code, Monitor, Globe, BookOpen } from 'lucide-react';

// Predefined list of extensions to try when fetching tech logos
const EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];

// TechBadge component with automatic extension cycling and error handling
const TechBadge = ({ tech }) => {
  const [extIndex, setExtIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  // Sanitize name: lowercase and remove spaces & special characters (e.g., "Tailwind CSS" -> "tailwindcss")
  const baseName = tech.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const imgPath = `/skills/${baseName}${EXTENSIONS[extIndex]}`;

  const handleImageError = () => {
    if (extIndex < EXTENSIONS.length - 1) {
      setExtIndex(extIndex + 1);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <div className="flex items-center gap-2.5 text-sm text-neutral-300 font-medium">
      {!imgFailed ? (
        <img
          src={imgPath}
          alt={tech}
          className="w-7 h-7 object-contain shrink-0"
          onError={handleImageError}
        />
      ) : (
        <Code className="w-7 h-7 text-neutral-400 shrink-0" />
      )}
      <span>{tech}</span>
    </div>
  );
};

const ProjectCard = ({ children, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
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

  // Stagger animation based on screen position grid columns (2 columns on large desktop)
  const delay = (index % 2) * 100;

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] transform-gpu will-change-transform ${isVisible
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-8 scale-[0.98]'
        }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
};

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
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 z-10 relative">
      <h1 className="text-3xl font-extrabold text-center mb-13 tracking-wide gradient-text text-glow animate-fade-in-up">
        My Projects
      </h1>

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="flex justify-center gap-4 mb-14 flex-wrap">
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
        <div className="glass-panel p-10 text-center text-text-secondary rounded-2xl">
          No projects found in this category. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project._id} index={index}>
              <article
                className="project-card glass-panel flex flex-col overflow-hidden h-full rounded-[24px] border border-white/5 hover:border-white/12 transition-all duration-300 hover:shadow-2xl group"
              >
                {/* Mockup Frame around the screenshot */}
                <div className="w-full bg-[#161616]/70 border-b border-white/5 flex justify-center items-center p-5 h-64 relative overflow-hidden shrink-0">
                  {project.image?.url ? (
                    <div className="w-full h-full rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.5)] border border-white/10 relative">
                      <img
                        src={project.image.url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col justify-center items-center text-center p-5 rounded-xl border border-white/5">
                      <Monitor className="w-8 h-8 text-neutral-600 mb-2" />
                      <span className="italic text-xs text-neutral-500 font-medium">Demo screenshot coming soon</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-7 sm:p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-1.5 tracking-tight hover:text-[#e8e3d9] transition-colors">
                    {project.title}
                  </h3>

                  <div className="text-sm font-semibold text-accent/80 tracking-wide mb-4">
                    {project.subtitle || project.category || 'Web Development'}
                  </div>

                  <p className="text-neutral-400 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies List with SVGs */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-x-5 gap-y-5 mb-8">
                      {project.technologies.map((tech, idx) => (
                        <TechBadge key={idx} tech={tech} />
                      ))}
                    </div>
                  )}

                  {/* Redesigned Side-by-Side Action Buttons */}
                  <div className="flex gap-4 mt-auto w-full flex-wrap sm:flex-nowrap">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2.5 bg-accent hover:bg-white text-bg-primary font-semibold text-sm px-4 py-2.5 rounded-lg transition-all duration-200 cursor-none shadow-md shadow-black/10 min-w-[110px]"
                      >
                        <Globe className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2.5 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-all duration-200 cursor-none min-w-[100px]"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {project.githubLink && (
                      <Link
                        to={`/projects/${project._id}/readme`}
                        className="flex-1 inline-flex items-center justify-center gap-2.5 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-all duration-200 cursor-none min-w-[110px]"
                      >
                        <BookOpen className="w-4 h-4" />
                        Know More
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            </ProjectCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
