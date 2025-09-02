import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Search, Filter, Trash2, Home, User, DollarSign } from 'lucide-react';

const StatCard = ({ title, value }) => (
  <div className="p-5 rounded-xl border bg-white shadow-sm">
    <p className="text-slate-500 text-sm">{title}</p>
    <div className="mt-1 text-3xl font-bold text-slate-900">{value}</div>
  </div>
);

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const isAdmin = currentUser?.role === 'admin';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState({ totalUsers: 0, totalPosts: 0, totalBookings: 0 });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAllAdminData = async () => {
        if (!currentUser) return;
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
                throw new Error("Failed to fetch admin data. You might not have admin privileges.");
            }

            const overviewData = await overviewRes.json();
            const postsData = await postsRes.json();
            
            setOverview(overviewData);
            setPosts(postsData.posts);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isAdmin) {
        fetchAllAdminData();
    } else {
        setLoading(false);
    }
  }, [currentUser, isAdmin]);

  if (loading) {
    return <div className="p-10 text-center">Loading admin data…</div>;
  }
  
  if (!isAdmin) {
    return <div className="p-10 text-center text-red-500">You are not authorized to view this page.</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">Site overview and content management</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Users" value={overview.totalUsers} />
          <StatCard title="Total Posts" value={overview.totalPosts} />
          <StatCard title="Total Bookings" value={overview.totalBookings} />
        </div>

        {/* Posts Table */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Manage Posts</h2>
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            {posts.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3">Title</th>
                                <th className="p-3">Owner</th>
                                <th className="p-3">Rent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post._id} className="border-b hover:bg-slate-50">
                                    <td className="p-3 font-medium">{post.title}</td>
                                    <td className="p-3 text-sm text-slate-600">{post.ownerName || 'N/A'}</td>
                                    <td className="p-3">{post.rent} BDT</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            ) : <p>No posts found.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;