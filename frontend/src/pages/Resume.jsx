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
    <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto px-4 py-12 z-10 relative flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-center mb-12 tracking-wide gradient-text text-glow">
        My Resume
      </h1>

      <div className="w-full flex flex-col items-center gap-6">
        {resumeUrl ? (
          <>
            {/* Scrollable PDF Document Container with styled scrollbar */}
            <div className="w-full lg:w-[75vw] max-w-[1250px] mx-auto h-[75vh] min-h-[600px] overflow-y-auto custom-scrollbar glass-panel relative border border-border-glass bg-bg-card/50 shadow-2xl rounded-lg">
              <object
                data={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitW`}
                type="application/pdf"
                className="w-full aspect-[1/1.24] block border-none"
              >
                <iframe
                  src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitW`}
                  title="Resume PDF Viewer"
                  className="w-full aspect-[1/1.24] block border-none"
                ></iframe>
              </object>
            </div>

            {/* Action Buttons below the resume */}
            <div className="flex gap-4 justify-center mt-4 w-full flex-wrap">
              <a
                href="/api/profile/download-resume"
                className="glass-button px-6 py-2.5 text-sm font-semibold cursor-none flex items-center gap-2 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Download PDF</span>
              </a>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button px-6 py-2.5 text-sm font-semibold cursor-none flex items-center gap-2 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                <span>Open in New Tab</span>
              </a>
            </div>
          </>
        ) : (
          <div className="w-full max-w-4xl p-16 text-center flex flex-col items-center gap-5 glass-panel">
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
