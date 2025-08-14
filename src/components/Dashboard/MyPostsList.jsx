import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase.config';

const MyPostsList = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const token = await auth.currentUser.getIdToken(); // Firebase থেকে JWT টোকেন নিন
                const response = await fetch('http://localhost:5000/api/my-posts', {
                    headers: {
                        'Authorization': `Bearer ${token}` // 헤더ে টোকেন পাঠান
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch your posts. Please log in again.');
                }
                const data = await response.json();
                setMyPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (auth.currentUser) {
            fetchMyPosts();
        }
    }, []);

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete the post.');
            
            // UI থেকে পোস্টটি রিমুভ করুন
            setMyPosts(myPosts.filter(post => post._id !== postId));
        } catch (err) {
            setError(err.message);
        }
    };


    if (loading) return <p>Loading your posts...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <h2 className="text-2xl font-bold p-6 border-b">Your Listings</h2>
            {myPosts.length === 0 ? (
                <p className="p-6 text-gray-500">You have not created any posts yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {myPosts.map(post => (
                                <tr key={post._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.postType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.rent} BDT</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <Link to={`/post/${post._id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                                        <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:text-red-900">Delete</button>
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