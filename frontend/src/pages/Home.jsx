import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Pages.css';

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
    return <div className="page-loader">Loading Profile...</div>;
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <header className="hero-section glass-panel">
        <div className="hero-content">
          <h1 className="hero-title">
            Hi, I'm <span className="gradient-text text-glow">{profile?.name || 'Ajit Mangsulikar'}</span>
          </h1>
          <h2 className="hero-subtitle text-glow">{profile?.title || 'Full Stack Developer'}</h2>
          <p className="hero-desc">
            Welcome to my creative space. I build elegant, functional, and highly optimized web experiences.
          </p>
          <div className="social-links-row">
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
      <section className="about-section glass-panel">
        <div className="about-container">
          <div className="about-image-wrapper">
            {profile?.aboutImage?.url ? (
              <img src={profile.aboutImage.url} alt="About Me" className="about-image" />
            ) : (
              <div className="about-image-placeholder">
                <span className="placeholder-text">Upload photo in admin panel</span>
              </div>
            )}
          </div>
          <div className="about-content">
            <h3 className="about-heading gradient-text">About Me</h3>
            <p className="about-bio">{profile?.bio || 'Bio details will appear here. Modify in the Admin dashboard.'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
