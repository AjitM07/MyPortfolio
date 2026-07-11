import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#030616',
        color: '#00f0ff',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textShadow: '0 0 10px rgba(0, 240, 255, 0.5)'
      }}>
        Loading Secure Session...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
