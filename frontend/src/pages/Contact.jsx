import { useState } from 'react';
import api from '../utils/api';
import { Mail, Send, MapPin, User, MessageSquare, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setModalConfig({
        isOpen: true,
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please fill in your name, email, and message before sending.'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/contact', formData);
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Message Sent!',
        message: res.data.message || 'Thank you for reaching out! Your message has been sent directly to my email.'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact submit error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to send your message. Please check server settings or try again later.';
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Delivery Failed',
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-16 z-10 relative">
      {/* Section Header */}
      <h1 className="text-3xl font-extrabold text-center mb-13 tracking-wide gradient-text text-glow animate-fade-in-up">
        Contact Me
      </h1>

      {/* Main Grid: Form Left, Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-start">
        {/* Contact Form Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-xl border border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <User className="w-5 h-5 text-accent" />
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="glass-input text-sm"
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="glass-input text-sm"
              />
            </div>

            {/* Message Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Write your message here..."
                required
                className="glass-input text-sm resize-none leading-relaxed"
              />
            </div>

            {/* Dynamic Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="glass-button active w-full sm:w-auto px-8 py-3.5 justify-center inline-flex items-center gap-2 font-semibold text-sm cursor-none mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#e8e3d9]" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-accent" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-xl border border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md flex flex-col gap-5">
            <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/10 pb-3">
              Direct Contact
            </h3>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                <Mail className="w-5 h-5 text-[#e8e3d9]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Me</span>
                <a
                  href="mailto:ajitmangsulikar950@gmail.com"
                  className="text-sm font-medium text-white hover:text-accent transition-colors cursor-none mt-0.5"
                >
                  ajitmangsulikar950@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-[#e8e3d9]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Location</span>
                <span className="text-sm font-medium text-white mt-0.5">
                  India
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <Modal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
};

export default Contact;
