import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

// 1. Context তৈরি করুন
const AuthContext = createContext();

// 2. একটি কাস্টম হুক তৈরি করুন যা দিয়ে সহজে Context ব্যবহার করা যাবে
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Provider কম্পোনেন্ট তৈরি করুন (মূল লজিক এখানে থাকবে)
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // auth স্টেট লোড হচ্ছে কিনা তা ট্র্যাক করার জন্য

    // সাইন-আপ ফাংশন
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // লগইন ফাংশন
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // লগআউট ফাংশন
    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        // onAuthStateChanged লিসেনারটি এখানে সেন্ট্রালি ম্যানেজ করা হবে
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch user data from your backend or Firebase Database to get the role
                const response = await fetch(`/api/users/${user.uid}`); // Adjust the API path accordingly
                const userData = await response.json();
                setCurrentUser({ ...user, role: userData.role });
            } else {
                setCurrentUser(null);
            }
            setLoading(false); // অথেনটিকেশন চেক করা শেষ
        });

        // কম্পোনেন্ট আনমাউন্ট হলে লিসেনারটি বন্ধ করে দিন (মেমোরি লিক রোধ করার জন্য)
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        signup,
        login,
        logout
    };

    // লোডিং শেষ না হওয়া পর্যন্ত কোনো চাইল্ড কম্পোনেন্ট রেন্ডার করা হবে না
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
