// src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
