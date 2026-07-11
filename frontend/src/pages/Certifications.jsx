import { useState, useEffect } from 'react';
import api from '../utils/api';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-5xl mx-auto px-4 py-16 z-10 relative">
      <h1 className="text-4xl font-extrabold text-center mb-16 tracking-wide gradient-text text-glow">
        Certifications
      </h1>

      {certifications.length === 0 ? (
        <div className="glass-panel p-10 text-center text-text-secondary">
          No certifications uploaded yet. Manage them via the Admin Dashboard!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert) => {
            const isPdf = cert.file?.url?.endsWith('.pdf') || cert.file?.url?.includes('/raw/');
            return (
              <article key={cert._id} className="glass-panel flex flex-col overflow-hidden h-full">
                <div className="w-full h-44 border-b border-border-glass overflow-hidden relative bg-[#080c1e] flex justify-center items-center">
                  {cert.file?.url ? (
                    isPdf ? (
                      <div className="flex flex-col items-center gap-2.5 text-accent-blue font-medium">
                        <span className="text-5xl">📄</span>
                        <span>PDF Certificate Document</span>
                      </div>
                    ) : (
                      <img src={cert.file.url} alt={cert.name} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="flex flex-col items-center gap-2.5 text-accent-blue font-medium">
                      <span className="text-4xl">🎓</span>
                      <span>No Document Uploaded</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white mb-2">{cert.name}</h3>
                  <h4 className="text-sm font-semibold text-accent-purple mb-1">{cert.issuingOrganization}</h4>
                  <div className="text-xs text-text-secondary mb-5">Issued: {formatDate(cert.issueDate)}</div>
                  <div className="flex gap-2.5 mt-auto">
                    {cert.file?.url && (
                      <a
                        href={cert.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button px-4 py-1.5 text-[0.85rem]"
                      >
                        View Doc
                      </a>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button active px-4 py-1.5 text-[0.85rem]"
                      >
                        Verify Credential
                      </a>
                    )}
                  </div>
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
