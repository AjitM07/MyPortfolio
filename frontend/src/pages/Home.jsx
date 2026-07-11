import { useState, useEffect } from 'react';
import api from '../utils/api';

const Home = () => {
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
      <div className="flex justify-center items-center min-h-[80vh] text-lg font-medium text-[#6b7280] tracking-widest uppercase">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-160px)] max-h-[calc(100vh-160px)] overflow-hidden flex flex-col md:flex-row justify-center items-center md:items-end gap-5 md:gap-12 z-10 relative">

      {/* Left Column: Portrait Image sticking to bottom */}
      <div className="relative flex-shrink-0 flex items-end justify-center h-[45vh] md:h-full max-h-[70vh] md:max-h-[calc(100vh-160px)] self-end md:-translate-x-15">
        {profile?.aboutImage?.url ? (
          <img
            src={profile.aboutImage.url}
            alt={profile.name || "Ajit Mangsulikar"}
            className="h-full w-auto object-contain object-bottom drop-shadow-[0_0_30px_rgba(220,172,126,0.18)] block"
          />
        ) : (
          <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] relative flex flex-col items-center justify-center text-text-secondary text-center p-8">
            <span className="italic text-sm">Upload portrait photo in dashboard</span>
          </div>
        )}
      </div>

      {/* Right Column: Hero Text Content centered vertically on desktop */}
      <div className="flex flex-col items-start gap-4 text-left max-w-xl md:my-auto pb-12 md:pb-0 md:-translate-x-40">
        <div className="font-sans text-sm tracking-[0.25em] uppercase text-[#6b7280] font-medium">
          Hello! I am
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-black uppercase tracking-[-0.02em] text-white leading-none">
          {profile?.name || 'AJIT MANGSULIKAR'}
        </h1>

        <p className="text-xl sm:text-2xl md:text-2xl text-[#6b7280] font-light tracking-wide">
          {profile?.title || 'SY Computer Science Engineering Undergraduate'}
        </p>

        {profile?.resumeUrl?.url ? (
          <a
            href="/api/profile/download-resume"
            className="mt-4 cursor-none inline-flex items-center gap-2 border border-white/15 text-[#e8e3d9] text-base font-medium tracking-wide hover:bg-white/5 hover:border-white/30 hover:text-white transition-all duration-200 rounded py-3 px-7"
          >
            Download Resume
          </a>
        ) : (
          <button
            className="mt-4 cursor-none inline-flex items-center gap-2 border border-white/10 text-[#4b5563] text-base font-medium tracking-wide rounded py-3 px-7"
            onClick={() => alert('Resume PDF has not been uploaded yet. Please upload it in the Admin Dashboard under the Profile tab.')}
          >
            Download Resume
          </button>
        )}

        {/* Social Icons Row */}
        <div className="flex items-center gap-7 mt-5">
          <a
            href={profile?.socialLinks?.linkedin || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4b5563] hover:text-[#e8e3d9] hover:scale-105 transition-all duration-200 cursor-none"
            aria-label="LinkedIn"
            onClick={(e) => {
              if (!profile?.socialLinks?.linkedin) {
                e.preventDefault();
                alert('LinkedIn link has not been configured yet. Please set it in the Admin Dashboard.');
              }
            }}
          >
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>

          <a
            href={profile?.socialLinks?.github || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4b5563] hover:text-[#e8e3d9] hover:scale-105 transition-all duration-200 cursor-none"
            aria-label="GitHub"
            onClick={(e) => {
              if (!profile?.socialLinks?.github) {
                e.preventDefault();
                alert('GitHub link has not been configured yet. Please set it in the Admin Dashboard.');
              }
            }}
          >
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          <a
            href={profile?.socialLinks?.instagram || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4b5563] hover:text-[#e8e3d9] hover:scale-105 transition-all duration-200 cursor-none"
            aria-label="Instagram"
            onClick={(e) => {
              if (!profile?.socialLinks?.instagram) {
                e.preventDefault();
                alert('Instagram link has not been configured yet. Please set it in the Admin Dashboard.');
              }
            }}
          >
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          <a
            href={profile?.socialLinks?.email ? `mailto:${profile.socialLinks.email}` : '#'}
            className="text-[#4b5563] hover:text-[#e8e3d9] hover:scale-105 transition-all duration-200 cursor-none"
            aria-label="Email"
            onClick={(e) => {
              if (!profile?.socialLinks?.email) {
                e.preventDefault();
                alert('Email address has not been configured yet. Please set it in the Admin Dashboard.');
              }
            }}
          >
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 4.437v-8.829l4.623 4.392zm1.377.925l3.5-3.328 3.5 3.328-3.5 3.328-3.5-3.328zm7.377-.925l4.623-4.392v8.829l-4.623-4.437zm-7.923-2.074l-4.454-4.237h17.954l-4.454 4.237-4.522-4.296-4.524 4.296zm14.546 11.245h-17.954l4.454-4.237 4.522 4.296 4.524-4.296 4.454 4.237z" />
            </svg>
          </a>
        </div>
      </div>

    </div>
  );
};

export default Home;
