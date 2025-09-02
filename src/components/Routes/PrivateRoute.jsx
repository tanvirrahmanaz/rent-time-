import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // অথবা একটি স্পিনার
    }

    if (currentUser) {
        // যদি ইউজার লগইন করা থাকে, তাহলে পেইজটি দেখান
        return children;
    }

    // যদি লগইন করা না থাকে, তাহলে লগইন পেইজে পাঠিয়ে দিন
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;