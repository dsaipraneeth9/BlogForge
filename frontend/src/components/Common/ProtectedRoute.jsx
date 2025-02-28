import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { token, loading, user } = useContext(AuthContext);
  console.log('ProtectedRoute - Token:', token, 'Loading:', loading, 'User:', user);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute