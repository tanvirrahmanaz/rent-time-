import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    MapPin, 
    Calendar, 
    Bed, 
    Bath, 
    Square, 
    Users, 
    Phone, 
    Heart,
    Share2,
    ArrowLeft,
    Check,
    Home,
    UserCheck,
    AlertCircle,
    Star,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { auth } from '../../firebase.config';

const PostDetailsPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingMessage, setBookingMessage] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [isBookingLoading, setIsBookingLoading] = useState(false);
    const [hasExistingRequest, setHasExistingRequest] = useState(false);
    const [bookingStatus, setBookingStatus] = useState(null); // 'pending', 'approved', 'rejected'
    
    const currentUser = auth.currentUser;

    const handleBookingRequest = async () => {
        if (!currentUser) {
            alert("Please log in to book this room.");
            return;
        }
        
        if (hasExistingRequest) {
            setBookingMessage("You have already sent a booking request for this property.");
            return;
        }
        
        setIsBookingLoading(true);
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('https://rent-time.vercel.app/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ postId: id })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            
            setHasExistingRequest(true);
            setBookingStatus('pending');
            setBookingMessage("Your booking request has been sent successfully!");
        } catch (err) {
            setBookingMessage(err.message || "Failed to send request.");
        } finally {
            setIsBookingLoading(false);
        }
    };

    const checkExistingBooking = async () => {
        if (!currentUser) return;
        
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`https://rent-time.vercel.app/api/bookings/check/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.hasBooking) {
                    setHasExistingRequest(true);
                    setBookingStatus(data.status); // 'pending', 'approved', 'rejected'
                }
            }
        } catch (err) {
            console.error('Error checking existing booking:', err);
        }
    };

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`https://rent-time.vercel.app/api/posts/${id}`);
                if (!response.ok) throw new Error('Post not found.');
                const data = await response.json();
                setPost(data);
                
                // Check for existing booking after post is loaded
                if (currentUser) {
                    checkExistingBooking();
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPostDetails();
    }, [id, currentUser]);

    const getBookingButtonText = () => {
        if (hasExistingRequest) {
            switch (bookingStatus) {
                case 'pending':
                    return 'Request Pending';
                case 'approved':
                    return 'Request Approved';
                case 'rejected':
                    return 'Request Rejected';
                default:
                    return 'Already Requested';
            }
        }
        return 'Request to Book';
    };

    const getBookingButtonStyle = () => {
        if (hasExistingRequest) {
            switch (bookingStatus) {
                case 'pending':
                    return 'bg-yellow-500 hover:bg-yellow-600';
                case 'approved':
                    return 'bg-green-500 hover:bg-green-600';
                case 'rejected':
                    return 'bg-red-500 hover:bg-red-600';
                default:
                    return 'bg-gray-500 hover:bg-gray-600';
            }
        }
        return 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700';
    };

    const getBookingIcon = () => {
        if (hasExistingRequest) {
            switch (bookingStatus) {
                case 'pending':
                    return <Clock className="w-5 h-5 mr-2" />;
                case 'approved':
                    return <CheckCircle className="w-5 h-5 mr-2" />;
                case 'rejected':
                    return <XCircle className="w-5 h-5 mr-2" />;
                default:
                    return <Check className="w-5 h-5 mr-2" />;
            }
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.history.back()}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Listings
                    </button>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">No post data available.</p>
                </div>
            </div>
        );
    }

    const formattedRent = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
    }).format(post.rent);

    const amenitiesToShow = showAllAmenities ? post.amenities : post.amenities?.slice(0, 6);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={() => window.history.back()}
                            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Listings
                        </button>
                        <div className="flex items-center space-x-3">
                            <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Property Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div className="mb-4 lg:mb-0">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{post.title}</h1>
                            <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="w-5 h-5 mr-2" />
                                <span className="text-lg">{post.location}</span>
                            </div>
                        </div>
                        <div className="text-left lg:text-right">
                            <div className="text-3xl font-bold text-indigo-600">{formattedRent}</div>
                            <div className="text-gray-500">per month</div>
                        </div>
                    </div>
                    
                    {/* Property Type Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                            post.postType === 'house' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-purple-100 text-purple-800'
                        }`}>
                            {post.postType === 'house' ? (
                                <><Home className="w-4 h-4 mr-2" />For Rent</>
                            ) : (
                                <><Users className="w-4 h-4 mr-2" />Roommate Wanted</>
                            )}
                        </span>
                        <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            <span className="text-gray-700 font-medium">4.8 (12 reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
                        {/* Main Image */}
                        <div className="relative">
                            <img 
                                src={post.photos[selectedImageIndex]} 
                                alt={post.title} 
                                className="w-full h-96 lg:h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => setSelectedImageIndex(0)}
                            />
                            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                {selectedImageIndex + 1} / {post.photos.length}
                            </div>
                        </div>
                        
                        {/* Thumbnail Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {post.photos.slice(1, 5).map((photo, index) => (
                                <div key={index} className="relative group">
                                    <img 
                                        src={photo} 
                                        alt={`${post.title}-${index + 1}`} 
                                        className="w-full h-44 object-cover rounded-lg cursor-pointer group-hover:scale-105 transition-transform duration-300"
                                        onClick={() => setSelectedImageIndex(index + 1)}
                                    />
                                    {index === 3 && post.photos.length > 5 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                                            <span className="text-white font-semibold">
                                                +{post.photos.length - 5} more
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {post.bedrooms && (
                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                    <Bed className="w-6 h-6 text-indigo-600 mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{post.bedrooms}</div>
                                    <div className="text-sm text-gray-500">Bedrooms</div>
                                </div>
                            )}
                            {post.bathrooms && (
                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                    <Bath className="w-6 h-6 text-indigo-600 mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{post.bathrooms}</div>
                                    <div className="text-sm text-gray-500">Bathrooms</div>
                                </div>
                            )}
                            {post.size && (
                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                    <Square className="w-6 h-6 text-indigo-600 mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{post.size}</div>
                                    <div className="text-sm text-gray-500">Sq. Ft.</div>
                                </div>
                            )}
                            <div className="bg-white p-4 rounded-xl shadow-sm border">
                                <Calendar className="w-6 h-6 text-indigo-600 mb-2" />
                                <div className="text-sm font-bold text-gray-900">
                                    {new Date(post.availableFrom).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric' 
                                    })}
                                </div>
                                <div className="text-sm text-gray-500">Available</div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Place</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{post.description}</p>
                        </div>

                        {/* Amenities */}
                        {post.postType === 'house' && post.amenities && post.amenities.length > 0 && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {amenitiesToShow.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <Check className="w-5 h-5 text-emerald-500" />
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                {post.amenities.length > 6 && (
                                    <button
                                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                                        className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        {showAllAmenities ? 'Show Less' : `Show All ${post.amenities.length} Amenities`}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg border sticky top-8">
                            {/* Price */}
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-indigo-600">{formattedRent}</div>
                                <div className="text-gray-500">per month</div>
                            </div>

                            {/* Property Details */}
                            <div className="space-y-4 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Property Details</h3>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Available From:</span>
                                    <span className="font-semibold">{new Date(post.availableFrom).toLocaleDateString()}</span>
                                </div>
                                
                                {post.preferredGender && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Preferred Gender:</span>
                                        <span className="font-semibold capitalize">{post.preferredGender}</span>
                                    </div>
                                )}
                            </div>

                            {/* Contact Information */}
                            <div className="border-t pt-4 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Owner</h3>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Phone className="w-5 h-5 text-indigo-600" />
                                    <span className="font-semibold text-gray-900">{post.contactNumber}</span>
                                </div>
                            </div>

                            {/* Booking Button */}
                            {currentUser && currentUser.uid !== post.ownerId && (
                                <div className="space-y-4">
                                    <button 
                                        onClick={handleBookingRequest}
                                        disabled={isBookingLoading || hasExistingRequest}
                                        className={`w-full text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${getBookingButtonStyle()}`}
                                    >
                                        {isBookingLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Sending Request...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                {getBookingIcon()}
                                                {getBookingButtonText()}
                                            </div>
                                        )}
                                    </button>
                                    
                                    {bookingMessage && (
                                        <div className={`p-3 rounded-lg text-center text-sm font-semibold ${
                                            bookingMessage.includes('successfully') || bookingMessage.includes('already') 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                            {bookingMessage}
                                        </div>
                                    )}

                                    {/* Status Information */}
                                    {hasExistingRequest && (
                                        <div className={`p-4 rounded-lg border text-center ${
                                            bookingStatus === 'pending' 
                                                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                                : bookingStatus === 'approved'
                                                ? 'bg-green-50 border-green-200 text-green-800'
                                                : bookingStatus === 'rejected'
                                                ? 'bg-red-50 border-red-200 text-red-800'
                                                : 'bg-gray-50 border-gray-200 text-gray-800'
                                        }`}>
                                            <div className="font-semibold mb-1 flex items-center justify-center">
                                                {bookingStatus === 'pending' && (
                                                    <>
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        Request Status: Pending
                                                    </>
                                                )}
                                                {bookingStatus === 'approved' && (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Request Status: Approved
                                                    </>
                                                )}
                                                {bookingStatus === 'rejected' && (
                                                    <>
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Request Status: Rejected
                                                    </>
                                                )}
                                                {!bookingStatus && (
                                                    <>
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Booking Request Sent
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-sm">
                                                {bookingStatus === 'pending' && 'Your request is being reviewed by the property owner.'}
                                                {bookingStatus === 'approved' && 'Congratulations! Your booking request has been approved.'}
                                                {bookingStatus === 'rejected' && 'Unfortunately, your request was not approved this time.'}
                                                {!bookingStatus && 'You have already sent a request for this property.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Owner Property Warning */}
                            {currentUser && currentUser.uid === post.ownerId && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                    <UserCheck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                    <p className="text-blue-700 font-medium">This is your property</p>
                                </div>
                            )}

                            {/* Login Prompt */}
                            {!currentUser && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                    <p className="text-gray-600 mb-3">Please log in to contact the owner</p>
                                    <button className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                        Log In
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailsPage;