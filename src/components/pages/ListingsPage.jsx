import React, { useState, useEffect } from 'react';
import PostCard from '../Shared/PostCard';
import Pagination from '../Shared/Pagination';
// 'Link' ইমপোর্ট করার আর প্রয়োজন নেই, কারণ PostCard নিজেই একটি লিঙ্ক

const ListingsPage = ({ postType, title, subtitle }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const postsPerPage = 9;

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://rent-time.vercel.app/api/posts?page=${currentPage}&limit=${postsPerPage}&type=${postType}`);
                if (!response.ok) throw new Error(`Failed to fetch ${postType} listings.`);
                
                const data = await response.json();
                setPosts(data.posts);
                setTotalPages(data.totalPages);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [currentPage, postType]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    if (loading) return <div className="text-center p-20 font-semibold">Loading...</div>;
    if (error) return <div className="text-center p-20 text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900">{title}</h1>
                    <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
                </div>

                {posts.length > 0 ? (
                    <>
                        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                            {posts.map(post => (
                                // --- পরিবর্তন এখানে ---
                                // এখান থেকে <Link> wrapper টি সরিয়ে দেওয়া হয়েছে
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <p className="text-center mt-12 text-gray-500 text-xl">No {postType} listings found at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default ListingsPage;