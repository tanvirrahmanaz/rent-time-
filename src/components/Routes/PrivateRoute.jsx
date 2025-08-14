import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // অথবা একটি স্পিনার দেখাতে পারেন
    }

    if (!currentUser) {
        // যদি ইউজার লগইন করা না থাকে, তাহলে তাকে লগইন পেইজে পাঠিয়ে দিন
        // state={{ from: location }} ব্যবহার করা হয়েছে যাতে লগইন করার পর আগের পেইজে ফিরে আসতে পারে
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // যদি ইউজার লগইন করা থাকে, তাহলে তাকে কাঙ্ক্ষিত পেইজটি দেখান
    return children;
};

export default PrivateRoute;