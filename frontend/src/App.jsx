import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';

// Pages
import Home from './pages/Home';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import ProjectReadme from './pages/ProjectReadme';
import Skills from './pages/Skills';
import Certifications from './pages/Certifications';
import Blogs from './pages/Blogs';
import Resume from './pages/Resume';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Custom cursor dot + ring follow delay */}
        <CustomCursor />

        {/* Interactive Particle Background on every page */}
        <ParticleBackground />
        
        {/* Sleek Glassmorphic Navbar */}
        <Navbar />

        {/* Main Routing Container */}
        <main className="relative z-1 flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id/readme" element={<ProjectReadme />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<Blogs />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Admin Dashboard */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        {/* Glassmorphic Footer */}
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
