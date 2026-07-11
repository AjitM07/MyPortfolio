import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo gradient-text text-glow" onClick={() => setIsOpen(false)}>
          AJIT
        </Link>

        <button className={`navbar-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/experience" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            Experience
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            Projects
          </NavLink>
          <NavLink to="/skills" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            Skills
          </NavLink>
          <NavLink to="/certifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            Certifications
          </NavLink>
          <NavLink to="/blogs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            Blogs
          </NavLink>
          <NavLink to="/resume" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            Resume
          </NavLink>

          {admin ? (
            <>
              <NavLink to="/admin" className={({ isActive }) => `nav-item admin-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                Dashboard
              </NavLink>
              <button className="nav-item logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-item admin-lock" aria-label="Admin Login" onClick={() => setIsOpen(false)}>
              🔐
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
