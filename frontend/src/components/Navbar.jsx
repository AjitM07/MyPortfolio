import { useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Lock, LogOut, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const clickCountRef = useRef(0);
  const timerRef = useRef(null);

  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current >= 4) {
      navigate('/login');
      clickCountRef.current = 0;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1200);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setIsOpen(false);
  };

  const navItemClass = ({ isActive }) =>
    `text-[0.9rem] font-medium tracking-wide transition-colors duration-200 relative py-1 px-0 cursor-none ` +
    `after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-px after:transition-all after:duration-200 ` +
    (isActive
      ? 'text-white after:w-full after:bg-white'
      : 'text-[#6b7280] hover:text-[#d1cdc7] after:w-0 hover:after:w-full after:bg-[#d1cdc7]');

  return (
    <nav className="sticky top-0 left-0 w-full z-50 px-4 sm:px-6 py-3.5 sm:py-4 bg-bg-primary/70 backdrop-blur-md border-b border-border-subtle max-w-full">
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full gap-4">
        {/* Left: Logo (4 quick clicks uncovers secret admin access) */}
        <Link
          to="/"
          className="text-sm sm:text-base font-semibold tracking-wider sm:tracking-[0.15em] text-[#e8e3d9] hover:text-white transition-colors duration-200 cursor-none shrink-0 select-none"
          onClick={() => {
            handleLogoClick();
            setIsOpen(false);
          }}
        >
          &lt; AJIT's Portfolio /&gt;
        </Link>

        {/* Middle/Right: Navigation Tabs (Desktop only - centered when admin is logged in) */}
        <div
          className={`hidden md:flex items-center gap-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${admin
              ? 'justify-center flex-grow'
              : 'justify-end flex-grow'
            }`}
        >
          <NavLink to="/" end className={navItemClass}>
            Home
          </NavLink>
          <NavLink to="/resume" className={navItemClass}>
            Resume
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
          <NavLink to="/contact" className={navItemClass}>
            Contact
          </NavLink>
        </div>

        {/* Right: Admin controls (Only visible when logged in) */}
        {admin && (
          <div className="hidden md:flex items-center justify-end gap-4 shrink-0 animate-fade-in transition-all duration-500">
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
          </div>
        )}

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

        {/* Mobile Navigation Drawer Backdrop Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Navigation Drawer */}
        <div className={`fixed top-0 right-0 h-screen w-70 bg-bg-primary/95 backdrop-blur-2xl border-l border-border-glass flex flex-col justify-start gap-6 p-8 pt-20 transition-transform duration-300 z-40 md:hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] ${isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}>
          {/* Navigation Links */}
          <div className="flex flex-col gap-6">
            {[
              { name: 'Home', path: '/' },
              { name: 'Resume', path: '/resume' },
              { name: 'Experience', path: '/experience' },
              { name: 'Projects', path: '/projects' },
              { name: 'Skills', path: '/skills' },
              { name: 'Certifications', path: '/certifications' },
              { name: 'Blogs', path: '/blogs' },
              { name: 'Contact', path: '/contact' }
            ].map((item, idx) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `text-lg font-medium tracking-wide transition-all duration-200 flex items-center gap-3 cursor-none ` +
                  (isActive ? 'text-white pl-2 border-l-2 border-accent' : 'text-[#6b7280] hover:text-white')
                }
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="h-px bg-white/5 w-full my-2" />

          {/* Mobile Admin Controls (Only visible when logged in) */}
          {admin && (
            <div className="flex flex-col gap-4 mt-auto mb-8">
              <div className="flex flex-col gap-3 w-full">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-4 rounded-xl border border-white/10 text-white transition-all cursor-none ${isActive ? 'bg-white/5 border-white/20' : 'hover:bg-white/5'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold">Admin Dashboard</span>
                </NavLink>
                <button
                  className="flex items-center gap-3 py-3 px-4 rounded-xl border border-white/10 text-[#6b7280] hover:text-white transition-all cursor-none w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 text-accent-pink" />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
