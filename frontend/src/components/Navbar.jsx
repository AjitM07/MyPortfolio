import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navItemClass = ({ isActive }) => 
    `text-base font-medium transition-all duration-300 relative py-2 px-3 cursor-none ` +
    `after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-accent-blue after:shadow-[0_0_8px_var(--color-accent-blue)] after:transition-all after:duration-300 ` +
    (isActive 
      ? 'text-accent-blue text-glow after:w-3/5' 
      : 'text-text-secondary hover:text-text-primary hover:text-glow after:w-0 hover:after:w-3/5');

  return (
    <nav className="sticky top-0 left-0 w-full z-50 px-[5%] py-4 glass-panel rounded-b-2xl border-t-0 border-l-0 border-r-0 shadow-lg border-b border-border-glass backdrop-blur-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
        <Link to="/" className="text-2xl font-extrabold tracking-widest gradient-text text-glow cursor-none" onClick={() => setIsOpen(false)}>
          AJIT
        </Link>

        {/* Hamburger Menu Toggle Button */}
        <button 
          className="flex flex-col justify-around w-6 h-5 bg-transparent border-none cursor-none p-0 z-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`w-6 h-[2px] bg-text-primary rounded-full transition-all duration-300 origin-[1px] ${isOpen ? 'rotate-45' : ''}`}></span>
          <span className={`w-6 h-[2px] bg-text-primary rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 translate-x-5' : ''}`}></span>
          <span className={`w-6 h-[2px] bg-text-primary rounded-full transition-all duration-300 origin-[1px] ${isOpen ? '-rotate-45' : ''}`}></span>
        </button>

        {/* Navigation Items */}
        <div className={`fixed md:relative top-0 ${isOpen ? 'right-0' : 'right-[-100%]'} md:right-auto md:top-auto h-screen md:h-auto w-64 md:w-auto bg-bg-primary/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-l md:border-l-0 border-border-glass md:border-transparent flex flex-col md:flex-row items-center justify-center md:justify-end gap-8 md:gap-6 p-5 md:p-0 transition-all duration-300 z-40`}>
          <NavLink to="/" end className={navItemClass} onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/experience" className={navItemClass} onClick={() => setIsOpen(false)}>
            Experience
          </NavLink>
          <NavLink to="/projects" className={navItemClass} onClick={() => setIsOpen(false)}>
            Projects
          </NavLink>
          <NavLink to="/skills" className={navItemClass} onClick={() => setIsOpen(false)}>
            Skills
          </NavLink>
          <NavLink to="/certifications" className={navItemClass} onClick={() => setIsOpen(false)}>
            Certifications
          </NavLink>
          <NavLink to="/blogs" className={navItemClass} onClick={() => setIsOpen(false)}>
            Blogs
          </NavLink>
          <NavLink to="/resume" className={navItemClass} onClick={() => setIsOpen(false)}>
            Resume
          </NavLink>

          {admin ? (
            <>
              <NavLink to="/admin" className={({ isActive }) => `text-base font-medium py-2 px-4 border border-accent-purple/40 rounded-lg text-accent-purple hover:bg-accent-purple/10 hover:text-white hover:text-glow transition-all duration-300 cursor-none ${isActive ? 'bg-accent-purple/20 text-white' : ''}`} onClick={() => setIsOpen(false)}>
                Dashboard
              </NavLink>
              <button className="text-base font-medium py-2 px-4 border border-accent-pink/40 rounded-lg text-accent-pink hover:bg-accent-pink/10 hover:text-white hover:text-glow transition-all duration-300 cursor-none" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-lg opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-none" aria-label="Admin Login" onClick={() => setIsOpen(false)}>
              🔐
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
