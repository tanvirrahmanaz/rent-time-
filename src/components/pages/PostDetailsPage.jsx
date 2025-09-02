import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapPin, Calendar, Bed, Bath, Square, Users, Phone, Heart, Share2, ArrowLeft,
  Check, Home, UserCheck, AlertCircle, Star, Clock, CheckCircle, XCircle,
  Shield, IdCard, Image as ImageIcon, PawPrint, Car, CigaretteOff, Info,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { auth } from '../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const maskNid = (nid) => {
  if (!nid) return '';
  const last4 = nid.slice(-4);
  return `${'*'.repeat(Math.max(nid.length - 4, 0))}${last4}`;
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold">{value ?? '—'}</span>
  </div>
);

const PostDetailsPage = () => {
  const { id } = useParams();

  // ---- AUTH STATE (fixes "login" showing after reload) ----
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  // ---- UI / DATA ----
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [current, setCurrent] = useState(0); // slider index
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [hasExistingRequest, setHasExistingRequest] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  // swipe support
  const touchStartX = useRef(null);

  const formattedRent = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(value || 0);

  // --- Booking actions ---
  const handleBookingRequest = async () => {
    if (!user) {
      alert('Please log in to book this room.');
      return;
    }
    if (hasExistingRequest) {
      setBookingMessage('You have already sent a booking request for this property.');
      return;
    }
    setIsBookingLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ postId: id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to send request');
      setHasExistingRequest(true);
      setBookingStatus('pending');
      setBookingMessage('Your booking request has been sent successfully!');
    } catch (err) {
      setBookingMessage(err.message || 'Failed to send request.');
    } finally {
      setIsBookingLoading(false);
    }
  };

  const checkExistingBooking = async (activeUser) => {
    if (!activeUser) return;
    try {
      const token = await activeUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/bookings/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.hasBooking) {
          setHasExistingRequest(true);
          setBookingStatus(data.status?.toLowerCase());
        } else {
          setHasExistingRequest(false);
          setBookingStatus(null);
        }
      }
    } catch (e) {
      // silent
    }
  };

  // --- Fetch post details ---
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/posts/${id}`);
        if (!res.ok) throw new Error('Post not found.');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // re-check booking whenever auth finishes or user changes
  useEffect(() => {
    if (authChecked && user) {
      checkExistingBooking(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, user, id]);

  // --- Slider helpers ---
  const images = Array.isArray(post?.photos) ? post.photos : [];
  const roomImages = Array.isArray(post?.roomImages) ? post.roomImages : [];
  const gallery = images.length ? images : roomImages; // fallback to roomImages

  const goPrev = () => setCurrent((i) => (i - 1 + gallery.length) % gallery.length);
  const goNext = () => setCurrent((i) => (i + 1) % gallery.length);
  const goTo = (idx) => setCurrent(idx);

  // keyboard arrows
  useEffect(() => {
    const onKey = (e) => {
      if (!gallery?.length) return;
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gallery?.length]);

  // touch/swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      dx > 0 ? goPrev() : goNext();
    }
    touchStartX.current = null;
  };

  // --- Booking button UI helpers ---
  const getBookingButtonText = () => {
    if (hasExistingRequest) {
      switch (bookingStatus) {
        case 'pending': return 'Request Pending';
        case 'approved': return 'Request Approved';
        case 'rejected': return 'Request Rejected';
        default: return 'Already Requested';
      }
    }
    return 'Request to Book';
  };

  const getBookingButtonStyle = () => {
    if (hasExistingRequest) {
      switch (bookingStatus) {
        case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
        case 'approved': return 'bg-green-500 hover:bg-green-600';
        case 'rejected': return 'bg-red-500 hover:bg-red-600';
        default: return 'bg-gray-500 hover:bg-gray-600';
      }
    }
    return 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700';
  };

  const getBookingIcon = () => {
    if (hasExistingRequest) {
      switch (bookingStatus) {
        case 'pending': return <Clock className="w-5 h-5 mr-2" />;
        case 'approved': return <CheckCircle className="w-5 h-5 mr-2" />;
        case 'rejected': return <XCircle className="w-5 h-5 mr-2" />;
        default: return <Check className="w-5 h-5 mr-2" />;
      }
    }
    return null;
  };

  // --- Loading / Error states ---
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
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'No post data available.'}</p>
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

  const amenitiesToShow = showAllAmenities ? post.amenities : post.amenities?.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
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

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{post.location}</span>
              </div>
              {post.nidNumber && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                  <Shield className="w-4 h-4 mr-1" />
                  Owner Verified
                </div>
              )}
            </div>
            <div className="text-left lg:text-right">
              <div className="text-3xl font-bold text-indigo-600">{formattedRent(post.rent)}</div>
              <div className="text-gray-500">per month</div>
            </div>
          </div>

          {/* Type + mock rating */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                post.postType === 'house' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
              }`}
            >
              {post.postType === 'house' ? (
                <>
                  <Home className="w-4 h-4 mr-2" />
                  For Rent
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Roommate Wanted
                </>
              )}
            </span>
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-gray-700 font-medium">4.8 (12 reviews)</span>
            </div>
          </div>
        </div>

        {/* Image Slider (no cropping) */}
        {gallery && gallery.length > 0 ? (
          <div className="mb-8">
            <div
              className="relative rounded-2xl overflow-hidden border bg-black/5 flex items-center justify-center"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={{ minHeight: '320px' }}
            >
              <img
                src={gallery[current]}
                alt={post.title}
                className="max-h-[70vh] w-full object-contain"
              />

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {current + 1} / {gallery.length}
              </div>

              {gallery.length > 1 && (
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  {gallery.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`w-2.5 h-2.5 rounded-full ${i === current ? 'bg-white' : 'bg-white/60'}`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* thumbs (no crop) */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-3">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`border rounded-lg overflow-hidden flex items-center justify-center ${i === current ? 'ring-2 ring-indigo-500' : ''}`}
                    aria-label={`Thumbnail ${i + 1}`}
                    style={{ height: '80px' }}
                  >
                    <img src={src} alt={`thumb-${i}`} className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 bg-white border rounded-xl p-8 text-center text-gray-500">
            <ImageIcon className="w-6 h-6 inline mr-2" />
            No images provided.
          </div>
        )}

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {post.bedrooms ? (
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                  <Bed className="w-6 h-6 text-indigo-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{post.bedrooms}</div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
              ) : null}
              {post.bathrooms ? (
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                  <Bath className="w-6 h-6 text-indigo-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{post.bathrooms}</div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
              ) : null}
              {post.size ? (
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                  <Square className="w-6 h-6 text-indigo-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{post.size}</div>
                  <div className="text-sm text-gray-500">Sq. Ft.</div>
                </div>
              ) : null}
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <Calendar className="w-6 h-6 text-indigo-600 mb-2" />
                <div className="text-sm font-bold text-gray-900">
                  {post.availableFrom
                    ? new Date(post.availableFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '—'}
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
            {post.postType === 'house' && Array.isArray(post.amenities) && post.amenities.length > 0 && (
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

            {/* House Rules */}
            {Array.isArray(post.rules) && post.rules.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">House Rules</h2>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  {post.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow label="Deposit" value={post.deposit ? formattedRent(post.deposit) : undefined} />
                <DetailRow label="Lease Term" value={post.leaseTerm} />
                <DetailRow label="Furnished" value={post.furnished ? 'Yes' : post.furnished === false ? 'No' : undefined} />
                <DetailRow label="Utilities Included" value={Array.isArray(post.utilities) ? post.utilities.join(', ') : post.utilities ?? undefined} />
                <DetailRow label="Contact Preference" value={post.contactPreference} />
                <DetailRow label="Visiting Hours" value={post.visitingHours} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <PawPrint className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Pets: <strong>{post.petPolicy ?? (post.petsAllowed ? 'Allowed' : '—')}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Parking: <strong>{post.parking ?? '—'}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CigaretteOff className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Smoking: <strong>{post.smokingAllowed === true ? 'Allowed' : post.smokingAllowed === false ? 'Not allowed' : '—'}</strong>
                  </span>
                </div>
              </div>
              {post.postType === 'roommate' && (post.preferredGender || post.preferredOccupation) && (
                <div className="mt-4 p-4 rounded-lg bg-indigo-50 text-indigo-900 flex items-start">
                  <Info className="w-5 h-5 mr-2 mt-0.5" />
                  <div>
                    <div className="font-semibold">Roommate Preference</div>
                    <div className="text-sm">
                      {post.preferredGender && <span>Gender: <strong>{post.preferredGender}</strong>. </span>}
                      {post.preferredOccupation && <span>Occupation: <strong>{post.preferredOccupation}</strong>.</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* NID Section (masked only) */}
            {post.nidNumber && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <IdCard className="w-6 h-6 mr-2 text-indigo-600" /> Owner Identity (NID)
                </h2>
                <div>
                  <div className="text-sm text-gray-600 mb-1">NID Number (masked)</div>
                  <div className="font-mono text-lg">{maskNid(post.nidNumber)}</div>
                </div>
                <p className="mt-3 text-xs text-gray-500">Sensitive data is masked for your safety.</p>
              </div>
            )}
          </div>

          {/* Right / Booking card (not sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-indigo-600">{formattedRent(post.rent)}</div>
                <div className="text-gray-500">per month</div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Property Details</h3>
                <DetailRow
                  label="Available From:"
                  value={post.availableFrom ? new Date(post.availableFrom).toLocaleDateString() : '—'}
                />
                {post.preferredGender && <DetailRow label="Preferred Gender:" value={post.preferredGender} />}
              </div>

              <div className="border-t pt-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Owner</h3>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-gray-900">{post.contactNumber || '—'}</span>
                </div>
              </div>

              {/* Auth-aware buttons/cards */}
              {authChecked && user && user.uid !== post.ownerId && (
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
                    <div
                      className={`p-3 rounded-lg text-center text-sm font-semibold ${
                        bookingMessage.includes('successfully') || bookingMessage.includes('already')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {bookingMessage}
                    </div>
                  )}
                </div>
              )}

              {authChecked && user && user.uid === post.ownerId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mt-4">
                  <UserCheck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-blue-700 font-medium">This is your property</p>
                </div>
              )}

              {authChecked && !user && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-600 mb-3">Please log in to contact the owner</p>
                  <a href="/login" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Log In
                  </a>
                </div>
              )}
              {/* authChecked === false হলে কিছুই দেখাবো না — যাতে ভুল করে Login prompt না আসে */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
