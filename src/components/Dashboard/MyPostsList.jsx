// components/Dashboard/MyPostsList.jsx (fixed)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { Eye, Trash2, Edit, Home, Users } from 'lucide-react';

const MyPostsList = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // use the same base pattern you used in CreatePostPage
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMyPosts(user);
      } else {
        setError('Please log in to see your posts.');
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMyPosts = async (user) => {
    setLoading(true);
    setError('');
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/api/posts/my-posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch your posts.');

      // server returns an ARRAY, not {posts: [...]}
      // routes/posts.js → res.status(200).json(posts):contentReference[oaicite:2]{index=2}
      setMyPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated.');
      const token = await user.getIdToken();

      // correct endpoint + method
      // routes/posts.js → DELETE /api/posts/:id (secured):contentReference[oaicite:3]{index=3}
      const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to delete the post.');

      setMyPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Your Listings</h2>
      </div>

      {myPosts.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-gray-500 mb-4">No posts yet.</p>
          <Link
            to="/create-post"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600">Title</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Type</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Rent</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {myPosts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.postType === 'house'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {post.postType === 'house' ? (
                        <Home className="w-4 h-4 mr-1.5" />
                      ) : (
                        <Users className="w-4 h-4 mr-1.5" />
                      )}
                      {post.postType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{post.rent} BDT</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link to={`/post/${post._id}`} className="text-gray-400 hover:text-indigo-600">
                        <Eye size={18} />
                      </Link>
                      <button className="text-gray-400 hover:text-blue-600">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPostsList;
