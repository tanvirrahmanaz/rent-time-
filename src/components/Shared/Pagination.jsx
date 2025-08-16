import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    const getVisiblePages = () => {
        if (totalPages <= 7) return pageNumbers;
        
        if (currentPage <= 4) return [...pageNumbers.slice(0, 5), '...', totalPages];
        if (currentPage >= totalPages - 3) return [1, '...', ...pageNumbers.slice(-5)];
        
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center space-x-1 mt-16">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-3 bg-white text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
            </button>
            
            {getVisiblePages().map((number, index) => (
                number === '...' ? (
                    <span key={index} className="px-3 py-3 text-gray-400">...</span>
                ) : (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`px-4 py-3 rounded-xl border transition-all duration-200 ${
                            currentPage === number 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
                        }`}
                    >
                        {number}
                    </button>
                )
            ))}
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-3 bg-white text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
            </button>
        </div>
    );
};

export default Pagination;