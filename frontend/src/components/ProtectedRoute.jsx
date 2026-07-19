import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <div className="loader"></div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
