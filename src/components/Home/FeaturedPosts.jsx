import React, { useState, useEffect } from 'react';
import PostCard from '../Shared/PostCard';
import Pagination from '../Shared/Pagination'; // Pagination কম্পোনেন্ট ইমপোর্ট করুন

const FeaturedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // পেজিনেশনের জন্য নতুন স্টেট
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const postsPerPage = 6;

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // API URL এ page এবং limit যোগ করুন
                const response = await fetch(`http://localhost:5000/api/posts?page=${currentPage}&limit=${postsPerPage}`);
                if (!response.ok) throw new Error('Failed to fetch posts.');
                
                const data = await response.json();
                
                setPosts(data.posts);
                setTotalPages(data.totalPages);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage]); // currentPage পরিবর্তন হলে useEffect আবার রান হবে

    // পেইজ পরিবর্তনের জন্য হ্যান্ডলার ফাংশন
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // পেইজ পরিবর্তনের পর উপরে স্ক্রল করার জন্য
    };

    if (loading) return <div className="text-center p-10">Loading listings...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

    return (
        <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Recent Listings</h2>
                    <p className="mt-4 text-lg text-gray-600">Find the latest rooms, houses, and roommates.</p>
                </div>

                {posts.length > 0 ? (
                    <>
                        <div className="mt-12 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                            {posts.map(post => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        
                        {/* Pagination কম্পোনেন্ট এখানে যোগ করুন */}
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <p className="text-center mt-12 text-gray-500">No posts found.</p>
                )}
            </div>
        </section>
    );
};

export default FeaturedPosts;