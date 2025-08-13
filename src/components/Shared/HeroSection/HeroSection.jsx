import React from 'react';

// কার্ডের ডেটা এবং আইকনগুলো এখানে সহজে পরিবর্তনের জন্য রাখা হলো
const heroCardsData = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        title: 'I need a roommate',
        description: 'Create a listing to find your ideal roommate.',
        buttonText: 'Find Roommate',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
        title: 'I need a room',
        description: 'Browse thousands of rooms and apartments.',
        buttonText: 'Find House',
    },
    {
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        <section className="relative bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')" }}>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Column: Text Content */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                            Rent Time - Home Renting Made Simple
                        </h1>
                        <p className="mt-6 text-lg text-gray-300 max-w-lg mx-auto md:mx-0">
                            Discover the easiest way to find roommates, rooms, or list your vacant space. Your next home is just a click away.
                        </p>
                        <a href="#" className="mt-8 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                            Explore More
                        </a>
                    </div>

                    {/* Right Column: Action Cards */}
                    <div className="flex flex-col space-y-4">
                        {heroCardsData.map((card, index) => (
                            <div key={index} className="bg-[#004d40]/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="text-center">
                                    {card.icon}
                                    <h3 className="text-xl font-semibold mt-2">{card.title}</h3>
                                    <p className="text-gray-300 text-sm mt-2">{card.description}</p>
                                    <button className="mt-4 bg-white text-gray-800 font-semibold py-2 px-5 rounded-md hover:bg-gray-200 transition duration-300">
                                        {card.buttonText}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;