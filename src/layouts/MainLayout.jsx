import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Shared/Navbar'; // আপনার Navbar কম্পোনেন্টের পাথ
import Footer from '../components/Shared/Footer';

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                {/* এই Outlet এর ভেতরে আপনার রাউটের কন্টেন্টগুলো রেন্ডার হবে */}
                <Outlet />
            </main>
            {/* আপনি চাইলে এখানে একটি Footer যোগ করতে পারেন */}
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;