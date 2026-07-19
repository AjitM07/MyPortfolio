import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <div className="flex justify-center items-center min-h-[70vh] px-4 py-10">
      <div className="w-full max-w-md p-8 glass-panel rounded-lg">
        <h2 className="text-center text-3xl font-extrabold mb-8 gradient-text text-glow">Admin Login</h2>

        {error && (
          <div className="bg-accent-pink/10 border border-accent-pink/20 text-accent-pink p-3 rounded-lg text-sm text-center mb-6 text-glow">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm uppercase font-semibold text-text-secondary">Username</label>
            <input
              type="text"
              id="username"
              className="glass-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm uppercase font-semibold text-text-secondary">Password</label>
            <input
              type="password"
              id="password"
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="glass-button active w-full mt-2.5 justify-center text-base"
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
