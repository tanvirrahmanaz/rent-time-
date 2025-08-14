import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase.config'; // আপনার Firebase কনফিগারেশন ফাইল

const Navbar = () => {
    // State for mobile menu toggle
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // State for user dropdown menu toggle
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    // State to hold the current logged-in user
    const [currentUser, setCurrentUser] = useState(null);
    // State to handle the initial auth check loading
    const [loading, setLoading] = useState(true);

    // --- Authentication State Listener ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false); // Auth check is complete
        });
        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    // --- Logout Function ---
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsUserMenuOpen(false);
            setIsMobileMenuOpen(false); // Also close mobile menu on logout
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    // --- Navigation Links Data ---
    const navLinks = [
        { to: '/', text: 'Home' },
        { to: '/roommate', text: 'Roommate' },
        { to: '/house',text: 'House' },
        { to: '/blog', text: 'Blog' },
    ];

    // --- Placeholder for Auth buttons while loading ---
    const AuthPlaceholder = () => (
        <div className="flex items-center space-x-4">
             <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
             <div className="h-11 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
    );

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Left Side: Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-3 group">
                             <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                                <div className="relative bg-gradient-to-r from-slate-700 to-slate-800 p-2 rounded-lg">
                                    <svg className="h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <span className="font-black text-2xl bg-gradient-to-r from-slate-700 to-slate-900 text-transparent bg-clip-text">
                                    RentTime
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-1 bg-gray-100/80 rounded-full p-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.text}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `text-gray-600 hover:text-slate-800 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-white shadow-sm text-slate-900' : 'hover:bg-white/60'}`
                                    }
                                >
                                    {link.text}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Action Buttons or User Avatar */}
                    <div className="hidden md:flex items-center space-x-4">
                        {loading ? <AuthPlaceholder /> : currentUser ? (
                            <div className="relative">
                                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="focus:outline-none rounded-full">
                                    
                                    {currentUser.photoURL ? (
                                        <img src={currentUser.photoURL} alt="Profile" className="w-11 h-11 rounded-full border-2 border-emerald-500 p-0.5 object-cover" />
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg border-2 border-emerald-600">
                                            {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-1 z-20 border border-gray-100">
                                        <div className="px-4 py-3 border-b flex items-center space-x-3">
                                            {currentUser.photoURL ? <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">{currentUser.displayName?.charAt(0).toUpperCase() || 'U'}</div>}
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.displayName || 'User'}</p>
                                                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                                            </div>
                                        </div>
                                        <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-slate-700 font-semibold text-sm px-6 py-3">Login</Link>
                                <Link to="/signup" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:shadow-lg transition-all">Sign Up</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} type="button" className="bg-gray-50 hover:bg-gray-100 inline-flex items-center justify-center p-3 rounded-xl text-gray-600">
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
            <div className={`md:hidden transition-all duration-300 ease-in-out border-t border-gray-200 ${isMobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0 py-0 opacity-0 overflow-hidden'}`}>
                <div className="px-2 space-y-1 sm:px-3">
                    {navLinks.map((link) => (
                         <NavLink key={link.text} to={link.to} onClick={() => setIsMobileMenuOpen(false)} className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                            {link.text}
                        </NavLink>
                    ))}
                </div>
                {/* Mobile login/signup or user info */}
                <div className="px-4 mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {loading ? <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full"></div> : currentUser ? (
                         <div className="space-y-3">
                             <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                                 {currentUser.photoURL ? <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover"/> : <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">{currentUser.displayName?.charAt(0).toUpperCase() || 'U'}</div>}
                                 <div>
                                     <p className="font-semibold text-gray-800">{currentUser.displayName || 'Dashboard'}</p>
                                     <p className="text-xs text-gray-500">View Profile</p>
                                 </div>
                             </Link>
                            <button onClick={handleLogout} className="w-full text-center bg-red-50 text-red-600 px-4 py-3 rounded-xl text-base font-semibold">Logout</button>
                         </div>
                    ) : (
                         <>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center text-gray-600 hover:text-slate-700 hover:bg-gray-50 px-4 py-3 rounded-xl text-base font-semibold">Login</Link>
                            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-xl text-base font-semibold shadow-lg">Sign Up</Link>
                         </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;