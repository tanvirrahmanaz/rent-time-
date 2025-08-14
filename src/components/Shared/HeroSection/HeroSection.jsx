import React from 'react';

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
        description: 'Create a listing to find your ideal roommate.',
        buttonText: 'Find Roommate',
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
        description: 'Browse thousands of rooms and apartments.',
        buttonText: 'Find House',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white mb-3" fill="none" viewBox="0 0 24 24" 
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        ),
        title: 'Add my vacant place',
        description: 'List your empty room or flat for rent.',
        buttonText: 'Post Ads',
    },
];

const HeroSection = () => {
    return (
        <section 
            className="relative bg-cover bg-center text-white min-h-[600px] overflow-hidden flex items-center" 
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')" 
            }}
        >
            {/* Enhanced Dark Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80"></div>
            
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" 
                 style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                 }}>
            </div>
            
            {/* Content */}
            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Column - Enhanced Typography */}
                    <div className="text-center lg:text-left space-y-8">
                        <div>
                            <div className="inline-block bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase mb-4">
                                Premium Housing Platform
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                                <span className="block bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                                    Rent Time
                                </span>
                                <span className="block text-2xl md:text-3xl lg:text-4xl font-light text-gray-300 mt-2">
                                    Home Renting Made Simple
                                </span>
                            </h1>
                        </div>
                        
                        <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                            Discover the most intuitive way to find roommates, explore rooms, or showcase your vacant space. 
                            Your perfect home awaits with just one click.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                <span className="relative z-10">Explore Properties</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            
                            <button className="px-8 py-4 border-2 border-white/30 rounded-xl font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                                Learn More
                            </button>
                        </div>
                    </div>
                    
                    {/* Right Column - Enhanced Cards */}
                    <div className="flex flex-col space-y-6">
                        {heroCardsData.map((card, index) => (
                            <div 
                                key={index} 
                                className="group relative bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-white/10 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                            >
                                {/* Card Background Pattern */}
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                                    <div className="w-full h-full bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                                            {card.icon}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors duration-300">
                                                {card.title}
                                            </h3>
                                            <p className="text-white/90 text-sm leading-relaxed mb-4 group-hover:text-white transition-colors duration-300">
                                                {card.description}
                                            </p>
                                            
                                            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 border-0 group-hover:shadow-lg">
                                                {card.buttonText}
                                                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
        </section>
    );
};

export default HeroSection;