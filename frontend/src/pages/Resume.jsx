import { useState, useEffect } from 'react';
import api from '../utils/api';

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
    return (
      <div className="flex justify-center items-center min-height-[80vh] text-2xl font-semibold text-accent-blue text-glow">
        Loading Resume...
      </div>
    );
  }

  const resumeUrl = profile?.resumeUrl?.url;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 z-10 relative">
      <h1 className="text-4xl font-extrabold text-center mb-16 tracking-wide gradient-text text-glow">
        My Resume
      </h1>

      <div className="flex flex-col items-center gap-8 max-w-3xl mx-auto">
        {resumeUrl ? (
          <>
            <div className="flex gap-4 justify-center flex-wrap mb-2">
              <a
                href="/api/profile/download-resume"
                className="glass-button active cursor-none"
              >
                📥 Download PDF Resume
              </a>
            </div>

            <div className="w-full h-[600px] overflow-hidden glass-panel">
              <iframe
                src={`${resumeUrl}#toolbar=0`}
                title="Resume PDF Viewer"
                className="w-full h-full border-none"
              ></iframe>
            </div>
          </>
        ) : (
          <div className="w-full p-16 text-center flex flex-col items-center gap-5 glass-panel">
            <span className="text-5xl">📄</span>
            <h3 className="text-xl font-bold">No Resume PDF Uploaded Yet</h3>
            <p className="text-text-secondary text-sm">
              Please upload your resume PDF in the Admin Dashboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
