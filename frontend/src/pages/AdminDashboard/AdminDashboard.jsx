import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Upload, Trash2, Edit3, Plus, X, FileText, Image as ImageIcon, Globe, Mail, Calendar, MapPin, List, Award, BookOpen, Settings, AlertCircle, PlusCircle, CheckCircle, Loader2 } from 'lucide-react';
import Modal from '../../components/Modal';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583 0.07-4.849 0.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: '', title: '', bio: '',
    socialLinks: { github: '', linkedin: '', twitter: '', instagram: '', email: '' }
  });
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  // Lists for CRUD
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Forms states
  const [expForm, setExpForm] = useState({ id: '', company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '', technologies: '', order: 0 });
  const [projectForm, setProjectForm] = useState({ id: '', title: '', subtitle: '', description: '', technologies: '', githubLink: '', liveLink: '', category: 'Web Development', order: 0 });
  const [projectFile, setProjectFile] = useState(null);
  const [skillForm, setSkillForm] = useState({ id: '', name: '', category: 'Languages', level: 80 });
  const [certForm, setCertForm] = useState({ id: '', name: '', issuingOrganization: '', issueDate: '', credentialUrl: '', order: 0 });
  const [certFile, setCertFile] = useState(null);
  const [blogForm, setBlogForm] = useState({ id: '', title: '', content: '', tags: '', status: 'draft', isLinkedIn: false, linkedInUrl: '', publishedAt: '' });
  const [blogFile1, setBlogFile1] = useState(null);
  const [blogFile2, setBlogFile2] = useState(null);
  const [blogFile3, setBlogFile3] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');

  const renderFileUpload = (id, label, accept, fileState, setFileState, currentUrl, fileType = 'image') => {
    return (
      <div className="flex flex-col gap-2 flex-1 min-w-[240px]">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</label>
        <div className="relative border border-dashed border-white/10 hover:border-white/20 rounded-lg p-5 text-center cursor-none transition-all duration-200 bg-white/[0.01] hover:bg-white/[0.02] group">
          <input
            type="file"
            id={id}
            accept={accept}
            className="absolute inset-0 w-full h-full opacity-0 cursor-none z-10"
            onChange={(e) => setFileState(e.target.files[0])}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="w-5 h-5 text-accent opacity-75 group-hover:scale-105 transition-transform" />
            <span className="text-sm font-medium text-text-primary">
              {fileState ? fileState.name : `Choose ${fileType === 'pdf' ? 'PDF File' : 'Image'}`}
            </span>
            <span className="text-xs text-text-secondary">
              {fileState ? `${(fileState.size / (1024 * 1024)).toFixed(2)} MB` : `Click to browse or drag file`}
            </span>
          </div>
        </div>
        {currentUrl && !fileState && (
          <span className="text-xs text-text-secondary mt-1">
            Current file:{' '}
            <a href={currentUrl} target="_blank" rel="noreferrer" className="text-accent underline hover:text-white cursor-none transition-colors">
              View File
            </a>
          </span>
        )}
      </div>
    );
  };


  useEffect(() => {
    const loadAllData = async () => {
      setPageLoading(true);
      try {
        await Promise.all([
          fetchProfile(),
          fetchExperiences(),
          fetchProjects(),
          fetchSkills(),
          fetchCertifications(),
          fetchBlogs()
        ]);
      } catch (err) {
        console.error('Error loading admin dashboard data:', err);
      } finally {
        setPageLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: null,
    showCancel: false
  });

  const showNotice = (title, message, type = 'success') => {
    setModalConfig({
      isOpen: true,
      type,
      title,
      message,
      showCancel: false,
      onConfirm: null
    });
  };

  const confirmAction = (title, message, onConfirm, confirmText = 'Delete') => {
    setModalConfig({
      isOpen: true,
      type: 'danger',
      title,
      message,
      confirmText,
      showCancel: true,
      onConfirm
    });
  };

  // API Fetches
  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchExperiences = async () => {
    try {
      const res = await api.get('/experiences');
      setExperiences(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCertifications = async () => {
    try {
      const res = await api.get('/certifications');
      setCertifications(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs/admin');
      setBlogs(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', profile.name);
      fd.append('title', profile.title);
      fd.append('bio', profile.bio);
      fd.append('github', profile.socialLinks.github || '');
      fd.append('linkedin', profile.socialLinks.linkedin || '');
      fd.append('twitter', profile.socialLinks.twitter || '');
      fd.append('instagram', profile.socialLinks.instagram || '');
      fd.append('email', profile.socialLinks.email || '');

      if (aboutImageFile) fd.append('aboutImage', aboutImageFile);
      if (resumeFile) fd.append('resumeUrl', resumeFile);

      const res = await api.put('/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(res.data);
      setAboutImageFile(null);
      setResumeFile(null);
      showNotice('Profile Updated', 'Profile details updated successfully!');
    } catch (err) {
      console.error(err);
      showNotice('Error', 'Failed to update profile details', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Experience CRUD
  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        ...expForm,
        technologies: expForm.technologies,
        description: expForm.description
      };
      if (expForm.id) {
        await api.put(`/experiences/${expForm.id}`, body);
        showNotice('Experience Saved', 'Experience entry updated successfully!');
      } else {
        await api.post('/experiences', body);
        showNotice('Experience Added', 'New experience entry added successfully!');
      }
      setExpForm({ id: '', company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '', technologies: '', order: 0 });
      fetchExperiences();
    } catch (err) {
      console.error(err);
      showNotice('Error', 'Failed to save experience entry', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = (id) => {
    confirmAction('Delete Experience', 'Are you sure you want to delete this experience entry? This cannot be undone.', async () => {
      try {
        await api.delete(`/experiences/${id}`);
        showNotice('Experience Deleted', 'Experience entry deleted successfully!');
        fetchExperiences();
      } catch (err) {
        console.error(err);
        showNotice('Error', 'Failed to delete experience entry', 'danger');
      }
    });
  };

  // Project CRUD
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', projectForm.title);
      fd.append('subtitle', projectForm.subtitle || '');
      fd.append('description', projectForm.description);
      fd.append('technologies', projectForm.technologies);
      fd.append('githubLink', projectForm.githubLink || '');
      fd.append('liveLink', projectForm.liveLink || '');
      fd.append('category', projectForm.category);
      fd.append('order', projectForm.order);

      if (projectFile) fd.append('image', projectFile);

      if (projectForm.id) {
        await api.put(`/projects/${projectForm.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showNotice('Project Saved', 'Project details updated successfully!');
      } else {
        await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showNotice('Project Added', 'New project added successfully!');
      }
      setProjectForm({ id: '', title: '', subtitle: '', description: '', technologies: '', githubLink: '', liveLink: '', category: 'Web Development', order: 0 });
      setProjectFile(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
      showNotice('Error', 'Failed to save project entry', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = (id) => {
    confirmAction('Delete Project', 'Are you sure you want to delete this project entry? This cannot be undone.', async () => {
      try {
        await api.delete(`/projects/${id}`);
        showNotice('Project Deleted', 'Project entry deleted successfully!');
        fetchProjects();
      } catch (err) {
        console.error(err);
        showNotice('Error', 'Failed to delete project entry', 'danger');
      }
    });
  };

  // Skill CRUD
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', skillForm.name);
      fd.append('category', skillForm.category);
      fd.append('level', skillForm.level);

      if (skillForm.id) {
        await api.put(`/skills/${skillForm.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showNotice('Skill Saved', 'Skill details updated successfully!');
      } else {
        await api.post('/skills', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showNotice('Skill Added', 'New skill added successfully!');
      }
      setSkillForm({ id: '', name: '', category: 'Languages', level: 80 });
      fetchSkills();
    } catch (err) {
      console.error(err);
      showNotice('Error', 'Failed to save skill entry', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = (id) => {
    confirmAction('Delete Skill', 'Are you sure you want to delete this skill entry? This cannot be undone.', async () => {
      try {
        await api.delete(`/skills/${id}`);
        showNotice('Skill Deleted', 'Skill entry deleted successfully!');
        fetchSkills();
      } catch (err) {
        console.error(err);
        showNotice('Error', 'Failed to delete skill entry', 'danger');
      }
    });
  };

  // Certification CRUD
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', certForm.name);
      fd.append('issuingOrganization', certForm.issuingOrganization);
      fd.append('issueDate', certForm.issueDate);
      fd.append('credentialUrl', certForm.credentialUrl || '');
      fd.append('order', certForm.order);
      if (certFile) fd.append('file', certFile);

      if (certForm.id) {
        await api.put(`/certifications/${certForm.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showNotice('Certification Saved', 'Certification details updated successfully!');
      } else {
        await api.post('/certifications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showNotice('Certification Added', 'New certification added successfully!');
      }
      setCertForm({ id: '', name: '', issuingOrganization: '', issueDate: '', credentialUrl: '', order: 0 });
      setCertFile(null);
      fetchCertifications();
    } catch (err) {
      console.error(err);
      showNotice('Error', 'Failed to save certification entry', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const deleteCert = (id) => {
    confirmAction('Delete Certification', 'Are you sure you want to delete this certification entry? This cannot be undone.', async () => {
      try {
        await api.delete(`/certifications/${id}`);
        showNotice('Certification Deleted', 'Certification entry deleted successfully!');
        fetchCertifications();
      } catch (err) {
        console.error(err);
        showNotice('Error', 'Failed to delete certification entry', 'danger');
      }
    });
  };

  // Blog CRUD
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', blogForm.title);
      fd.append('content', blogForm.content || '');
      fd.append('tags', blogForm.tags);
      fd.append('status', blogForm.status);
      fd.append('isLinkedIn', blogForm.isLinkedIn);
      fd.append('linkedInUrl', blogForm.linkedInUrl || '');
      if (blogForm.publishedAt) fd.append('publishedAt', blogForm.publishedAt);
      if (blogFile1) fd.append('image', blogFile1);
      if (blogFile2) fd.append('image2', blogFile2);
      if (blogFile3) fd.append('image3', blogFile3);

      if (blogForm.id) {
        await api.put(`/blogs/${blogForm.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showNotice('Blog Saved', 'Blog post updated successfully!');
      } else {
        await api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showNotice('Blog Added', 'New blog post created successfully!');
      }
      setBlogForm({ id: '', title: '', content: '', tags: '', status: 'draft', isLinkedIn: false, linkedInUrl: '', publishedAt: '' });
      setBlogFile1(null);
      setBlogFile2(null);
      setBlogFile3(null);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      showNotice('Error', 'Failed to save blog post', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = (id) => {
    confirmAction('Delete Blog Post', 'Are you sure you want to delete this blog post? This cannot be undone.', async () => {
      try {
        await api.delete(`/blogs/${id}`);
        showNotice('Blog Deleted', 'Blog post deleted successfully!');
        fetchBlogs();
      } catch (err) {
        console.error(err);
        showNotice('Error', 'Failed to delete blog post', 'danger');
      }
    });
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[80vw] max-w-none mx-auto px-4 py-16 flex flex-col gap-8 z-10 relative">
      <h1 className="text-4xl font-extrabold text-center tracking-wide gradient-text text-glow">Admin Dashboard</h1>

      {message && (
        <div className="bg-accent-blue/10 border border-accent-blue/20 text-accent-blue p-4 rounded-xl font-medium text-center animate-pulse-glow">
          {message}
        </div>
      )}

      {/* Tabs Controller */}
      <div className="flex justify-start items-center gap-4 overflow-x-auto pb-2 custom-scrollbar w-full">
        {['profile', 'experience', 'projects', 'skills', 'certifications', 'blogs'].map((tab) => (
          <button
            key={tab}
            className={`glass-button shrink-0 text-sm ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="glass-panel p-6 sm:p-10 rounded-[24px]">
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold gradient-text">Edit Personal Profile</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[240px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[240px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Bio (About Section)</label>
                <textarea
                  className="glass-input resize-vertical"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <h3 className="text-lg font-bold mt-4 border-b border-white/5 pb-2 text-text-primary">Files & Documents</h3>
              <div className="flex flex-col sm:flex-row gap-6">
                {renderFileUpload('aboutImage', 'Profile Image (About Photo)', 'image/*', aboutImageFile, setAboutImageFile, profile.aboutImage?.url, 'image')}
                {renderFileUpload('resumeUrl', 'Resume (PDF File)', 'application/pdf', resumeFile, setResumeFile, profile.resumeUrl?.url, 'pdf')}
              </div>

              <h3 className="text-lg font-bold mt-4 border-b border-white/5 pb-2 text-text-primary">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">GitHub Link</label>
                  <input
                    type="url"
                    className="glass-input"
                    value={profile.socialLinks.github}
                    onChange={(e) => setProfile({
                      ...profile,
                      socialLinks: { ...profile.socialLinks, github: e.target.value }
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">LinkedIn Link</label>
                  <input
                    type="url"
                    className="glass-input"
                    value={profile.socialLinks.linkedin}
                    onChange={(e) => setProfile({
                      ...profile,
                      socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Twitter Link</label>
                  <input
                    type="url"
                    className="glass-input"
                    value={profile.socialLinks.twitter}
                    onChange={(e) => setProfile({
                      ...profile,
                      socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Instagram Link</label>
                  <input
                    type="url"
                    className="glass-input"
                    value={profile.socialLinks.instagram || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      socialLinks: { ...profile.socialLinks, instagram: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  className="glass-input"
                  value={profile.socialLinks.email}
                  onChange={(e) => setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, email: e.target.value }
                  })}
                />
              </div>

              <button type="submit" className="glass-button active w-full mt-4 justify-center inline-flex items-center gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#e8e3d9]" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  'Save Profile Changes'
                )}
              </button>
            </form>

            {/* Profile Card Preview */}
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold gradient-text">Profile Card Preview</h2>
              <div className="glass-panel p-8 rounded-xl flex flex-col items-center text-center gap-5 relative overflow-hidden transition-all duration-300 hover:border-white/15 group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-dim"></div>
                {aboutImageFile || profile.aboutImage?.url ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border border-white/10 shadow-lg relative">
                    <img
                      src={aboutImageFile ? URL.createObjectURL(aboutImageFile) : profile.aboutImage.url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-neutral-600">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{profile.name || 'Ajit Mangsulikar'}</h3>
                  <h4 className="text-sm font-semibold text-accent mt-1">{profile.title || 'Full Stack Developer'}</h4>
                </div>

                {/* Social links row */}
                <div className="flex gap-5 items-center justify-center mt-2 border-t border-white/5 pt-4 w-full">
                  {profile.socialLinks?.github && <GithubIcon className="w-5 h-5 text-[#6b7280] hover:text-white transition-colors" />}
                  {profile.socialLinks?.linkedin && <LinkedinIcon className="w-5 h-5 text-[#6b7280] hover:text-white transition-colors" />}
                  {profile.socialLinks?.instagram && <InstagramIcon className="w-5 h-5 text-[#6b7280] hover:text-white transition-colors" />}
                  {profile.socialLinks?.email && <Mail className="w-5 h-5 text-[#6b7280] hover:text-white transition-colors" />}
                </div>

                {profile.resumeUrl?.url && (
                  <a
                    href={profile.resumeUrl.url}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-button text-xs py-1.5 px-4 mt-2 inline-flex items-center gap-1.5 cursor-none"
                  >
                    <FileText className="w-4 h-4" />
                    View Resume PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Experience */}
        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
            <form onSubmit={handleExpSubmit} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold gradient-text">{expForm.id ? 'Edit' : 'Add'} Experience</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Company</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Role</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Location</label>
                <input
                  type="text"
                  className="glass-input"
                  value={expForm.location}
                  onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="glass-input pr-10 cursor-pointer"
                      value={expForm.startDate ? expForm.startDate.split('T')[0] : ''}
                      onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                      required
                    />
                    <Calendar
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary hover:text-white cursor-pointer transition-colors"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling;
                        if (input && typeof input.showPicker === 'function') {
                          input.showPicker();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">End Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="glass-input pr-10 cursor-pointer"
                      value={expForm.endDate && !expForm.current ? expForm.endDate.split('T')[0] : ''}
                      onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                      disabled={expForm.current}
                    />
                    <Calendar
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary hover:text-white cursor-pointer transition-colors"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling;
                        if (input && typeof input.showPicker === 'function') {
                          input.showPicker();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="current"
                  className="w-[18px] h-[18px] cursor-none"
                  checked={expForm.current}
                  onChange={(e) => setExpForm({ ...expForm, current: e.target.checked })}
                />
                <label htmlFor="current" className="text-sm text-text-secondary cursor-none">I currently work here</label>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Description (One accomplishment per line)</label>
                <textarea
                  className="glass-input resize-vertical"
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  rows={4}
                  placeholder="Managed backend servers&#10;Designed React UI layouts"
                  required
                />
              </div>

              {/* <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  className="glass-input"
                  value={expForm.technologies}
                  onChange={(e) => setExpForm({ ...expForm, technologies: e.target.value })}
                  placeholder="React, Node.js, Express"
                />
              </div> */}

              <div className="flex gap-4">
                <button type="submit" className="glass-button active flex-1 justify-center inline-flex items-center gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#e8e3d9]" />
                      <span>{expForm.id ? 'Updating...' : 'Adding...'}</span>
                    </>
                  ) : (
                    expForm.id ? 'Update' : 'Add'
                  )}
                </button>
                {expForm.id && (
                  <button
                    type="button"
                    className="glass-button"
                    onClick={() => setExpForm({ id: '', company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '', technologies: '', order: 0 })}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold gradient-text">Existing Experiences</h2>
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                {experiences.map((exp) => (
                  <div key={exp._id} className="flex justify-between items-center p-5 gap-4 glass-panel rounded-xl">
                    <div>
                      <h4 className="text-base font-semibold text-white">{exp.role} @ {exp.company}</h4>
                      <p className="text-xs text-text-secondary mt-1">
                        {exp.current ? 'Current' : 'Past'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="glass-button px-3 py-1.5 text-xs cursor-none"
                        onClick={() => setExpForm({
                          id: exp._id,
                          company: exp.company,
                          role: exp.role,
                          location: exp.location,
                          startDate: exp.startDate,
                          endDate: exp.endDate || '',
                          current: exp.current,
                          description: exp.description.join('\n'),
                          technologies: exp.technologies.join(', '),
                          order: exp.order
                        })}
                      >
                        Edit
                      </button>
                      <button
                        className="glass-button px-3 py-1.5 text-xs text-accent-pink border-accent-pink/30 hover:bg-accent-pink/10 cursor-none"
                        onClick={() => deleteExperience(exp._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Projects */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
            <form onSubmit={handleProjectSubmit} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold gradient-text">{projectForm.id ? 'Edit' : 'Add'} Project</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Project Title</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Category</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    placeholder="e.g. Frontend, Fullstack, AI"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Project Subtitle (e.g. Full-Stack Government Web Application)</label>
                <input
                  type="text"
                  className="glass-input"
                  value={projectForm.subtitle || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                  placeholder="e.g. Machine Learning + Streamlit Application"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Description</label>
                <textarea
                  className="glass-input resize-vertical"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Technologies (comma separated)</label>
                <input
                  type="text"
                  className="glass-input"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  placeholder="React, Express, MongoDB"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">GitHub Link</label>
                  <input
                    type="url"
                    className="glass-input"
                    value={projectForm.githubLink}
                    onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Live Link</label>
                  <input
                    type="url"
                    className="glass-input"
                    value={projectForm.liveLink}
                    onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[240px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Order</label>
                  <input
                    type="number"
                    className="glass-input"
                    value={projectForm.order}
                    onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                  />
                </div>
                {renderFileUpload(
                  'projectImage',
                  'Project Screenshot Image',
                  'image/*',
                  projectFile,
                  setProjectFile,
                  projects.find((p) => p._id === projectForm.id)?.image?.url,
                  'image'
                )}
              </div>

              <div className="flex gap-4">
                <button type="submit" className="glass-button active flex-1 justify-center inline-flex items-center gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#e8e3d9]" />
                      <span>{projectForm.id ? 'Updating...' : 'Adding...'}</span>
                    </>
                  ) : (
                    projectForm.id ? 'Update' : 'Add'
                  )}
                </button>
                {projectForm.id && (
                  <button
                    type="button"
                    className="glass-button"
                    onClick={() => setProjectForm({ id: '', title: '', subtitle: '', description: '', technologies: '', githubLink: '', liveLink: '', category: 'Web Development', order: 0 })}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold gradient-text">Existing Projects</h2>
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                {projects.map((proj) => (
                  <div key={proj._id} className="flex justify-between items-center p-5 gap-4 glass-panel rounded-xl">
                    <div>
                      <h4 className="text-base font-semibold text-white">{proj.title}</h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Category: {proj.category} | Order: {proj.order}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="glass-button px-3 py-1.5 text-xs cursor-none"
                        onClick={() => setProjectForm({
                          id: proj._id,
                          title: proj.title,
                          subtitle: proj.subtitle || '',
                          description: proj.description,
                          technologies: proj.technologies.join(', '),
                          githubLink: proj.githubLink,
                          liveLink: proj.liveLink,
                          category: proj.category,
                          order: proj.order
                        })}
                      >
                        Edit
                      </button>
                      <button
                        className="glass-button px-3 py-1.5 text-xs text-accent-pink border-accent-pink/30 hover:bg-accent-pink/10 cursor-none"
                        onClick={() => deleteProject(proj._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Skills */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
            <form onSubmit={handleSkillSubmit} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold gradient-text">{skillForm.id ? 'Edit' : 'Add'} Skill</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Skill Name</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Category</label>
                  <select
                    className="glass-input cursor-none"
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  >
                    <option value="Languages">Languages</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Deployment">Deployment</option>
                    <option value="CI/CD">CI/CD</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-grow flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Level (Proficiency %)</label>
                    <span className="text-sm font-bold text-accent">{skillForm.level}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="custom-slider w-full cursor-none focus:outline-none"
                    value={skillForm.level}
                    onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="glass-button active flex-1 justify-center inline-flex items-center gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#e8e3d9]" />
                      <span>{skillForm.id ? 'Updating...' : 'Adding...'}</span>
                    </>
                  ) : (
                    skillForm.id ? 'Update' : 'Add'
                  )}
                </button>
                {skillForm.id && (
                  <button
                    type="button"
                    className="glass-button"
                    onClick={() => setSkillForm({ id: '', name: '', category: 'Languages', level: 80 })}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold gradient-text">Existing Skills</h2>
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                {skills.map((skill) => (
                  <div key={skill._id} className="flex justify-between items-center p-5 gap-4 glass-panel rounded-xl">
                    <div>
                      <h4 className="text-base font-semibold text-white">{skill.name}</h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Category: {skill.category} | Proficiency: {skill.level}%
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="glass-button px-3 py-1.5 text-xs cursor-none"
                        onClick={() => setSkillForm({
                          id: skill._id,
                          name: skill.name,
                          category: skill.category,
                          level: skill.level
                        })}
                      >
                        Edit
                      </button>
                      <button
                        className="glass-button px-3 py-1.5 text-xs text-accent-pink border-accent-pink/30 hover:bg-accent-pink/10 cursor-none"
                        onClick={() => deleteSkill(skill._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Certifications */}
        {activeTab === 'certifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
            <form onSubmit={handleCertSubmit} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold gradient-text">{certForm.id ? 'Edit' : 'Add'} Certification</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Certification Name</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={certForm.name}
                    onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Issuing Organization</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={certForm.issuingOrganization}
                    onChange={(e) => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Issue Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="glass-input pr-10 cursor-pointer"
                    value={certForm.issueDate ? certForm.issueDate.split('T')[0] : ''}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    required
                  />
                  <Calendar
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary hover:text-white cursor-pointer transition-colors"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling;
                      if (input && typeof input.showPicker === 'function') {
                        input.showPicker();
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[240px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Credential Verification URL</label>
                  <input
                    type="url"
                    className="glass-input"
                    value={certForm.credentialUrl}
                    onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  />
                </div>
                {renderFileUpload(
                  'certFile',
                  'Certificate File (Image or PDF)',
                  'image/*,application/pdf',
                  certFile,
                  setCertFile,
                  certifications.find((c) => c._id === certForm.id)?.file?.url,
                  certifications.find((c) => c._id === certForm.id)?.file?.url?.endsWith('.pdf') ? 'pdf' : 'image'
                )}
              </div>

              <div className="flex gap-4">
                <button type="submit" className="glass-button active flex-1 justify-center inline-flex items-center gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#e8e3d9]" />
                      <span>{certForm.id ? 'Updating...' : 'Adding...'}</span>
                    </>
                  ) : (
                    certForm.id ? 'Update' : 'Add'
                  )}
                </button>
                {certForm.id && (
                  <button
                    type="button"
                    className="glass-button"
                    onClick={() => setCertForm({ id: '', name: '', issuingOrganization: '', issueDate: '', credentialUrl: '', order: 0 })}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold gradient-text">Existing Certifications</h2>
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                {certifications.map((cert) => (
                  <div key={cert._id} className="flex justify-between items-center p-5 gap-4 glass-panel rounded-xl">
                    <div>
                      <h4 className="text-base font-semibold text-white">{cert.name}</h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Org: {cert.issuingOrganization}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="glass-button px-3 py-1.5 text-xs cursor-none"
                        onClick={() => setCertForm({
                          id: cert._id,
                          name: cert.name,
                          issuingOrganization: cert.issuingOrganization,
                          issueDate: cert.issueDate,
                          credentialUrl: cert.credentialUrl,
                          order: cert.order
                        })}
                      >
                        Edit
                      </button>
                      <button
                        className="glass-button px-3 py-1.5 text-xs text-accent-pink border-accent-pink/30 hover:bg-accent-pink/10 cursor-none"
                        onClick={() => deleteCert(cert._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Blogs */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
            <form onSubmit={handleBlogSubmit} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold gradient-text">{blogForm.id ? 'Edit' : 'Add'} Blog Post</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-[2] min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Title</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[150px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Publish Status</label>
                  <select
                    className="glass-input cursor-none"
                    value={blogForm.status}
                    onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[180px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Post Date (Optional)</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="glass-input pr-10 cursor-pointer"
                      value={blogForm.publishedAt ? blogForm.publishedAt.substring(0, 10) : ''}
                      onChange={(e) => setBlogForm({ ...blogForm, publishedAt: e.target.value })}
                    />
                    <Calendar
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary hover:text-white cursor-pointer transition-colors"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling;
                        if (input && typeof input.showPicker === 'function') {
                          input.showPicker();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLinkedIn"
                  className="w-4 h-4 rounded border-border-glass bg-white/5 text-accent-blue focus:ring-accent-blue/30 focus:ring-offset-0 cursor-none"
                  checked={blogForm.isLinkedIn}
                  onChange={(e) => setBlogForm({ ...blogForm, isLinkedIn: e.target.checked })}
                />
                <label htmlFor="isLinkedIn" className="text-sm font-semibold text-text-primary cursor-none select-none">
                  Import directly from a LinkedIn Post
                </label>
              </div>

              {blogForm.isLinkedIn && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">LinkedIn Post URL or Embed Code</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="https://www.linkedin.com/posts/username_topic-activity-123456789... or <iframe>...</iframe>"
                    value={blogForm.linkedInUrl}
                    onChange={(e) => setBlogForm({ ...blogForm, linkedInUrl: e.target.value })}
                    required={blogForm.isLinkedIn}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">
                  {blogForm.isLinkedIn ? 'Additional Commentary / Text (Optional)' : 'Blog Content (Text/Markdown)'}
                </label>
                <textarea
                  className="glass-input resize-vertical"
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  rows={8}
                  required={!blogForm.isLinkedIn}
                />
              </div>

              <div className="flex flex-col gap-2">
                {renderFileUpload(
                  'blogFile1',
                  'Featured Image 1',
                  'image/*',
                  blogFile1,
                  setBlogFile1,
                  blogs.find((b) => b._id === blogForm.id)?.image?.url,
                  'image'
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {renderFileUpload(
                  'blogFile2',
                  'Featured Image 2 (Optional)',
                  'image/*',
                  blogFile2,
                  setBlogFile2,
                  blogs.find((b) => b._id === blogForm.id)?.image2?.url,
                  'image'
                )}
                {renderFileUpload(
                  'blogFile3',
                  'Featured Image 3 (Optional)',
                  'image/*',
                  blogFile3,
                  setBlogFile3,
                  blogs.find((b) => b._id === blogForm.id)?.image3?.url,
                  'image'
                )}
              </div>

              <div className="flex gap-4">
                <button type="submit" className="glass-button active flex-1 justify-center inline-flex items-center gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#e8e3d9]" />
                      <span>{blogForm.id ? 'Updating...' : 'Adding...'}</span>
                    </>
                  ) : (
                    blogForm.id ? 'Update' : 'Add'
                  )}
                </button>
                {blogForm.id && (
                  <button
                    type="button"
                    className="glass-button"
                    onClick={() => {
                      setBlogForm({ id: '', title: '', content: '', tags: '', status: 'draft', isLinkedIn: false, linkedInUrl: '' });
                      setBlogFile1(null);
                      setBlogFile2(null);
                      setBlogFile3(null);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold gradient-text">Existing Blogs</h2>
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                {blogs.map((blog) => (
                  <div key={blog._id} className="flex justify-between items-center p-5 gap-4 glass-panel rounded-xl">
                    <div>
                      <h4 className="text-base font-semibold text-white">{blog.title}</h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Status: <span className={blog.status === 'published' ? 'text-accent-blue' : 'text-accent-pink'}>{blog.status}</span>
                        {blog.isLinkedIn && <span className="ml-2 text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">LinkedIn</span>}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="glass-button px-3 py-1.5 text-xs cursor-none"
                        onClick={() => {
                          setBlogForm({
                            id: blog._id,
                            title: blog.title,
                            content: blog.content || '',
                            tags: blog.tags.join(', '),
                            status: blog.status,
                            isLinkedIn: blog.isLinkedIn || false,
                            linkedInUrl: blog.linkedInUrl || '',
                            publishedAt: blog.publishedAt || ''
                          });
                          setBlogFile1(null);
                          setBlogFile2(null);
                          setBlogFile3(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="glass-button px-3 py-1.5 text-xs text-accent-pink border-accent-pink/30 hover:bg-accent-pink/10 cursor-none"
                        onClick={() => deleteBlog(blog._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Custom Glassmorphic Modal for Notifications & Confirmations */}
      <Modal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        showCancel={modalConfig.showCancel}
        onConfirm={modalConfig.onConfirm}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
};

export default AdminDashboard;
