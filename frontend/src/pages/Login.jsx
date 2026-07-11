import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return setError('Please enter username and password');
    }

    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card glass-panel">
        <h2 className="login-title gradient-text text-glow">Admin Portal</h2>
        
        {error && <div className="login-error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="glass-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="glass-button active submit-btn" 
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
