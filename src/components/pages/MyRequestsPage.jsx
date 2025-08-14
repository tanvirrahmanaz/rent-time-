import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase.config';
import { Link } from 'react-router-dom';

const MyRequestsPage = () => {
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyRequests = async () => {
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/bookings/sent', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMyRequests(data);
        } catch (error) {
            console.error("Error fetching sent requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth.currentUser) {
            fetchMyRequests();
        }
    }, []);
    
    const handleCancelRequest = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this request?")) return;

        try {
            const token = await auth.currentUser.getIdToken();
            await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // তালিকা থেকে বাতিল করা রিকোয়েস্টটি সরিয়ে দিন
            setMyRequests(myRequests.filter(req => req._id !== bookingId));
        } catch (error) {
            console.error("Failed to cancel request:", error);
        }
    };

    const StatusBadge = ({ status }) => {
        const colorClasses = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Approved: 'bg-green-100 text-green-800',
            Rejected: 'bg-red-100 text-red-800',
        };
        return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
    };

    if (loading) return <p className="p-10 text-center">Loading your requests...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Booking Requests</h1>
            {myRequests.length === 0 ? (
                <p className="text-gray-600">You have not sent any booking requests yet.</p>
            ) : (
                <div className="space-y-4">
                    {myRequests.map(request => (
                        <div key={request._id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Request for:</p>
                                    <Link to={`/post/${request.postId?._id}`} className="text-lg font-bold text-indigo-700 hover:underline">
                                        {request.postId?.title || 'Post Deleted'}
                                    </Link>
                                    <p className="text-sm text-gray-600 mt-1">{request.postId?.location}</p>
                                </div>
                                <StatusBadge status={request.status} />
                            </div>
                            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <p className="text-xs text-gray-500">
                                    Sent on: {new Date(request.createdAt).toLocaleDateString()}
                                </p>
                                {request.status === 'Pending' && (
                                    <button 
                                        onClick={() => handleCancelRequest(request._id)} 
                                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                                    >
                                        Cancel Request
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRequestsPage;