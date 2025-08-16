import React, { useState, useEffect } from 'react';
import PostCard from '../Shared/PostCard';
import Pagination from '../Shared/Pagination';

const ListingsSection = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    
    // --- ফিল্টারের জন্য নতুন স্টেট ---
    const [filters, setFilters] = useState({
        type: '',
        location: '',
        minPrice: '',
        maxPrice: '',
    });

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // API URL এ ফিল্টার প্যারামিটার যোগ করুন
                const query = new URLSearchParams({
                    page: currentPage,
                    limit: 9,
                    ...filters
                }).toString();
                
                const response = await fetch(`http://localhost:5000/api/posts?${query}`);
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
    }, [currentPage, filters]); // currentPage বা filters পরিবর্তন হলে useEffect আবার রান হবে

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };
    
    // পেইজ পরিবর্তনের হ্যান্ডলার
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Browse Listings</h2>
                    <p className="mt-4 text-lg text-gray-600">Find the latest rooms, houses, and roommates with advanced filters.</p>
                </div>

                {/* --- Filter Form --- */}
                <div className="mt-10 p-6 bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Type Filter */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select id="type" name="type" onChange={handleFilterChange} value={filters.type} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="">All</option>
                            <option value="house">House/Room</option>
                            <option value="roommate">Roommate</option>
                        </select>
                    </div>
                    {/* Location Filter */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" id="location" name="location" onChange={handleFilterChange} value={filters.location} placeholder="e.g., Dhanmondi" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                    {/* Price Filter */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price</label>
                            <input type="number" id="minPrice" name="minPrice" onChange={handleFilterChange} value={filters.minPrice} placeholder="0" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
                            <input type="number" id="maxPrice" name="maxPrice" onChange={handleFilterChange} value={filters.maxPrice} placeholder="50000" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                    </div>
                </div>

                {/* --- Listings Grid --- */}
                {loading ? (
                    <div className="text-center p-10">Loading listings...</div>
                ) : error ? (
                    <div className="text-center p-10 text-red-500">Error: {error}</div>
                ) : posts.length > 0 ? (
                    <>
                        <div className="mt-12 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                            {posts.map(post => (
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
                    <p className="text-center mt-12 text-gray-500 text-xl">No listings match your criteria.</p>
                )}
            </div>
        </section>
    );
};

export default ListingsSection;