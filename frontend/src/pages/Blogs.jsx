import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import api from '../utils/api';

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const removeHashtags = (text) => {
  if (!text) return '';
  return text
    .replace(/#\w+/g, '') // removes alphanumeric hashtags like #React
    .replace(/[ \t]{2,}/g, ' ') // collapses multiple spaces and tabs into one
    .trim();
};

const BlogCardAnimation = ({ children, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px -50px 0px -50px' // Horizontal margins for horizontal scrolling detection
      }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  const delay = index * 100;

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] transform-gpu will-change-transform ${isVisible
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-8 scale-[0.98]'
        }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
};

const Blogs = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const [reachedIndices, setReachedIndices] = useState(new Set([0]));

  // Fetch blogs list or single blog depending on route parameter
  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        // Fetch profile to render LinkedIn Card details
        try {
          const profileRes = await api.get('/profile');
          setProfile(profileRes.data);
        } catch (pErr) {
          console.error('Error fetching profile for LinkedIn card:', pErr.message);
        }

        if (slug) {
          const res = await api.get(`/blogs/${slug}`);
          setCurrentBlog(res.data);
        } else {
          const res = await api.get('/blogs?status=published');
          setBlogs(res.data);
        }
      } catch (err) {
        console.error('Error fetching blog data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [slug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatMonthYear = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!container || !lineRef.current) return;
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      const cards = container.querySelectorAll('.timeline-item-container');
      if (cards.length === 0) return;

      const firstCard = cards[0];
      const lastCard = cards[cards.length - 1];

      // Dynamically calculate the center position of first & last dot relative to scroll container
      const firstDotPos = firstCard.offsetLeft + (firstCard.offsetWidth / 2);
      const lastDotPos = lastCard.offsetLeft + (lastCard.offsetWidth / 2);

      // ── Vertical alignment: read the actual rendered dot position from the DOM ──
      // This is cross-browser safe: offsetTop returns rendered px regardless of rem,
      // DPI scaling, or minimum font-size settings (the Chrome vs Brave difference).
      const firstDot = firstCard.querySelector('.timeline-dot');
      if (firstDot) {
        // offsetTop of dot relative to its card + card's offsetTop relative to container
        const dotCenterY = firstCard.offsetTop + firstDot.offsetTop + (firstDot.offsetHeight / 2);
        const lineTop = dotCenterY - 1; // -1 so the 2px line straddles the center (1px above + 1px below)

        lineRef.current.style.top = `${lineTop}px`;

        const bgTrack = container.querySelector('.timeline-bg-track');
        if (bgTrack) {
          bgTrack.style.top   = `${lineTop}px`;
          bgTrack.style.left  = `${firstDotPos}px`;
          bgTrack.style.width = `${Math.max(0, lastDotPos - firstDotPos)}px`;
        }
      }

      // Set active line horizontal start position
      lineRef.current.style.left = `${firstDotPos}px`;

      const lastCardRect = lastCard.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const isLastCardVisible = lastCardRect.right <= containerRect.right + 5;

      const triggerOffset = clientWidth * 0.4;
      const currentTriggerPos = scrollLeft + triggerOffset;

      let activeLineWidth = 0;
      let nextReached = new Set([0]);

      if (isLastCardVisible || (scrollWidth - clientWidth) <= 0) {
        activeLineWidth = lastDotPos - firstDotPos;
        cards.forEach((_, idx) => nextReached.add(idx));
      } else {
        const targetRightPos = Math.max(firstDotPos, Math.min(currentTriggerPos, lastDotPos));
        activeLineWidth = targetRightPos - firstDotPos;

        const triggerPoint = containerRect.left + triggerOffset;
        cards.forEach((card, idx) => {
          const rect = card.getBoundingClientRect();
          const dotCenter = rect.left + rect.width / 2;
          if (dotCenter <= triggerPoint) {
            nextReached.add(idx);
          }
        });
      }

      lineRef.current.style.width = `${Math.max(0, activeLineWidth)}px`;
      setReachedIndices(nextReached);
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // Initial triggers
    handleScroll();
    const timer = setTimeout(handleScroll, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, [blogs, loading, slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="loader"></div>
      </div>
    );
  }

  // Single Blog Post View
  if (slug && currentBlog) {
    return (
      <div className="w-full lg:w-[80vw] max-w-none mx-auto px-4 py-10">
        <div className="mb-8 text-left">
          <Link to="/blogs" className="glass-button inline-flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
        <article className="glass-panel p-6 sm:p-10 rounded-[24px]">
          <header className="mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 gradient-text text-glow leading-snug">
              {currentBlog.title}
            </h1>
            <div className="text-text-secondary text-sm">
              Published on {formatDate(currentBlog.publishedAt || currentBlog.createdAt)}
            </div>
          </header>

          {/* Unified 2-Column Grid: Images/Visual Left, Author & Content Right */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 mt-8 items-start">
            {/* Left Column: Image/Visual Stack and optional LinkedIn Button */}
            <div className="flex flex-col gap-6 w-full">
              {currentBlog.image?.url && (
                <div className="w-full h-64 sm:h-80 rounded-xl p-2 overflow-hidden border border-white/10 bg-black/10">
                  <img
                    src={currentBlog.image.url}
                    alt={`${currentBlog.title} - 1`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              {currentBlog.image2?.url && (
                <div className="w-full h-64 sm:h-80 rounded-xl  p-2 overflow-hidden border border-white/10 bg-black/10">
                  <img
                    src={currentBlog.image2.url}
                    alt={`${currentBlog.title} - 2`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              {currentBlog.image3?.url && (
                <div className="w-full h-64 sm:h-80 rounded-xl p-2 overflow-hidden border border-white/10 bg-black/10">
                  <img
                    src={currentBlog.image3.url}
                    alt={`${currentBlog.title} - 3`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              {!currentBlog.image?.url && !currentBlog.image2?.url && !currentBlog.image3?.url && (
                <div className="w-full h-64 bg-white/5 flex justify-center items-center text-center p-5 text-text-secondary relative overflow-hidden rounded-xl border border-white/10">
                  <span className="italic text-sm">No Images Available</span>
                </div>
              )}

              {/* LinkedIn Button (only if isLinkedIn or linkedInUrl is present) */}
              {currentBlog.isLinkedIn && currentBlog.linkedInUrl && (
                <div className="mt-2 flex justify-center">
                  <a
                    href={currentBlog.linkedInUrl.replace('/embed', '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button active inline-flex items-center gap-1.5 cursor-none text-xs sm:text-sm w-full justify-center"
                  >
                    <span>View on LinkedIn</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Right Column: Profile details & content */}
            <div className="flex flex-col gap-5 text-left">
              {/* Author Info */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 flex justify-center items-center">
                    {profile?.aboutImage?.url ? (
                      <img src={profile.aboutImage.url} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-xs">
                        {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : 'AM'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {profile?.name || 'Ajit Mangsulikar'}
                    </h4>
                    <p className="text-[11px] text-text-secondary leading-tight">{profile?.title || 'Full Stack Developer | Tech Enthusiast'}</p>
                  </div>
                </div>
                {currentBlog.isLinkedIn && (
                  <div className="text-[#0a66c2]">
                    <LinkedinIcon className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="text-base sm:text-lg leading-relaxed text-text-primary whitespace-pre-wrap">
                {currentBlog.isLinkedIn ? removeHashtags(currentBlog.content) : currentBlog.content}
              </div>
            </div>
          </div>

          {currentBlog.tags && currentBlog.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-10">
              {currentBlog.tags.map((tag, idx) => (
                <span key={idx} className="text-xs text-accent-purple bg-accent-purple/8 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    );
  }

  // Blogs Horizontal Timeline View
  return (
    <div className="w-full lg:w-[80vw] max-w-none mx-auto px-4 py-16 z-10 relative overflow-hidden">
      <h1 className="text-3xl font-extrabold text-center mb-13 tracking-wide gradient-text text-glow">
        My Blogs
      </h1>

      {blogs.length === 0 ? (
        <div className="glass-panel p-10 text-center text-text-secondary mx-auto max-w-5xl">
          No articles published yet. Stay tuned!
        </div>
      ) : (
        <div className="relative">
          {/* Horizontal Row of Cards */}
          <div ref={containerRef} className="flex flex-row gap-10 overflow-x-auto pb-10 pt-20 px-4 relative z-10 custom-scrollbar scroll-smooth">
            {/* Horizontal Timeline Line — top/left/width set dynamically via JS */}
            <div className="timeline-bg-track absolute h-[2px] bg-border-subtle z-0 pointer-events-none"></div>
            <div
              ref={lineRef}
              className="absolute h-[2px] bg-gradient-to-r from-accent to-accent-dim z-0 pointer-events-none transition-all duration-100 ease-out"
              style={{ width: '0px' }}
            ></div>

            {blogs.map((blog, index) => (
              <div key={blog._id} className="timeline-item-container relative flex flex-col items-center shrink-0">
                {/* Timeline Month & Year Label */}
                <div
                  className={`absolute top-[-72px] text-sm font-semibold whitespace-nowrap z-20 transition-all duration-500 ${reachedIndices.has(index)
                    ? 'text-accent opacity-100 scale-105'
                    : 'text-text-secondary opacity-60'
                    }`}
                >
                  {formatMonthYear(blog.publishedAt || blog.createdAt)}
                </div>

                {/* Timeline Dot (Node) — 'timeline-dot' class lets JS read its offsetTop */}
                <div
                  className={`timeline-dot w-5 h-5 bg-bg-primary rounded-full z-20 absolute top-[-44px] border-[3px] transition-all duration-500 ${reachedIndices.has(index)
                    ? 'border-accent shadow-[0_0_12px_rgba(232,227,217,0.8)] scale-110'
                    : 'border-border-medium scale-90 opacity-60'
                    }`}
                ></div>

                {/* Blog Card */}
                <BlogCardAnimation index={index}>
                  <Link to={`/blogs/${blog.slug}`} className="glass-panel flex flex-col w-[340px] h-[420px] overflow-hidden text-inherit hover:no-underline cursor-none group rounded-lg">
                    <div className="w-full h-44 border-b border-border-glass overflow-hidden shrink-0">
                      {blog.image?.url ? (
                        <img src={blog.image.url} alt={blog.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103" />
                      ) : blog.isLinkedIn ? (
                        <div className="w-full h-full bg-gradient-to-br from-[#0a66c2]/20 via-accent-purple/10 to-transparent flex flex-col justify-center items-center text-center p-5 text-[#0a66c2] relative overflow-hidden transition-all duration-300 group-hover:from-[#0a66c2]/30 group-hover:via-accent-purple/15">
                          <div className="absolute inset-0 bg-radial-gradient from-[#0a66c2]/10 to-transparent pointer-events-none"></div>
                          <LinkedinIcon className="w-12 h-12 mb-2 drop-shadow-[0_0_8px_rgba(10,102,194,0.4)] animate-pulse" />
                          <span className="text-xs font-semibold tracking-wider uppercase opacity-85">LinkedIn Post</span>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-white/5 flex justify-center items-center text-center p-5 text-text-secondary">
                          <span className="italic text-sm">Article Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow min-h-0">
                      <div className="text-xs text-text-secondary mb-2 shrink-0">
                        <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 leading-snug line-clamp-2 shrink-0">{blog.title}</h3>
                      <p className="text-text-secondary text-sm mb-4 leading-relaxed overflow-y-clip pr-1 line-clamp-3">
                        {blog.content && blog.content.trim() ? (
                          blog.content.length > 180
                            ? `${blog.content.substring(0, 180)}...`
                            : blog.content
                        ) : blog.isLinkedIn ? (
                          "Click to read this blog."
                        ) : (
                          ""
                        )}
                      </p>

                      {/* Tags above button */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-4 shrink-0">
                          {blog.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs text-accent-purple bg-accent-purple/8 px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Open Blog Button */}
                      <div className="mt-auto w-full py-2 text-center text-xs font-bold text-accent border border-accent/20 bg-accent/5 rounded transition-all duration-300 group-hover:bg-accent group-hover:text-bg-primary shrink-0">
                        Read the Blog
                      </div>
                    </div>
                  </Link>
                </BlogCardAnimation>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;