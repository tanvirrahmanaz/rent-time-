import React from 'react';

// স্ট্যাটিক ডেটা, যা আপনি পরে API থেকে আনতে পারবেন
const testimonialsData = [
    {
        quote: "RentTime made finding a roommate in Dhaka so much easier! The platform is user-friendly and I connected with a great person within a week. Highly recommended!",
        name: "Sadia Islam",
        role: "University Student, Bashundhara R/A",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
    },
    {
        quote: "As a homeowner, I was worried about finding reliable tenants. RentTime's platform helped me list my flat easily and I found a wonderful family in just a few days.",
        name: "Anwar Hossain",
        role: "Homeowner, Dhanmondi",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
    },
    {
        quote: "I was new to the city and desperately needed a place to stay. Thanks to RentTime, I found a clean and affordable room near my office. The process was smooth and secure.",
        name: "Rahim Chowdhury",
        role: "Software Engineer, Uttara",
        avatar: "https://randomuser.me/api/portraits/men/46.jpg",
        rating: 4,
    }
];

// Star Icon Component
const StarIcon = () => (
    <svg className="w-5 h-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const Testimonials = () => {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        What Our Users Say
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Real stories from people who found their perfect match with RentTime.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                            
                            <div className="p-8 flex-grow">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => <StarIcon key={i} />)}
                                </div>
                                <blockquote className="text-gray-700 italic">
                                    <p>"{testimonial.quote}"</p>
                                </blockquote>
                            </div>
                            <div className="bg-gray-50 p-6 flex items-center">
                                <img className="h-12 w-12 rounded-full object-cover" src={testimonial.avatar} alt={testimonial.name} />
                                <div className="ml-4">
                                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div> 
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;