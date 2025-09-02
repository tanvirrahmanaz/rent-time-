import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isAdminEmail } from '../../utils/isAdmin'; // নতুন ফাংশন ইমপোর্ট করুন

const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    // currentUser.role এর পরিবর্তে isAdminCheck(currentUser) ব্যবহার করুন
    if (currentUser && isAdminEmail(currentUser)) {
        return children;
    }

    // যদি অ্যাডমিন না হয়, হোমপেইজে পাঠিয়ে দিন
    return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;