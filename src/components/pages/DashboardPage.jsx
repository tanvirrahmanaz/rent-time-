import React from 'react';
import { auth } from '../../firebase.config';
import MyPostsList from '../Dashboard/MyPostsList';

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
            </div>
        </div>
    );
};

export default DashboardPage;