import React from 'react';
import { Link } from 'react-router-dom'; // 1. Link ইমপোর্ট করুন
import { MapPin, Home, Users } from 'lucide-react';

const PostCard = ({ post }) => {
    const formattedRent = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
    }).format(post.rent);

    // 2. বাইরের div টিকে Link দিয়ে পরিবর্তন করুন এবং 'to' প্রপ যোগ করুন
    return (
        <Link 
            to={`/post/${post._id}`} 
            className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
        >
            <div className="relative overflow-hidden">
                <img 
                    src={post.photos[0]} 
                    alt={post.title} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold text-white backdrop-blur-sm ${
                        post.postType === 'house' 
                            ? 'bg-emerald-500/90' 
                            : 'bg-purple-500/90'
                    }`}>
                        {post.postType === 'house' ? (
                            <><Home className="inline w-3 h-3 mr-1" />For Rent</>
                        ) : (
                            <><Users className="inline w-3 h-3 mr-1" />Roommate</>
                        )}
                    </span>
                </div>
            </div>
            
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                </h3>
                <div className="flex items-center text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{post.location}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-indigo-600">
                        {formattedRent}
                        <span className="text-sm font-normal text-gray-500 ml-1">/ month</span>
                    </div>
                    {/* 3. এই বাটনটি এখন লিঙ্কের অংশ হিসেবে কাজ করবে */}
                    <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium">
                        View Details
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCard;