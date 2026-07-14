import { useState, useEffect } from 'react';
import api from '../utils/api';

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
      <div className="flex justify-center items-center min-height-[80vh] text-2xl font-semibold text-accent-blue text-glow">
        Loading Certifications...
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-16 z-10 relative">
      <h1 className="text-4xl font-extrabold text-center mb-16 tracking-wide gradient-text text-glow">
        Certifications
      </h1>

      {certifications.length === 0 ? (
        <div className="glass-panel p-10 text-center text-text-secondary">
          No certifications uploaded yet. Manage them via the Admin Dashboard!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15">
          {certifications.map((cert) => {
            const fileUrl = cert.file?.url;
            const isPdf = fileUrl?.endsWith('.pdf') || fileUrl?.includes('/raw/');

            // Generate thumbnail URL: if PDF, replace .pdf with .jpg for Cloudinary preview
            const thumbnailUrl = fileUrl
              ? (isPdf ? fileUrl.replace(/\.pdf$/, '.jpg') : fileUrl)
              : '';

            return (
              <article
                key={cert._id}
                className="glass-panel relative overflow-hidden group aspect-[4/3] flex flex-col justify-end w-full h-full min-h-[260px]"
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
                    <span className="text-5xl opacity-30">📄</span>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        View
                      </a>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Certifications;
