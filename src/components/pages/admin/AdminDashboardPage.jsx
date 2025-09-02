// path: src/components/pages/admin/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Auth context (currentUser/getIdToken, loading)
import { useAuth } from '../../../contexts/AuthContext';

// ✅ Allowlist-based admin check (email দিয়ে চেক করব)
import { isAdminEmail } from '../../../utils/isAdmin';

// UI/Icons
import { Users, Home, Activity, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

/* ----------------- Small UI helpers ----------------- */
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
      <span
        className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full text-white ${
          item.postType === 'house' ? 'bg-blue-500' : 'bg-green-500'
        }`}
      >
        {item.postType}
      </span>
    </div>
    <div className="p-4">
      <h3
        className="font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-indigo-600"
        onClick={onView}
      >
        {item.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.location}</p>
      <div className="flex items-center justify-between mt-4">
        <p className="text-lg font-bold text-indigo-600">
          {Number(item.rent || 0).toLocaleString()} BDT
        </p>
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

/* ----------------- Main Component ----------------- */
const AdminDashboardPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalBookings: 0,
  });
  const [posts, setPosts] = useState([]);

  // ✅ Fix: isAdminEmail-এ email পাঠাও
  const isAdmin = !authLoading && currentUser ? isAdminEmail(currentUser.email) : false;

  // ছোট utility: response আসলেই JSON কিনা নিশ্চিত করা (baseURL ভুল হলে HTML আসে)
  const ensureJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Invalid response from server. Check VITE_API_BASE_URL.');
    }
  };

  const fetchAllAdminData = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError('');

    try {
      const token = await currentUser.getIdToken();

      // ✅ Fix: এটা অবশ্যই SERVER base URL হবে
      const baseURL =
        import.meta.env.VITE_API_BASE_URL || 'https://rent-time.vercel.app';

      const [overviewRes, postsRes] = await Promise.all([
        fetch(`${baseURL}/api/admin/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseURL}/api/admin/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!overviewRes.ok || !postsRes.ok) {
        // JSON কিনা পরীক্ষা করলেই বোঝা যাবে আসলে কী ফেরত দিচ্ছে
        await ensureJson(overviewRes);
        await ensureJson(postsRes);
        throw new Error('Failed to fetch admin data. You may not have admin privileges.');
      }

      const overviewData = await ensureJson(overviewRes);
      const postsData = await ensureJson(postsRes);

      setOverview(overviewData);
      setPosts(postsData.posts || []);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      const token = await currentUser.getIdToken();
      const baseURL =
        import.meta.env.VITE_API_BASE_URL || 'https://rent-time.vercel.app';

      const res = await fetch(`${baseURL}/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        await ensureJson(res); // helpful error
        throw new Error('Failed to delete the post.');
      }

      setPosts((prev) => prev.filter((p) => p._id !== postId));
      Swal.fire('Deleted!', 'The post has been successfully deleted.', 'success');
    } catch (err) {
      Swal.fire('Error!', err.message || 'Could not delete the post.', 'error');
    }
  };

  useEffect(() => {
    if (isAdmin) fetchAllAdminData();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isAdmin]);

  /* ----------------- Render states ----------------- */
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        You are not authorized to view this page.
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">Error: {error}</div>
    );
  }

  /* ----------------- Main UI ----------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {currentUser?.displayName || currentUser?.email}!
          </p>
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
                {posts.map((post) => (
                  <PostCardAdmin
                    key={post._id}
                    item={post}
                    onView={() => navigate(`/post/${post._id}`)}
                    onDelete={() => handleDelete(post._id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No posts found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
