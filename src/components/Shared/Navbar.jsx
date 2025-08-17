import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase.config'; // আপনার Firebase কনফিগারেশন ফাইল

const UserAvatar = ({ user, className = 'w-12 h-12' }) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [user]);

    const handleImageError = () => {
        setImageError(true);
    };

    if (user && user.photoURL && !imageError) {
        return (
            <img
                src={user.photoURL}
                alt="Profile"
                className={`rounded-full object-cover shadow-lg ${className}`}
                onError={handleImageError}
            />
        );
    }

    return (
        <div className={`rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ${className}`}>
            {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
    );
};


const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const userMenuRef = useRef(null);

    // --- Authentication State Listener ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- Click outside handler for user dropdown ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Logout Function ---
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsUserMenuOpen(false);
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    // --- Navigation Links Data ---
    const publicNavLinks = [
        { to: '/', text: 'Home' },
        { to: '/house', text: 'Houses' },
        { to: '/roommates', text: 'Roommates' },
        { to: '/blog', text: 'Blog' },
    ];
    
    const privateNavLinks = [
        { to: '/create-post', text: 'Create Post' },
        { to: '/dashboard', text: 'Dashboard' },
    ];

    // --- Placeholder for Auth buttons while loading ---
    const AuthPlaceholder = () => (
        <div className="flex items-center space-x-4">
             <div className="h-11 w-20 bg-slate-200 rounded-full animate-pulse"></div>
             <div className="h-11 w-28 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
    );

    return (
        <nav className="bg-white/98 backdrop-blur-lg shadow-xl border-b border-slate-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left Side: Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-3 group">
                             <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-3 rounded-xl shadow-lg">
                                    <svg className="h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <span className="font-bold text-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-transparent bg-clip-text tracking-tight">
                                    RentTime
                                </span>
                                <p className="text-xs text-slate-500 -mt-1">Find Your Perfect Space</p>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-2 bg-slate-100/70 rounded-2xl p-2 backdrop-blur-sm">
                            {publicNavLinks.map((link) => (
                                <NavLink 
                                    key={link.text} 
                                    to={link.to} 
                                    className={({ isActive }) => 
                                        `text-slate-700 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                                            isActive 
                                                ? 'bg-white shadow-lg text-slate-900 border border-slate-200/50' 
                                                : 'hover:bg-white/70 hover:shadow-md'
                                        }`
                                    }
                                >
                                    {link.text}
                                </NavLink>
                            ))}
                            {currentUser && privateNavLinks.map((link) => (
                                <NavLink 
                                    key={link.text} 
                                    to={link.to} 
                                    className={({ isActive }) => 
                                        `text-slate-700 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                                                : 'hover:bg-white/70 hover:shadow-md'
                                        }`
                                    }
                                >
                                    {link.text}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Action Buttons or User Avatar */}
                    <div className="hidden md:flex items-center space-x-4">
                        {loading ? (
                            <AuthPlaceholder />
                        ) : currentUser ? (
                            <div className="relative" ref={userMenuRef}>
                                <button 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                                    className="focus:outline-none rounded-full relative group"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                                    <div className="relative">
                                        <UserAvatar user={currentUser} />
                                    </div>
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl py-2 z-20 border border-slate-200/50 backdrop-blur-lg">
                                        <div className="px-4 py-4 border-b border-slate-100 flex items-center space-x-3">
                                            <UserAvatar user={currentUser} className="w-12 h-12" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.displayName || 'User'}</p>
                                                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="py-2">
                                            <Link 
                                                to="/dashboard" 
                                                onClick={() => setIsUserMenuOpen(false)} 
                                                className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                                Dashboard
                                            </Link>
                                            
                                            <button 
                                                onClick={handleLogout} 
                                                className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link 
                                    to="/login" 
                                    className="text-slate-700 hover:text-slate-900 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-slate-100 transition-all duration-300"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            type="button" 
                            className="bg-slate-100 hover:bg-slate-200 inline-flex items-center justify-center p-3 rounded-xl text-slate-700 transition-all duration-300"
                        >
                            <span className="sr-only">Open main menu</span>
                            <div className="relative w-6 h-6">
                                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 top-3' : 'top-1.5'}`}></span>
                                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'top-3'}`}></span>
                                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 top-3' : 'top-4.5'}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Mobile Menu Panel --- */}
            <div className={`md:hidden transition-all duration-500 ease-in-out border-t border-slate-200/50 backdrop-blur-lg ${isMobileMenuOpen ? 'max-h-screen py-6 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'}`}>
                <div className="px-4 space-y-2">
                    {publicNavLinks.map((link) => (
                         <NavLink 
                            key={link.text} 
                            to={link.to} 
                            onClick={() => setIsMobileMenuOpen(false)} 
                            className={({isActive}) => 
                                `block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                                        : 'text-slate-700 hover:bg-slate-100'
                                }`
                            }
                        >
                            {link.text}
                        </NavLink>
                    ))}
                    
                    {currentUser && <div className="border-t border-slate-200 my-4"></div>}
                    
                    {currentUser && privateNavLinks.map((link) => (
                         <NavLink 
                            key={link.text} 
                            to={link.to} 
                            onClick={() => setIsMobileMenuOpen(false)} 
                            className={({isActive}) => 
                                `block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                                        : 'text-slate-700 hover:bg-slate-100'
                                }`
                            }
                        >
                            {link.text}
                        </NavLink>
                    ))}
                </div>

                <div className="px-4 mt-6 pt-4 border-t border-slate-200 space-y-4">
                    {loading ? (
                        <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-full"></div>
                    ) : currentUser ? (
                         <div className="space-y-4">
                             <Link 
                                to="/dashboard" 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-300"
                            >
                                <UserAvatar user={currentUser} className="w-12 h-12" />
                                 <div className="flex-1 min-w-0">
                                     <p className="font-semibold text-slate-900 truncate">{currentUser.displayName || 'Dashboard'}</p>
                                     <p className="text-sm text-slate-500 truncate">View your dashboard</p>
                                 </div>
                             </Link>
                            
                            <button 
                                onClick={handleLogout} 
                                className="w-full text-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl text-base font-semibold shadow-lg transition-all duration-300"
                            >
                                Logout
                            </button>
                         </div>
                    ) : (
                         <div className="space-y-3">
                            <Link 
                                to="/login" 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="block text-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="block text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl text-base font-semibold shadow-lg transition-all duration-300"
                            >
                                Sign Up
                            </Link>
                         </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
