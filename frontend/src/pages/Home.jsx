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
      <div className="flex justify-center items-center min-height-[80vh] text-2xl font-semibold text-accent-blue text-glow">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 z-10 relative">
      {/* Hero Section */}
      <header className="glass-panel p-10 md:p-20 text-center mb-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
            Hi, I'm <span className="gradient-text text-glow">{profile?.name || 'Ajit Mangsulikar'}</span>
          </h1>
          <h2 className="text-xl md:text-3xl font-semibold text-text-secondary mb-6 text-glow">
            {profile?.title || 'Full Stack Developer'}
          </h2>
          <p className="max-w-2xl text-text-secondary text-base md:text-lg mb-10">
            Welcome to my creative space. I build elegant, functional, and highly optimized web experiences.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {profile?.socialLinks?.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="glass-button">
                GitHub
              </a>
            )}
            {profile?.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="glass-button">
                LinkedIn
              </a>
            )}
            {profile?.socialLinks?.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="glass-button">
                Twitter
              </a>
            )}
            {profile?.socialLinks?.email && (
              <a href={`mailto:${profile.socialLinks.email}`} className="glass-button">
                Email Me
              </a>
            )}
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="glass-panel p-8 md:p-12 mt-8">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <div className="w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-2xl overflow-hidden border border-border-glass shadow-2xl flex-shrink-0 relative">
            {profile?.aboutImage?.url ? (
              <img src={profile.aboutImage.url} alt="About Me" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/5 flex justify-center items-center text-center p-5 text-text-secondary">
                <span className="italic text-sm">Upload photo in admin panel</span>
              </div>
            )}
          </div>
          <div className="flex-1 max-[900px]:text-center">
            <h3 className="text-3xl font-bold mb-5 gradient-text">About Me</h3>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed whitespace-pre-line">
              {profile?.bio || 'Bio details will appear here. Modify in the Admin dashboard.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
