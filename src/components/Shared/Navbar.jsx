import React, { useState } from 'react';
// react-router-dom ব্যবহার করলে <a> এর বদলে Link ব্যবহার করতে পারেন
// import { Link } from 'react-router-dom'; 

const Navbar = () => {
    // মোবাইল মেন্যু খোলা বা বন্ধ করার জন্য State
    const [isOpen, setIsOpen] = useState(false);

    // নেভিগেশন লিঙ্কগুলোর জন্য একটি অ্যারে (সহজে পরিবর্তনের জন্য)
    const navLinks = [
        { href: '#', text: 'Home' },
        { href: '#', text: 'Roommate' },
        { href: '#', text: 'House' },
        { href: '#', text: 'Blog' },
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* বাম পাশ: লোগো */}
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center space-x-2">
                            {/*  */}
                            <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-bold text-xl text-gray-800">RentTime</span>
                        </a>
                    </div>

                    {/* মাঝখানের অংশ: ডেস্কটপ এবং ট্যাবলেট মেন্যু */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <a 
                                    key={link.text} 
                                    href={link.href} 
                                    className="text-gray-700 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    {link.text}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ডান পাশ: লগইন/সাইনআপ বাটন (ডেস্কটপ) */}
                    <div className="hidden md:flex items-center space-x-2">
                        <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium text-sm px-4 py-2">Login</a>
                        <a href="#" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300">
                            Sign Up
                        </a>
                    </div>
                    
                    {/* মোবাইল মেন্যু বাটন (হ্যামবার্গার) */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-600 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* মোবাইল মেন্যু (শর্তসাপেক্ষে রেন্ডারিং) */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((link) => (
                        <a 
                            key={link.text} 
                            href={link.href} 
                            className="text-gray-700 hover:bg-indigo-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        >
                            {link.text}
                        </a>
                    ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="px-2 space-y-2">
                         <a href="#" className="block w-full text-left text-gray-700 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-base font-medium">Login</a>
                         <a href="#" className="block w-full text-center bg-indigo-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700">Sign Up</a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;