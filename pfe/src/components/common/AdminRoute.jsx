import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute;