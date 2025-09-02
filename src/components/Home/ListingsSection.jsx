import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import PostCard from '../Shared/PostCard';
import Pagination from '../Shared/Pagination';

const ListingsSection = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    
    const [filters, setFilters] = useState({ postType:'', location:'', minRent:'', maxRent:'' });


    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
    const fetchPosts = async () => {
        setLoading(true);
        setError('');
        try {
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );
            const query = new URLSearchParams({
                page: currentPage,
                limit: 9,
                ...activeFilters
            }).toString();
            
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE}/api/posts?${query}`);
            if (!response.ok) throw new Error('Failed to fetch posts.');
            
            const data = await response.json();
            setPosts(data.posts);
            setTotalPages(data.pagination?.pages || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Debounce লজিক: ৫০০ মিলিসেকেন্ড অপেক্ষা করার পর API কল হবে
    const debounceTimeout = setTimeout(() => {
        fetchPosts();
    }, 500); // 500ms delay

    // Cleanup ফাংশন: ব্যবহারকারী টাইপ করা অবস্থায় থাকলে আগের setTimeout ক্লিয়ার হয়ে যাবে
    return () => clearTimeout(debounceTimeout);

}, [currentPage, filters]); // Dependency একই থাকবে

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
        setCurrentPage(1); // Reset to first page when filters change
    };
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setFilters({
            type: '',
            location: '',
            minPrice: '',
            maxPrice: '',
        });
        setCurrentPage(1);
    };

    const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                            Find Your Perfect Home
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                            Discover amazing rooms, houses, and roommates with our advanced search filters and seamless browsing experience.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                {/* Enhanced Filter Section */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Search className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Search & Filter</h2>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </button>
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
                        {/* Type Filter */}
                        <div className="space-y-2">
                            <label htmlFor="type" className="block text-sm font-semibold text-gray-700">
                                Property Type
                            </label>
                            <select 
                                id="type" 
                                name="postType" 
                                onChange={handleFilterChange} 
                                value={filters.type}
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                            >
                                <option value="">All Types</option>
                                <option value="house">🏠 House/Room</option>
                                <option value="roommate">👥 Roommate</option>
                            </select>
                        </div>

                        {/* Location Filter */}
                        <div className="space-y-2">
                            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    type="text" 
                                    id="location" 
                                    name="location" 
                                    onChange={handleFilterChange} 
                                    value={filters.location}
                                    placeholder="e.g., Dhanmondi, Gulshan"
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                                />
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="lg:col-span-2 space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Price Range (BDT)</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    type="number" 
                                    id="minPrice" 
                                    name="minRent" 
                                    onChange={handleFilterChange} 
                                    value={filters.minPrice}
                                    placeholder="Min Price"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                                />
                                <input 
                                    type="number" 
                                    id="maxPrice" 
                                    name="maxRent" 
                                    onChange={handleFilterChange} 
                                    value={filters.maxPrice}
                                    placeholder="Max Price"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <div className="mt-6 flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                            <span className="text-sm text-indigo-700 font-medium">
                                Filters applied • {posts.length} results found
                            </span>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <span className="text-lg text-gray-600">Loading amazing listings...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                            <div className="text-red-600 text-xl font-semibold mb-2">Oops! Something went wrong</div>
                            <p className="text-red-500">{error}</p>
                        </div>
                    </div>
                ) : posts.length > 0 ? (
                    <>
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {posts.length} Properties Found
                            </h3>
                            <div className="text-sm text-gray-500">
                                Page {currentPage} of {totalPages}
                            </div>
                        </div>

                        {/* Listings Grid */}
                        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mb-12">
                            {posts.map(post => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                            <div className="text-gray-600 text-xl font-semibold mb-2">No Properties Found</div>
                            <p className="text-gray-500 mb-4">Try adjusting your search criteria or clear filters to see more results.</p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingsSection;