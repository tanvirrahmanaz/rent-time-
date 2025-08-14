import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    // ভাড়ার ফরম্যাট লোকাল কারেন্সিতে দেখানোর জন্য
    const formattedRent = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
    }).format(post.rent);

    return (
        <Link to={`/post/${post._id}`} className="block group border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="relative">
                <img 
                    src={post.photos[0]} 
                    alt={post.title} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.postType === 'house' ? 'For Rent' : 'Roommate'}
                </span>
            </div>
            <div className="p-4 bg-white">
                <h3 className="text-lg font-bold text-gray-800 truncate">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{post.location}</p>
                <p className="text-xl font-extrabold text-indigo-700 mt-3">{formattedRent} <span className="text-sm font-normal text-gray-600">/ month</span></p>
            </div>
        </Link>
    );
};

export default PostCard;