import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import './Pages.css';

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
    return <div className="page-loader">Loading Articles...</div>;
  }

  // Single Blog Post View
  if (slug && currentBlog) {
    return (
      <div className="blog-post-container">
        <div className="blog-post-back">
          <Link to="/blogs" className="glass-button">
            &larr; Back to Blogs
          </Link>
        </div>
        <article className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
          <header className="blog-post-header">
            <h1 className="blog-post-title gradient-text text-glow">{currentBlog.title}</h1>
            <div className="blog-post-meta">
              Published on {formatDate(currentBlog.createdAt)}
            </div>
          </header>
          
          {currentBlog.image?.url && (
            <div className="blog-post-image-wrapper">
              <img src={currentBlog.image.url} alt={currentBlog.title} className="blog-post-img" />
            </div>
          )}

          <div className="blog-post-body">
            {/* Simple display. In real scenario, markdown parser is ideal. We'll format lines nicely */}
            {currentBlog.content}
          </div>
          
          {currentBlog.tags && currentBlog.tags.length > 0 && (
            <div className="blog-tags" style={{ marginTop: '40px' }}>
              {currentBlog.tags.map((tag, idx) => (
                <span key={idx} className="blog-tag">#{tag}</span>
              ))}
            </div>
          )}
        </article>
      </div>
    );
  }

  // Blogs Grid List View
  return (
    <div className="container">
      <h1 className="section-title gradient-text text-glow">My Articles & Blogs</h1>

      {blogs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          No articles published yet. Stay tuned!
        </div>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <Link key={blog._id} to={`/blogs/${blog.slug}`} className="blog-card glass-panel">
              <div className="blog-image-container">
                {blog.image?.url ? (
                  <img src={blog.image.url} alt={blog.title} className="blog-img" />
                ) : (
                  <div className="about-image-placeholder">
                    <span className="placeholder-text">Article Image</span>
                  </div>
                )}
              </div>
              <div className="blog-content">
                <div className="blog-date-row">
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-summary">
                  {blog.content.length > 120 
                    ? `${blog.content.substring(0, 120)}...` 
                    : blog.content}
                </p>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-tags">
                    {blog.tags.map((tag, idx) => (
                      <span key={idx} className="blog-tag">#{tag}</span>
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
