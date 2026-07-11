import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Ajit Mangsulikar. Built with MERN & Cloudinary.</p>
        <div className="footer-links">
          <a href="https://github.com/AjitM07" target="_blank" rel="noopener noreferrer" className="footer-link">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
