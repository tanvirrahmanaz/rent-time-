import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, CheckCircle, XCircle, Home, Calendar, Wallet, Trash2 } from 'lucide-react';

const MyRequestsPage = () => {
    const { currentUser } = useAuth();
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyRequests = async (user) => {
        setLoading(true);
        setError(null);
        try {
            const token = await user.getIdToken();
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${baseURL}/api/bookings/sent`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error('Failed to fetch your requests.');
            
            const data = await response.json();
            setMyRequests(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchMyRequests(currentUser);
        } else {
            setLoading(false);
        }
    }, [currentUser]);
    
    const handleCancelRequest = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this request?")) return;
        
        try {
            const token = await currentUser.getIdToken();
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${baseURL}/api/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to cancel request.');
            
            setMyRequests(myRequests.filter(req => req._id !== bookingId));
        } catch (error) {
            setError(error.message);
        }
    };
    
    const handlePayNow = async (bookingId) => {
        try {
            const token = await currentUser.getIdToken();
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${baseURL}/api/payments/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bookingId })
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            setError("Payment initiation failed. Please try again.");
        }
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            Pending: { style: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} /> },
            Approved: { style: 'bg-green-100 text-green-800', icon: <CheckCircle size={14} /> },
            Rejected: { style: 'bg-red-100 text-red-800', icon: <XCircle size={14} /> },
            Paid: { style: 'bg-blue-100 text-blue-800', icon: <Wallet size={14} /> }
        };
        const config = statusConfig[status] || {};
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.style}`}>
                {config.icon && <span className="mr-1.5">{config.icon}</span>}
                {status}
            </span>
        );
    };

    if (loading) {
        return <div className="text-center p-10">Loading your requests...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">My Booking Requests</h1>
                    <p className="mt-2 text-gray-600">Track the status of all your sent booking requests.</p>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

                {myRequests.length === 0 ? (
                    <div className="bg-white p-8 text-center rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700">No Requests Found</h2>
                        <p className="text-gray-500 mt-2">You haven't sent any booking requests yet.</p>
                        <Link to="/house" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                            Browse Listings
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {myRequests.map(request => (
                            <div key={request._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-4">
                                    <div className="mb-4 sm:mb-0">
                                        <p className="text-xs text-gray-500">Request for:</p>
                                        <Link to={`/post/${request.postId?._id}`} className="flex items-center font-semibold text-indigo-700 hover:underline text-lg">
                                            <Home size={16} className="mr-2" />
                                            {request.postId?.title || 'Post Deleted'}
                                        </Link>
                                    </div>
                                    <StatusBadge status={request.status} />
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <Calendar size={14} className="mr-2"/>
                                        Sent on: {new Date(request.createdAt).toLocaleDateString()}
                                    </p>
                                    
                                    {request.status === 'Pending' && (
                                        <button 
                                            onClick={() => handleCancelRequest(request._id)} 
                                            className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold hover:bg-red-200"
                                        >
                                            <Trash2 size={14} className="mr-1.5"/> Cancel Request
                                        </button>
                                    )}
                                    {request.status === 'Approved' && (
                                        <button 
                                            onClick={() => handlePayNow(request._id)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 flex items-center"
                                        >
                                            <Wallet size={16} className="mr-2" />
                                            Pay Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRequestsPage;