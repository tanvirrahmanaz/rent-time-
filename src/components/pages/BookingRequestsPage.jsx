import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase.config';
import { Link } from 'react-router-dom';

const BookingRequestsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookingRequests = async () => {
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/bookings/received', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth.currentUser) {
            fetchBookingRequests();
        }
    }, []);
    
    const handleStatusUpdate = async (bookingId, status) => {
        try {
            const token = await auth.currentUser.getIdToken();
            await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            // স্ট্যাটাস আপডেটের পর তালিকাটি রিফ্রেশ করুন
            fetchBookingRequests(); 
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    if (loading) return <p>Loading booking requests...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Booking Requests for Your Posts</h1>
            {bookings.length === 0 ? (
                <p>You have no booking requests yet.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{booking.requesterName} ({booking.requesterEmail})</p>
                                <p className="text-sm text-gray-600">
                                    Requested for: <Link to={`/post/${booking.postId._id}`} className="text-indigo-600 font-bold">{booking.postId.title}</Link>
                                </p>
                                <p className={`mt-2 text-sm font-bold ${
                                    booking.status === 'Approved' ? 'text-green-600' :
                                    booking.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                                }`}>
                                    Status: {booking.status}
                                </p>
                            </div>
                            {booking.status === 'Pending' && (
                                <div className="flex space-x-2">
                                    <button onClick={() => handleStatusUpdate(booking._id, 'Approved')} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">Approve</button>
                                    <button onClick={() => handleStatusUpdate(booking._id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingRequestsPage;