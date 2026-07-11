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
    `text-[0.9rem] font-medium tracking-wide transition-colors duration-200 relative py-1 px-0 cursor-none ` +
    `after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-px after:transition-all after:duration-200 ` +
    (isActive
      ? 'text-white after:w-full after:bg-white'
      : 'text-[#6b7280] hover:text-[#d1cdc7] after:w-0 hover:after:w-full after:bg-[#d1cdc7]');

  return (
    <nav className="sticky top-0 left-0 w-full z-50 px-[5%] py-5 bg-transparent">
      <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
        <Link to="/" className="text-base font-semibold tracking-[0.15em] text-[#e8e3d9] hover:text-white transition-colors duration-200 cursor-none" onClick={() => setIsOpen(false)}>
          &lt; AJIT's Portfolio / &gt;
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
              <NavLink to="/admin" className={({ isActive }) => `text-[0.9rem] font-medium py-1.5 px-4 border border-white/10 rounded text-[#c8c3bb] hover:text-white hover:border-white/25 transition-colors duration-200 cursor-none ${isActive ? 'text-white border-white/25' : ''}`} onClick={() => setIsOpen(false)}>
                Dashboard
              </NavLink>
              <button className="text-[0.9rem] font-medium py-1.5 px-4 border border-white/10 rounded text-[#6b7280] hover:text-white hover:border-white/25 transition-colors duration-200 cursor-none" onClick={handleLogout}>
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
