import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase.config";
import { CheckCircle, XCircle, Trash2, Clock } from "lucide-react";

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // সব বুকিং ফেচ করা
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${apiBase}/api/bookings/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load bookings");
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // বুকিং delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this booking?")) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${apiBase}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // বুকিং approve / reject
  const updateStatus = async (id, status) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${apiBase}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p className="p-6">Loading bookings...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="min-w-full border border-gray-200 bg-white rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border">Property</th>
              <th className="px-4 py-2 border">Requester</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="text-sm">
                <td className="px-4 py-2 border">{b.postId?.title || "N/A"}</td>
                <td className="px-4 py-2 border">
                  {b.requesterName} <br />
                  <span className="text-xs text-gray-500">
                    {b.requesterEmail}
                  </span>
                </td>
                <td className="px-4 py-2 border font-semibold">{b.status}</td>
                <td className="px-4 py-2 border space-x-2 flex">
                  <button
                    onClick={() => updateStatus(b._id, "Approved")}
                    className="text-green-600 hover:text-green-800"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => updateStatus(b._id, "Rejected")}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="text-gray-500 hover:text-black"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookingsPage;
