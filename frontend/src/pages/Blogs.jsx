import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const Blogs = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch blogs list or single blog depending on route parameter
  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
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
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <Link to="/blogs" className="glass-button">
            &larr; Back to Blogs
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
          
          {currentBlog.image?.url && (
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-border-glass mb-10">
              <img src={currentBlog.image.url} alt={currentBlog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="text-lg leading-relaxed text-text-primary whitespace-pre-wrap">
            {currentBlog.content}
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
                ) : (
                  <div className="w-full h-full bg-white/5 flex justify-center items-center text-center p-5 text-text-secondary">
                    <span className="italic text-sm">Article Image</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between text-xs text-text-secondary mb-3">
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">{blog.title}</h3>
                <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                  {blog.content.length > 120 
                    ? `${blog.content.substring(0, 120)}...` 
                    : blog.content}
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
