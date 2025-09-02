import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { isAdminEmail } from '../../../utils/isAdmin';
import { Search, Filter, Trash2, Home, User, DollarSign, Activity } from 'lucide-react';
import Swal from 'sweetalert2'; // SweetAlert2 for better notifications

// StatCard এবং PostCardAdmin Helper Component গুলো আগের মতোই থাকবে
const StatCard = ({ title, value, icon: Icon }) => (
    <div className="p-5 rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between text-gray-500">
            <p className="text-sm font-medium">{title}</p>
            {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="mt-1 text-3xl font-bold text-gray-900">{value}</div>
    </div>
);

const PostCardAdmin = ({ item, onView, onDelete }) => (
    <div className="group rounded-xl border bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
            <img
                src={item.photos?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={item.title}
                className="h-40 w-full object-cover rounded-t-xl cursor-pointer"
                onClick={onView}
            />
            <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full text-white ${item.postType === 'house' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {item.postType}
            </span>
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-indigo-600" onClick={onView}>
                {item.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.location}</p>
            <div className="flex items-center justify-between mt-4">
                <p className="text-lg font-bold text-indigo-600">{item.rent.toLocaleString()} BDT</p>
                <button 
                    onClick={onDelete} 
                    className="p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                    title="Delete Post"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    </div>
);


const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const isAdmin = isAdminEmail(currentUser);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState({ totalUsers: 0, totalPosts: 0, totalBookings: 0 });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAllAdminData = async () => {
        if (!currentUser || !isAdmin) {
            setLoading(false);
            return;
        };
        setLoading(true);
        setError('');
        try {
            const token = await currentUser.getIdToken();
            const baseURL = import.meta.env.VITE_API_BASE_URL;

            const [overviewRes, postsRes] = await Promise.all([
              fetch(`${baseURL}/api/admin/overview`, { headers: { Authorization: `Bearer ${token}` } }),
              fetch(`${baseURL}/api/admin/posts`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (!overviewRes.ok || !postsRes.ok) {
                throw new Error("Failed to fetch admin data.");
            }

            const overviewData = await overviewRes.json();
            const postsData = await postsRes.json();
            
            setOverview(overviewData);
            setPosts(postsData.posts || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchAllAdminData();
  }, [currentUser, isAdmin]);
  
  // --- সমাধান: handleDelete ফাংশনটি সম্পূর্ণ করা ---
  const handleDelete = async (postId) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        try {
            const token = await currentUser.getIdToken();
            const baseURL = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${baseURL}/api/admin/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Failed to delete the post.');
            }

            // UI থেকে পোস্টটি সাথে সাথে সরিয়ে দিন
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));

            Swal.fire(
                'Deleted!',
                'The post has been successfully deleted.',
                'success'
            );
        } catch (err) {
            setError(err.message);
            Swal.fire(
                'Error!',
                err.message || 'Could not delete the post.',
                'error'
            );
        }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div></div>;
  }
  
  if (!isAdmin) {
    return <div className="p-10 text-center text-red-500 font-semibold">You are not authorized to view this page.</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500 font-semibold">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {currentUser.displayName || currentUser.email}!</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={overview.totalUsers} icon={Users} />
          <StatCard title="Total Posts" value={overview.totalPosts} icon={Home} />
          <StatCard title="Total Bookings" value={overview.totalBookings} icon={Activity} />
        </div>

        {/* Posts Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Manage Posts</h2>
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {posts.map(post => (
                        <PostCardAdmin 
                            key={post._id} 
                            item={post}
                            onView={() => navigate(`/post/${post._id}`)}
                            onDelete={() => handleDelete(post._id)} // onDelete এ সঠিক ফাংশন যোগ করা হয়েছে
                        />
                    ))}
                </div>
            ) : <p className="text-center text-gray-500 py-8">No posts found.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;