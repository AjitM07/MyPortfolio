import { useState, useEffect } from 'react';
import api from '../../utils/api';

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
  const [blogForm, setBlogForm] = useState({ id: '', title: '', content: '', tags: '', status: 'draft', isLinkedIn: false, linkedInUrl: '' });
  const [blogFile, setBlogFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchExperiences();
    fetchProjects();
    fetchSkills();
    fetchCertifications();
    fetchBlogs();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
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
      showMessage('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      showMessage('Error updating profile');
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
        showMessage('Experience updated!');
      } else {
        await api.post('/experiences', body);
        showMessage('Experience added!');
      }
      setExpForm({ id: '', company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '', technologies: '', order: 0 });
      fetchExperiences();
    } catch (err) {
      console.error(err);
      showMessage('Error saving experience');
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await api.delete(`/experiences/${id}`);
      showMessage('Experience deleted');
      fetchExperiences();
    } catch (err) {
      console.error(err);
    }
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
        showMessage('Project updated!');
      } else {
        await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showMessage('Project added!');
      }
      setProjectForm({ id: '', title: '', subtitle: '', description: '', technologies: '', githubLink: '', liveLink: '', category: 'Web Development', order: 0 });
      setProjectFile(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
      showMessage('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      showMessage('Project deleted');
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
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
        showMessage('Skill updated!');
      } else {
        await api.post('/skills', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showMessage('Skill added!');
      }
      setSkillForm({ id: '', name: '', category: 'Languages', level: 80 });
      fetchSkills();
    } catch (err) {
      console.error(err);
      showMessage('Error saving skill');
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      showMessage('Skill deleted');
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
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
        showMessage('Certification updated!');
      } else {
        await api.post('/certifications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showMessage('Certification added!');
      }
      setCertForm({ id: '', name: '', issuingOrganization: '', issueDate: '', credentialUrl: '', order: 0 });
      setCertFile(null);
      fetchCertifications();
    } catch (err) {
      console.error(err);
      showMessage('Error saving certification');
    } finally {
      setLoading(false);
    }
  };

  const deleteCert = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await api.delete(`/certifications/${id}`);
      showMessage('Certification deleted');
      fetchCertifications();
    } catch (err) {
      console.error(err);
    }
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
      if (blogFile) fd.append('image', blogFile);

      if (blogForm.id) {
        await api.put(`/blogs/${blogForm.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showMessage('Blog post updated!');
      } else {
        await api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showMessage('Blog post added!');
      }
      setBlogForm({ id: '', title: '', content: '', tags: '', status: 'draft', isLinkedIn: false, linkedInUrl: '' });
      setBlogFile(null);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      showMessage('Error saving blog');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      showMessage('Blog deleted');
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-8 z-10 relative">
      <h1 className="text-4xl font-extrabold text-center tracking-wide gradient-text text-glow">Admin Dashboard</h1>

      {message && (
        <div className="bg-accent-blue/10 border border-accent-blue/20 text-accent-blue p-4 rounded-xl font-medium text-center animate-pulse-glow">
          {message}
        </div>
      )}

      {/* Tabs Controller */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
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
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold gradient-text mb-2">Edit Personal Profile</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Name</label>
                <input
                  type="text"
                  className="glass-input"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Title</label>
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
              <label className="text-xs font-semibold text-text-secondary">Bio (About Section)</label>
              <textarea
                className="glass-input resize-vertical"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={6}
                required
              />
            </div>

            <h3 className="text-lg font-bold mt-4 border-b border-border-glass pb-2 text-text-primary">Files & Documents</h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Profile Image (About Photo)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="glass-input"
                  onChange={(e) => setAboutImageFile(e.target.files[0])}
                />
                {profile.aboutImage?.url && (
                  <span className="text-xs text-text-secondary mt-1">
                    Current: <a href={profile.aboutImage.url} target="_blank" rel="noreferrer" className="text-accent-blue cursor-none">View Image</a>
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Resume (PDF File)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  className="glass-input"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                {profile.resumeUrl?.url && (
                  <span className="text-xs text-text-secondary mt-1">
                    Current: <a href={profile.resumeUrl.url} target="_blank" rel="noreferrer" className="text-accent-blue cursor-none">View PDF</a>
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold mt-4 border-b border-border-glass pb-2 text-text-primary">Social Links</h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">GitHub Link</label>
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
              <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">LinkedIn Link</label>
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
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Twitter Link</label>
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
              <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Instagram Link</label>
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
              <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Email Address</label>
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
            </div>

            <button type="submit" className="glass-button active w-full mt-4 justify-center" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
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
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Location</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={expForm.location}
                    onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Order (Sorting)</label>
                  <input
                    type="number"
                    className="glass-input"
                    value={expForm.order}
                    onChange={(e) => setExpForm({ ...expForm, order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Start Date</label>
                  <input
                    type="date"
                    className="glass-input"
                    value={expForm.startDate ? expForm.startDate.split('T')[0] : ''}
                    onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">End Date</label>
                  <input
                    type="date"
                    className="glass-input"
                    value={expForm.endDate && !expForm.current ? expForm.endDate.split('T')[0] : ''}
                    onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                    disabled={expForm.current}
                  />
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

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  className="glass-input"
                  value={expForm.technologies}
                  onChange={(e) => setExpForm({ ...expForm, technologies: e.target.value })}
                  placeholder="React, Node.js, Express"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="glass-button active flex-1 justify-center" disabled={loading}>
                  {expForm.id ? 'Update' : 'Add'}
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

            <div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold gradient-text">Existing Experiences</h2>
              {experiences.map((exp) => (
                <div key={exp._id} className="flex justify-between items-center p-5 gap-4 glass-panel rounded-xl">
                  <div>
                    <h4 className="text-base font-semibold text-white">{exp.role} @ {exp.company}</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Order: {exp.order} | {exp.current ? 'Current' : 'Past'}
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
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Order</label>
                  <input
                    type="number"
                    className="glass-input"
                    value={projectForm.order}
                    onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Project Screenshot Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="glass-input"
                    onChange={(e) => setProjectFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="glass-button active flex-1 justify-center" disabled={loading}>
                  {projectForm.id ? 'Update' : 'Add'}
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

            <div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold gradient-text">Existing Projects</h2>
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
                <div className="flex-grow flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Level (Proficiency %)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="glass-input"
                    value={skillForm.level}
                    onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="glass-button active flex-1 justify-center" disabled={loading}>
                  {skillForm.id ? 'Update' : 'Add'}
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

            <div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold gradient-text">Existing Skills</h2>
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

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Issue Date</label>
                  <input
                    type="date"
                    className="glass-input"
                    value={certForm.issueDate ? certForm.issueDate.split('T')[0] : ''}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Order</label>
                  <input
                    type="number"
                    className="glass-input"
                    value={certForm.order}
                    onChange={(e) => setCertForm({ ...certForm, order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Credential Verification URL</label>
                  <input
                    type="url"
                    className="glass-input"
                    value={certForm.credentialUrl}
                    onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Certificate File (Image or PDF)</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="glass-input"
                    onChange={(e) => setCertFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="glass-button active flex-1 justify-center" disabled={loading}>
                  {certForm.id ? 'Update' : 'Add'}
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

            <div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold gradient-text">Existing Certifications</h2>
              {certifications.map((cert) => (
                <div key={cert._id} className="flex justify-between items-center p-5 gap-4 glass-panel rounded-xl">
                  <div>
                    <h4 className="text-base font-semibold text-white">{cert.name}</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Org: {cert.issuingOrganization} | Order: {cert.order}
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
        )}

        {/* Tab 6: Blogs */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
            <form onSubmit={handleBlogSubmit} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold gradient-text">{blogForm.id ? 'Edit' : 'Add'} Blog Post</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Title</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
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

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                    placeholder="React, CSS, Coding"
                  />
                </div>
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Featured Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="glass-input"
                    onChange={(e) => setBlogFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="glass-button active flex-1 justify-center" disabled={loading}>
                  {blogForm.id ? 'Update' : 'Add'}
                </button>
                {blogForm.id && (
                  <button
                    type="button"
                    className="glass-button"
                    onClick={() => setBlogForm({ id: '', title: '', content: '', tags: '', status: 'draft', isLinkedIn: false, linkedInUrl: '' })}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold gradient-text">Existing Blogs</h2>
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
                      onClick={() => setBlogForm({
                        id: blog._id,
                        title: blog.title,
                        content: blog.content || '',
                        tags: blog.tags.join(', '),
                        status: blog.status,
                        isLinkedIn: blog.isLinkedIn || false,
                        linkedInUrl: blog.linkedInUrl || ''
                      })}
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
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
