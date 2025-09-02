// path: src/components/Routes/AdminRoute.jsx
import { isAdminEmail } from '../../utils/isAdmin'; // ✅ সঠিক কেস/পাথ
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  // ✅ ইমেইল দিয়ে চেক করো
  if (currentUser && isAdminEmail(currentUser.email)) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
