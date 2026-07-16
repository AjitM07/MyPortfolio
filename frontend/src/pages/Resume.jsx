import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Download, ExternalLink, FileText } from 'lucide-react';

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
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="loader"></div>
      </div>
    );
  }

  const resumeUrl = profile?.resumeUrl?.url;

  return (
    <div className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] mx-auto px-2 sm:px-4 py-8 sm:py-12 z-10 relative flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-center mb-12 tracking-wide gradient-text text-glow">
        My Resume
      </h1>

      <div className="w-full flex flex-col items-center gap-6">
        {resumeUrl ? (
          <>
            {/* Scrollable PDF Document Container with styled scrollbar */}
            <div className="w-full lg:w-[75vw] max-w-[1250px] mx-auto h-auto lg:h-[75vh] lg:min-h-[600px] overflow-y-auto custom-scrollbar glass-panel relative border border-border-glass bg-bg-card/50 shadow-2xl rounded-lg">
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
                <Download className="w-4 h-4 text-accent" />
                <span>Download PDF</span>
              </a>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button px-6 py-2.5 text-sm font-semibold cursor-none flex items-center gap-2 transition-all duration-200"
              >
                <ExternalLink className="w-4 h-4 text-accent" />
                <span>Open in New Tab</span>
              </a>
            </div>
          </>
        ) : (
          <div className="w-full max-w-4xl p-16 text-center flex flex-col items-center gap-5 glass-panel">
            <FileText className="w-16 h-16 text-neutral-500 mb-2" />
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
