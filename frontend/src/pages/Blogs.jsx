import { useState, useEffect } from 'react';
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
    .replace(/\s{2,}/g, ' ') // collapses multiple spaces into one
    .trim();
};

const Blogs = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-height-[80vh] text-2xl font-semibold text-accent-blue text-glow">
        Loading Articles...
      </div>
    );
  }

  // Single Blog Post View
  if (slug && currentBlog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
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
              Published on {formatDate(currentBlog.createdAt)}
            </div>
          </header>
          
          {/* Regular Blog Cover Image (Not LinkedIn or explicitly uploaded for LinkedIn card) */}
          {!currentBlog.isLinkedIn && currentBlog.image?.url && (
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-border-glass mb-10">
              <img src={currentBlog.image.url} alt={currentBlog.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Regular Blog Content (Not LinkedIn) */}
          {!currentBlog.isLinkedIn && currentBlog.content && (
            <div className="text-lg leading-relaxed text-text-primary whitespace-pre-wrap mb-8">
              {currentBlog.content}
            </div>
          )}

          {/* LinkedIn Post Layout (2-Column Grid: Image Left, Caption Right) */}
          {currentBlog.isLinkedIn && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 mt-8 items-start">
              {/* Left Column: Image/Visual */}
              <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-black/10">
                {currentBlog.image?.url ? (
                  <img
                    src={currentBlog.image.url}
                    alt={currentBlog.title}
                    className="w-full h-auto object-cover max-h-[500px] rounded-xl"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-[#0a66c2]/20 via-accent-purple/10 to-transparent flex flex-col justify-center items-center text-center p-5 text-[#0a66c2] relative overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-radial-gradient from-[#0a66c2]/10 to-transparent pointer-events-none"></div>
                    <LinkedinIcon className="w-16 h-16 mb-2 drop-shadow-[0_0_8px_rgba(10,102,194,0.4)]" />
                    <span className="text-xs font-semibold tracking-wider uppercase opacity-85">LinkedIn Post</span>
                  </div>
                )}
              </div>

              {/* Right Column: Profile details & clean caption text */}
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
                  <div className="text-[#0a66c2]">
                    <LinkedinIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Caption text without hashtags */}
                <div className="text-base sm:text-lg leading-relaxed text-text-primary whitespace-pre-wrap">
                  {removeHashtags(currentBlog.content)}
                </div>

                {/* External Action Button */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <a
                    href={currentBlog.linkedInUrl ? currentBlog.linkedInUrl.replace('/embed', '') : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button active inline-flex items-center gap-1.5 cursor-none text-xs sm:text-sm"
                  >
                    <span>View on LinkedIn</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
          
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

  // Blogs Grid List View
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 z-10 relative">
      <h1 className="text-4xl font-extrabold text-center mb-16 tracking-wide gradient-text text-glow">
        My Articles & Blogs
      </h1>

      {blogs.length === 0 ? (
        <div className="glass-panel p-10 text-center text-text-secondary">
          No articles published yet. Stay tuned!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog._id} to={`/blogs/${blog.slug}`} className="glass-panel flex flex-col h-full overflow-hidden text-inherit hover:no-underline cursor-none group">
              <div className="w-full h-48 border-b border-border-glass overflow-hidden">
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
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between text-xs text-text-secondary mb-3">
                  <span>{formatDate(blog.createdAt)}</span>
                  {blog.isLinkedIn && (
                    <span className="flex items-center gap-1 text-[#0a66c2] font-semibold uppercase text-[10px] tracking-wider bg-[#0a66c2]/10 px-2 py-0.5 rounded-full">
                      <LinkedinIcon className="w-3 h-3" />
                      LinkedIn
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">{blog.title}</h3>
                <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                  {blog.content && blog.content.trim() ? (
                    blog.content.length > 120 
                      ? `${blog.content.substring(0, 120)}...` 
                      : blog.content
                  ) : blog.isLinkedIn ? (
                    "Click to read this interactive article imported directly from LinkedIn."
                  ) : (
                    ""
                  )}
                </p>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-auto">
                    {blog.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-accent-purple bg-accent-purple/8 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
