import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Pages.css';

const Resume = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="page-loader">Loading Resume...</div>;
  }

  const resumeUrl = profile?.resumeUrl?.url;

  return (
    <div className="container">
      <h1 className="section-title gradient-text text-glow">My Resume</h1>

      <div className="resume-container">
        {resumeUrl ? (
          <>
            <div className="social-links-row" style={{ marginBottom: '10px' }}>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button active"
                download
              >
                📥 Download PDF Resume
              </a>
            </div>

            <div className="resume-viewer-card glass-panel">
              <iframe
                src={`${resumeUrl}#toolbar=0`}
                title="Resume PDF Viewer"
                className="resume-iframe"
              ></iframe>
            </div>
          </>
        ) : (
          <div className="resume-fallback glass-panel">
            <span style={{ fontSize: '3rem' }}>📄</span>
            <h3>No Resume PDF Uploaded Yet</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Please upload your resume PDF in the Admin Dashboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
