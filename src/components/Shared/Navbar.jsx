import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const navLinks = [
        { href: '#', text: 'Home' },
        { href: '#', text: 'Roommate' },
        { href: '#', text: 'House' },
        { href: '#', text: 'Blog' },
    ];

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* বাম পাশ: Enhanced Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                                <div className="relative bg-gradient-to-r from-slate-600 to-slate-700 p-2 rounded-lg">
                                    <svg className="h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <span className="font-black text-2xl bg-gradient-to-r from-slate-700 to-slate-900 text-transparent bg-clip-text">
                                    RentTime
                                </span>
                                <div className="text-xs text-gray-500 -mt-1">
                                    Housing Solutions
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* মাঝখানের অংশ: Modern Navigation */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-1 bg-gray-50 rounded-2xl p-2">
                            {navLinks.map((link, index) => (
                                <a 
                                    key={link.text} 
                                    href={link.href} 
                                    className={`relative text-gray-600 hover:text-slate-700 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                                        index === 0 ? 'bg-white shadow-sm text-slate-700' : 'hover:bg-white/60'
                                    }`}
                                >
                                    <span className="relative z-10">{link.text}</span>
                                    {index === 0 && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl opacity-50"></div>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ডান পাশ: Enhanced Action Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <a 
                            href="#" 
                            className="text-gray-600 hover:text-slate-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                        >
                            Login
                        </a>
                        <a 
                            href="#" 
                            className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center">
                                Sign Up
                                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </a>
                    </div>
                    
                    {/* Modern Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="relative bg-gray-50 hover:bg-gray-100 inline-flex items-center justify-center p-3 rounded-xl text-gray-600 hover:text-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        >
                            <span className="sr-only">Open main menu</span>
                            <div className="relative w-6 h-6">
                                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
                                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-2.5'}`}></span>
                                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : 'top-4'}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Enhanced Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="bg-white/95 backdrop-blur-md border-t border-gray-100">
                    <div className="px-4 pt-4 pb-3 space-y-2">
                        {navLinks.map((link, index) => (
                            <a 
                                key={link.text} 
                                href={link.href} 
                                className={`block text-gray-600 hover:text-slate-700 hover:bg-gray-50 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                                    index === 0 ? 'bg-gray-50 text-slate-700' : ''
                                }`}
                            >
                                {link.text}
                            </a>
                        ))}
                    </div>
                    
                    <div className="px-4 py-4 border-t border-gray-100 space-y-3">
                        <a 
                            href="#" 
                            className="block text-center text-gray-600 hover:text-slate-700 hover:bg-gray-50 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
                        >
                            Login
                        </a>
                        <a 
                            href="#" 
                            className="block text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-xl text-base font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                        >
                            Sign Up
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;