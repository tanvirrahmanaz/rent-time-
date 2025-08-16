import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const heroCardsData = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white mb-3" fill="none" viewBox="0 0 24 24" 
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        title: 'I need a roommate',
        description: 'Create a listing to find your ideal roommate and share living expenses.',
        buttonText: 'Find Roommate',
        route: '/roommate',
        gradient: 'from-violet-500 to-purple-600',
        hoverGradient: 'from-violet-600 to-purple-700'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white mb-3" fill="none" viewBox="0 0 24 24" 
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
        title: 'I need a room',
        description: 'Browse thousands of verified rooms and apartments in your area.',
        buttonText: 'Find House',
        route: '/house',
        gradient: 'from-blue-500 to-cyan-600',
        hoverGradient: 'from-blue-600 to-cyan-700'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white mb-3" fill="none" viewBox="0 0 24 24" 
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        ),
        title: 'Add my vacant place',
        description: 'List your empty room or flat for rent and earn extra income.',
        buttonText: 'Post Ads',
        route: '/create-post',
        gradient: 'from-emerald-500 to-teal-600',
        hoverGradient: 'from-emerald-600 to-teal-700'
    },
];

const HeroSection = () => {
    const navigate = useNavigate();

    const handleCardClick = (route) => {
        navigate(route);
    };

    const handleExploreProperties = () => {
        navigate('/house');
    };

    const handleLearnMore = () => {
        // Scroll to about section or navigate to about page
        const aboutSection = document.getElementById('about-section');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/about');
        }
    };

    return (
        <section 
            className="relative bg-cover bg-center text-white min-h-[60vh] overflow-hidden flex items-center" 
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')" 
            }}
        >
            {/* Enhanced Dark Overlay with Dynamic Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-indigo-900/80 to-purple-900/85"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5" 
                 style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
                 }}>
            </div>
            
            {/* Content */}
            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Column - Enhanced Typography */}
                    <div className="text-center lg:text-left space-y-10">
                        <div className="space-y-6">
                            <div className="inline-block">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text text-sm font-bold tracking-wider uppercase mb-4 animate-pulse">
                                    ✨ Premium Housing Platform
                                </span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                                <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 text-transparent bg-clip-text drop-shadow-2xl">
                                    Rent Time
                                </span>
                                <span className="block text-2xl md:text-3xl lg:text-4xl font-light text-gray-200 mt-3 drop-shadow-lg">
                                    Home Renting Made Simple
                                </span>
                            </h1>
                        </div>
                        
                        <p className="text-xl text-gray-200 max-w-2xl leading-relaxed drop-shadow-md">
                            Discover the most intuitive way to find roommates, explore rooms, or showcase your vacant space. 
                            Your perfect home awaits with just one click.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                            <button 
                                onClick={handleExploreProperties}
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl font-bold text-white shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Explore Properties
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                            </button>
                            
                            <button 
                                onClick={handleLearnMore}
                                className="group px-8 py-4 border-2 border-white/40 rounded-xl font-bold text-white backdrop-blur-lg bg-white/10 hover:bg-white/20 hover:border-white/60 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500"
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Learn More
                                </span>
                            </button>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                            <div className="text-center">
                                <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                    5K+
                                </div>
                                <div className="text-sm text-gray-300 font-medium">Properties</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                                    2K+
                                </div>
                                <div className="text-sm text-gray-300 font-medium">Happy Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black bg-gradient-to-r from-pink-400 to-red-400 text-transparent bg-clip-text">
                                    98%
                                </div>
                                <div className="text-sm text-gray-300 font-medium">Satisfaction</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column - Enhanced Interactive Cards */}
                    <div className="flex flex-col space-y-6">
                        {heroCardsData.map((card, index) => (
                            <div 
                                key={index} 
                                onClick={() => handleCardClick(card.route)}
                                className="group relative bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 hover:border-white/40 transform hover:-translate-y-3 hover:rotate-1 hover:shadow-purple-500/20 transition-all duration-700 cursor-pointer overflow-hidden"
                            >
                                {/* Animated Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-all duration-700 rounded-3xl`}></div>
                                
                                {/* Floating Elements */}
                                <div className="absolute top-4 right-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-all duration-500">
                                    <div className={`w-full h-full bg-gradient-to-br ${card.gradient} rounded-full transform rotate-45 group-hover:rotate-90 transition-transform duration-700`}></div>
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-start space-x-5">
                                        <div className={`flex-shrink-0 p-4 bg-gradient-to-br ${card.gradient} rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                            {card.icon}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-100 transition-colors duration-500">
                                                {card.title}
                                            </h3>
                                            <p className="text-white/80 text-base leading-relaxed mb-6 group-hover:text-white transition-colors duration-500">
                                                {card.description}
                                            </p>
                                            
                                            <button className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${card.gradient} hover:${card.hoverGradient} text-white font-bold rounded-2xl transform hover:scale-110 hover:-rotate-2 transition-all duration-500 shadow-lg hover:shadow-2xl group-hover:shadow-purple-500/30`}>
                                                <span className="mr-3">{card.buttonText}</span>
                                                <svg className="w-5 h-5 transform group-hover:translate-x-2 group-hover:scale-125 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} blur-xl opacity-20 rounded-3xl`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Enhanced Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;