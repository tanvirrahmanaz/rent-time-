import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Check, X, Clock, Mail, User, Home } from 'lucide-react';

const BookingRequestsPage = () => {
    const { currentUser } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookingRequests = async () => {
        if (!currentUser) return;
        try {
            const token = await currentUser.getIdToken();
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${baseURL}/api/bookings/received`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch booking requests');
            }
            
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingRequests();
    }, [currentUser]);
    
    const handleStatusUpdate = async (bookingId, status) => {
        try {
            const token = await currentUser.getIdToken();
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${baseURL}/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update booking status');
            }
            
            // স্ট্যাটাস আপডেটের পর তালিকাটি রিফ্রেশ করুন
            fetchBookingRequests(); 
        } catch (error) {
            setError(error.message);
        }
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            Pending: { style: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} /> },
            Approved: { style: 'bg-green-100 text-green-800', icon: <Check size={14} /> },
            Rejected: { style: 'bg-red-100 text-red-800', icon: <X size={14} /> }
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
        return <div className="text-center p-10">Loading booking requests...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Booking Requests</h1>
                    <p className="mt-2 text-gray-600">Manage all the booking requests for your listings.</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white p-8 text-center rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700">No Booking Requests Yet</h2>
                        <p className="text-gray-500 mt-2">When someone requests to book one of your properties, it will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map(booking => (
                            <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-4">
                                    <div className="mb-4 sm:mb-0">
                                        <p className="text-xs text-gray-500">Request from:</p>
                                        <div className="flex items-center mt-1">
                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <User className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-bold text-gray-800">{booking.requesterName}</p>
                                                <p className="text-sm text-gray-500 flex items-center">
                                                    <Mail size={14} className="mr-1.5" />
                                                    {booking.requesterEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <StatusBadge status={booking.status} />
                                </div>
                                
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">For Property:</p>
                                    <Link to={`/post/${booking.postId?._id}`} className="flex items-center font-semibold text-indigo-700 hover:underline">
                                        <Home size={16} className="mr-2" />
                                        {booking.postId?.title || 'Post details not available'}
                                    </Link>
                                </div>

                                {booking.status === 'Pending' && (
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button 
                                            onClick={() => handleStatusUpdate(booking._id, 'Approved')} 
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                                        >
                                            <Check size={16} className="inline mr-1" /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(booking._id, 'Rejected')} 
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16} className="inline mr-1" /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingRequestsPage;