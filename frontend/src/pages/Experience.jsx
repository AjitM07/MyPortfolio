import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const TimelineItem = ({ exp, index, formatDate }) => {
  const itemRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = itemRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className={`relative w-full flex flex-col md:flex-row my-8 pl-16 md:pl-0 transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Timeline Bullet Dot */}
      <div
        className={`absolute w-5 h-5 bg-bg-primary rounded-full z-10 top-[30px] left-[23px] md:left-1/2 md:-translate-x-1/2 border-[3px] transition-all duration-500 ${
          isVisible
            ? 'border-accent shadow-[0_0_12px_rgba(232,227,217,0.8)] scale-110'
            : 'border-border-medium scale-90'
        }`}
      ></div>

      {/* Timeline Content Card */}
      <div
        className={`w-full md:w-[45%] glass-panel p-8 relative transition-all duration-500 ${
          index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
        } ${isVisible ? 'border-border-medium' : 'border-border-subtle'}`}
      >
        <div className="text-md font-semibold text-accent mb-2 opacity-80">
          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{exp.role}</h3>
        <h4 className="text-md font-semibold text-accent mb-4">
          {exp.company} {exp.location && `| ${exp.location}`}
        </h4>
        <ul className="list-none flex flex-col gap-2 mb-5">
          {exp.description.map((bullet, bIdx) => (
            <li
              key={bIdx}
              className="relative pl-5 text-text-secondary text-md after:content-['✦'] after:absolute after:left-0 after:text-accent after:text-xs after:top-0"
            >
              {bullet}
            </li>
          ))}
        </ul>
        {exp.technologies && exp.technologies.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-4">
            {exp.technologies.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="text-sm font-semibold text-accent bg-accent/8 border border-accent/15 px-4 py-1.5 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const lineRef = useRef(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !lineRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // The line starts animating when the top of the container enters the middle/bottom of viewport
      // And completes when the bottom of the container reaches the same trigger point.
      const triggerPoint = windowHeight * 0.6; // 60% of viewport height from the top
      
      const totalHeight = rect.height;
      const scrolled = triggerPoint - rect.top;
      
      let progress = scrolled / totalHeight;
      progress = Math.max(0, Math.min(1, progress));

      lineRef.current.style.transform = `scaleY(${progress})`;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    // Trigger once on mount/load
    handleScroll();

    // Trigger after a tiny delay to ensure proper layout calculations
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, [experiences, loading]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-height-[80vh] text-2xl font-semibold text-accent text-glow">
        Loading Work History...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 z-10 relative">
      <h1 className="text-4xl font-extrabold text-center mb-16 tracking-wide gradient-text text-glow">
        Professional Journey
      </h1>

      {experiences.length === 0 ? (
        <div className="glass-panel p-10 text-center text-text-secondary">
          No experience items found.
        </div>
      ) : (
        <div ref={containerRef} className="relative max-w-7xl mx-auto py-8">
          {/* Timeline Background Track Line */}
          <div className="absolute w-[2px] bg-border-subtle top-0 bottom-0 left-[31px] md:left-1/2 -translate-x-1/2 pointer-events-none"></div>

          {/* Timeline Active Scroll Progress Line */}
          <div
            ref={lineRef}
            className="absolute w-[2px] bg-gradient-to-b from-accent to-accent-dim top-0 bottom-0 left-[31px] md:left-1/2 -translate-x-1/2 origin-top pointer-events-none transition-transform duration-100 ease-out"
            style={{ transform: 'scaleY(0)' }}
          ></div>

          {experiences.map((exp, index) => (
            <TimelineItem
              key={exp._id}
              exp={exp}
              index={index}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
