import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Eye, FileText } from 'lucide-react';

const FadeInCard = ({ children, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px' // triggers slightly before entering the screen for smooth flow
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

  // Stagger animation delay on load (based on column count)
  const delay = (index % 4) * 60;

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] transform-gpu will-change-transform ${isVisible
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-6 scale-[0.99]'
        }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
};

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await api.get('/certifications');
        setCertifications(res.data);
      } catch (err) {
        console.error('Error fetching certifications:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-16 z-10 relative">
      <h1 className="text-3xl font-extrabold text-center mb-13 tracking-wide gradient-text text-glow animate-fade-in-up">
        Certifications
      </h1>

      {certifications.length === 0 ? (
        <div className="glass-panel p-10 text-center text-text-secondary">
          No certifications yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15">
          {certifications.map((cert, index) => {
            const fileUrl = cert.file?.url;
            const isPdf = fileUrl?.endsWith('.pdf') || fileUrl?.includes('/raw/');

            // Generate thumbnail URL: if PDF, replace .pdf with .jpg for Cloudinary preview
            const thumbnailUrl = fileUrl
              ? (isPdf ? fileUrl.replace(/\.pdf$/, '.jpg') : fileUrl)
              : '';

            return (
              <FadeInCard key={cert._id} index={index}>
                <article
                  className="glass-panel relative overflow-hidden group aspect-[4/3] flex flex-col justify-end w-full h-full min-h-[260px] rounded-lg"
                >
                  {/* Background Thumbnail Image */}
                  {thumbnailUrl && !imageErrors[cert._id] ? (
                    <img
                      src={thumbnailUrl}
                      alt={cert.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={() => handleImageError(cert._id)}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#080c1e] flex flex-col items-center justify-center gap-2">
                      <FileText className="w-12 h-12 text-neutral-500 opacity-40 mb-1" />
                      <span className="text-sm text-text-secondary opacity-50">Certificate</span>
                    </div>
                  )}

                  {/* Dark Opacity Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/35 z-10" />

                  {/* Content Overlay */}
                  <div className="relative z-20 p-6 flex flex-col justify-end h-full">
                    <h3 className="text-xl font-bold text-white mb-1.5 line-clamp-2 drop-shadow-md">
                      {cert.name}
                    </h3>
                    <h4 className="text-sm font-semibold text-accent-purple mb-0.5 drop-shadow-sm">
                      {cert.issuingOrganization}
                    </h4>
                    <div className="text-xs text-text-secondary mb-4 drop-shadow-sm">
                      Issued: {formatDate(cert.issueDate)}
                    </div>

                    {fileUrl && (
                      <div className="mt-1">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-button px-4 py-1.5 text-[0.85rem] inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              </FadeInCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Certifications;
