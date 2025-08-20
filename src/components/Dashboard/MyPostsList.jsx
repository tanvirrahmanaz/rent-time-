import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { Eye, Trash2, Edit, Home, Users } from 'lucide-react'; // Tailwind এর জন্য lucide-react আইকন

const MyPostsList = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // onAuthStateChanged একটি unsubscribe ফাংশন রিটার্ন করে
        // এটি নিশ্চিত করে যে Firebase থেকে ইউজারের অবস্থা জানার পরেই fetch করা হবে
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // যদি ইউজার লগইন করা থাকে, তবে তার পোস্টগুলো fetch করুন
                fetchMyPosts(user);
            } else {
                // যদি ইউজার লগইন করা না থাকে
                setError("Please log in to see your posts.");
                setLoading(false);
            }
        });

        // কম্পোনেন্টটি ক্লিনআপ হওয়ার সময় লিসেনারটি বন্ধ করে দিন
        return () => unsubscribe();
    }, []); // এই useEffect শুধু একবারই রান হবে

    const fetchMyPosts = async (user) => {
        setLoading(true);
        setError('');
        try {
            const token = await user.getIdToken();
            
            // আপনার নিশ্চিত করা সঠিক URL টি ব্যবহার করা হয়েছে
            const response = await fetch('https://rent-time.vercel.app/api/posts/my-posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch your posts.');
            }
            const data = await response.json();
            setMyPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(`https://rent-time.vercel.app/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete the post.');
            
            setMyPosts(myPosts.filter(post => post._id !== postId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Your Listings</h2>
            </div>
            
            {myPosts.length === 0 ? (
                <div className="p-10 text-center">
                    <p className="text-gray-500 mb-4">You have not created any posts yet.</p>
                    <Link to="/create-post" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Create Your First Post
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-600">Title</th>
                                <th className="px-6 py-3 font-semibold text-gray-600">Type</th>
                                <th className="px-6 py-3 font-semibold text-gray-600">Rent</th>
                                <th className="px-6 py-3 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {myPosts.map(post => (
                                <tr key={post._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.postType === 'house' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {post.postType === 'house' ? <Home className="w-4 h-4 mr-1.5"/> : <Users className="w-4 h-4 mr-1.5"/>}
                                            {post.postType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{post.rent} BDT</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <Link to={`/post/${post._id}`} className="text-gray-400 hover:text-indigo-600"><Eye size={18} /></Link>
                                            <button className="text-gray-400 hover:text-blue-600"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(post._id)} className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyPostsList;