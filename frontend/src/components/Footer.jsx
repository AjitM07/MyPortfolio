const Footer = () => {
  return (
    <footer className="w-full py-8 px-[5%] border-t border-border-glass bg-bg-primary/40 backdrop-blur-md mt-auto z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4 text-text-secondary text-sm max-[600px]:flex-col max-[600px]:text-center">
        <p>&copy; Ajit Mangsulikar | Developer Portfolio</p>
        <div className="flex gap-5">
          <a
            href="https://github.com/AjitM07"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-blue hover:text-glow transition-all duration-300 cursor-none"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
