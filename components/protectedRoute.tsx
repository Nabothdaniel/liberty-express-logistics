// src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Plane } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-[#F7F6F2] flex-col gap-4">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute w-16 h-16 border-4 border-[#8A5A44] rounded-full border-t-transparent animate-spin"></div>
          <Plane className="w-6 h-6 text-[#8A5A44] absolute animate-pulse" />
        </div>
        <span className="text-gray-500 font-bold text-xs uppercase tracking-widest animate-pulse">Loading</span>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
