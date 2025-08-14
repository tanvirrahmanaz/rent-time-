import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../../firebase.config';


const PostDetailsPage = () => {
    const { id } = useParams(); // URL থেকে id প্যারামিটারটি পাওয়ার জন্য
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingMessage, setBookingMessage] = useState('');
    const currentUser = auth.currentUser;

    const handleBookingRequest = async () => {
        if (!currentUser) {
            alert("Please log in to book this room.");
            return;
        }

        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ postId: id })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            setBookingMessage("Your booking request has been sent successfully!");

        } catch (err) {
            setBookingMessage(err.message || "Failed to send request.");
        }
    };

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/posts/${id}`);
                if (!response.ok) throw new Error('Post not found.');
                const data = await response.json();
                setPost(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [id]); // id পরিবর্তন হলে আবার ডেটা আনা হবে

    if (loading) return <div className="text-center p-20">Loading Details...</div>;
    if (error) return <div className="text-center p-20 text-red-500">Error: {error}</div>;
    if (!post) return <div className="text-center p-20">No post data available.</div>;

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg overflow-hidden">
                    <img src={post.photos[0]} alt={post.title} className="w-full h-full object-cover" />
                    <div className="grid grid-cols-2 gap-2">
                        {post.photos.slice(1, 5).map((photo, index) => (
                            <img key={index} src={photo} alt={`${post.title}-${index}`} className="w-full h-48 object-cover"/>
                        ))}
                    </div>
                </div>

                {/* Post Info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h1 className="text-4xl font-extrabold text-gray-900">{post.title}</h1>
                        <p className="mt-2 text-lg text-gray-500">{post.location}</p>
                        <div className="mt-6 border-t pt-6">
                            <h2 className="text-2xl font-bold text-gray-800">Description</h2>
                            <p className="mt-4 text-gray-600 whitespace-pre-wrap">{post.description}</p>
                        </div>
                        {post.postType === 'house' && post.amenities && post.amenities.length > 0 && (
                             <div className="mt-6 border-t pt-6">
                                <h2 className="text-2xl font-bold text-gray-800">Amenities</h2>
                                <ul className="mt-4 grid grid-cols-2 gap-2">
                                    {post.amenities.map(item => <li key={item} className="text-gray-600">✓ {item}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md sticky top-24">
                            <p className="text-4xl font-extrabold text-indigo-700">
                                {new Intl.NumberFormat('en-IN').format(post.rent)} BDT <span className="text-lg font-normal">/ month</span>
                            </p>
                             <div className="mt-6 space-y-4">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Key Details</h3>
                                <p><strong>Available From:</strong> {new Date(post.availableFrom).toLocaleDateString()}</p>
                                {post.bedrooms && <p><strong>Bedrooms:</strong> {post.bedrooms}</p>}
                                {post.bathrooms && <p><strong>Bathrooms:</strong> {post.bathrooms}</p>}
                                {post.size && <p><strong>Size:</strong> {post.size} sq. ft.</p>}
                                {post.preferredGender && <p><strong>Preferred Gender:</strong> {post.preferredGender}</p>}
                            </div>
                            <div className="mt-6">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Contact</h3>
                                <p className="mt-4"><strong>Number:</strong> {post.contactNumber}</p>
                            </div>
                        </div>
                    </div>
                    {currentUser && currentUser.uid !== post.ownerId && (
        <div className="mt-6">
            <button 
                onClick={handleBookingRequest}
                className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition duration-300"
            >
                Request to Book
            </button>
            {bookingMessage && <p className="mt-4 text-center text-sm font-semibold">{bookingMessage}</p>}
        </div>
    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetailsPage;