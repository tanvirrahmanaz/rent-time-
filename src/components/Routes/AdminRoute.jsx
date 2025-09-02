import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Show a loading spinner or message while loading
        return <div>Loading...</div>;
    }

    if (currentUser && currentUser.role === 'admin') {
        // If the user is an admin, show the admin page
        return children;
    }

    // If the user doesn't have admin privileges, redirect to the home page
    return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
