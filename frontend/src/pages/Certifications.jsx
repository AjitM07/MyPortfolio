import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Pages.css';

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
    return <div className="page-loader">Loading Certifications...</div>;
  }

  return (
    <div className="container">
      <h1 className="section-title gradient-text text-glow">Certifications</h1>

      {certifications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          No certifications uploaded yet. Manage them via the Admin Dashboard!
        </div>
      ) : (
        <div className="certifications-grid">
          {certifications.map((cert) => {
            const isPdf = cert.file?.url?.endsWith('.pdf') || cert.file?.url?.includes('/raw/');
            return (
              <article key={cert._id} className="cert-card glass-panel">
                <div className="cert-image-container">
                  {cert.file?.url ? (
                    isPdf ? (
                      <div className="cert-pdf-placeholder">
                        <span style={{ fontSize: '3rem' }}>📄</span>
                        <span>PDF Certificate Document</span>
                      </div>
                    ) : (
                      <img src={cert.file.url} alt={cert.name} className="cert-img" />
                    )
                  ) : (
                    <div className="cert-pdf-placeholder">
                      <span style={{ fontSize: '2.5rem' }}>🎓</span>
                      <span>No Document Uploaded</span>
                    </div>
                  )}
                </div>
                <div className="cert-content">
                  <h3 className="cert-title">{cert.name}</h3>
                  <h4 className="cert-org">{cert.issuingOrganization}</h4>
                  <div className="cert-date">Issued: {formatDate(cert.issueDate)}</div>
                  <div className="cert-links">
                    {cert.file?.url && (
                      <a
                        href={cert.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button"
                        style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                      >
                        View Doc
                      </a>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button active"
                        style={{ padding: '6px 16px', fontSize: '0.85rem' }}
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
