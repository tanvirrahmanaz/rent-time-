import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isAdminEmail } from '../../utils/isAdmin'; // 1. নাম পরিবর্তন করে isAdminCheck করুন

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // অথবা একটি স্পিনার
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (adminOnly && !isAdminEmail(currentUser)) { // 2. এখানে currentUser পাস করুন
        // যদি এটি অ্যাডমিন রুট হয় এবং ব্যবহারকারী অ্যাডমিন না হয়
        return <Navigate to="/" replace />; // হোমপেইজে পাঠিয়ে দিন
    }

    return children;
};

export default PrivateRoute;