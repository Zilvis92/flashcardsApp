import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  // If there is no user, we send to login
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;