import React from 'react';
import { auth } from '../../firebase.config';
import MyPostsList from '../Dashboard/MyPostsList';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const user = auth.currentUser;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Welcome, {user?.displayName || 'User'}!
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Manage your posts and view your activity here.
                    </p>
                </header>

                <main>
                    <MyPostsList />
                </main>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold">Your Listings</h2>
                        <p className="mt-2 text-gray-600">Manage the properties you have listed.</p>
                        <Link to="/dashboard/booking-requests" className="text-indigo-600 mt-4 inline-block">View Received Requests →</Link>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold">Your Requests</h2>
                        <p className="mt-2 text-gray-600">Check the status of your sent booking requests.</p>
                        <Link to="/dashboard/my-requests" className="text-indigo-600 mt-4 inline-block">View My Requests →</Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;