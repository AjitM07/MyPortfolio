import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Lock, LogOut } from 'lucide-react';

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
    <nav className="sticky top-0 left-0 w-full z-50 px-6 py-4 bg-bg-primary/70 backdrop-blur-md border-b border-border-subtle">
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full gap-4">
        {/* Left: Logo */}
        <Link to="/" className="text-base font-semibold tracking-[0.15em] text-[#e8e3d9] hover:text-white transition-colors duration-200 cursor-none shrink-0" onClick={() => setIsOpen(false)}>
          &lt; AJIT's Portfolio / &gt;
        </Link>

        {/* Middle: Navigation Tabs (Desktop only) */}
        <div className="hidden md:flex items-center justify-center gap-6 flex-grow">
          <NavLink to="/" end className={navItemClass}>
            Home
          </NavLink>
          <NavLink to="/experience" className={navItemClass}>
            Experience
          </NavLink>
          <NavLink to="/projects" className={navItemClass}>
            Projects
          </NavLink>
          <NavLink to="/skills" className={navItemClass}>
            Skills
          </NavLink>
          <NavLink to="/certifications" className={navItemClass}>
            Certifications
          </NavLink>
          <NavLink to="/blogs" className={navItemClass}>
            Blogs
          </NavLink>
          <NavLink to="/resume" className={navItemClass}>
            Resume
          </NavLink>
        </div>

        {/* Right: Admin controls (Desktop only) */}
        <div className="hidden md:flex items-center justify-end gap-4 shrink-0">
          {admin ? (
            <>
              <NavLink 
                to="/admin" 
                className={({ isActive }) => `inline-flex items-center justify-center w-9 h-9 border border-white/10 rounded-lg text-[#c8c3bb] hover:text-white hover:border-white/25 transition-colors duration-200 cursor-none ${isActive ? 'text-white border-white/25 bg-white/5' : ''}`}
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-[18px] h-[18px]" />
              </NavLink>
              <button 
                className="inline-flex items-center justify-center w-9 h-9 border border-white/10 rounded-lg text-[#6b7280] hover:text-white hover:border-white/25 transition-colors duration-200 cursor-none"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center w-9 h-9 border border-white/10 rounded-lg text-[#6b7280] hover:text-white hover:border-white/25 transition-colors duration-200 cursor-none"
              title="Admin Login"
            >
              <Lock className="w-[18px] h-[18px]" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="flex flex-col justify-around w-6 h-5 bg-transparent border-none cursor-none p-0 z-50 md:hidden shrink-0"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`w-6 h-[2px] bg-text-primary rounded-full transition-all duration-300 origin-[1px] ${isOpen ? 'rotate-45' : ''}`}></span>
          <span className={`w-6 h-[2px] bg-text-primary rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 translate-x-5' : ''}`}></span>
          <span className={`w-6 h-[2px] bg-text-primary rounded-full transition-all duration-300 origin-[1px] ${isOpen ? '-rotate-45' : ''}`}></span>
        </button>

        {/* Mobile Navigation Drawer */}
        <div className={`fixed top-0 ${isOpen ? 'right-0' : 'right-[-100%]'} h-screen w-64 bg-bg-primary/98 backdrop-blur-xl border-l border-border-glass flex flex-col items-center justify-center gap-6 p-5 transition-all duration-300 z-40 md:hidden`}>
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

          <div className="h-px bg-white/10 w-full my-4" />

          {/* Mobile Admin Controls */}
          <div className="flex gap-4 items-center">
            {admin ? (
              <>
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => `inline-flex items-center justify-center w-11 h-11 border border-white/10 rounded-lg text-[#c8c3bb] hover:text-white hover:border-white/25 transition-colors duration-200 cursor-none ${isActive ? 'text-white border-white/25 bg-white/5' : ''}`}
                  onClick={() => setIsOpen(false)}
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-[20px] h-[20px]" />
                </NavLink>
                <button 
                  className="inline-flex items-center justify-center w-11 h-11 border border-white/10 rounded-lg text-[#6b7280] hover:text-white hover:border-white/25 transition-colors duration-200 cursor-none"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="w-[20px] h-[20px]" />
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-11 h-11 border border-white/10 rounded-lg text-[#6b7280] hover:text-white hover:border-white/25 transition-colors duration-200 cursor-none"
                onClick={() => setIsOpen(false)}
                title="Admin Login"
              >
                <Lock className="w-[20px] h-[20px]" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
