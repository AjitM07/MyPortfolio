import { createContext, useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        setAuthToken(token);
        try {
          const res = await api.get('/auth/verify');
          if (res.data.authenticated) {
            setAdmin(res.data.admin);
          } else {
            localStorage.removeItem('adminToken');
            setAuthToken(null);
          }
        } catch (err) {
          console.error('Session validation failed:', err.message);
          localStorage.removeItem('adminToken');
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token, admin: adminData } = res.data;
    localStorage.setItem('adminToken', token);
    setAuthToken(token);
    setAdmin(adminData);
    return adminData;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAuthToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
