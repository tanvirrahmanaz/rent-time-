import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
            
            <h1 className="text-8xl md:text-9xl font-extrabold text-indigo-600 tracking-wider">
                404
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 mt-4">
                Page Not Found
            </h2>
            <p className="text-gray-600 mt-4 max-w-md">
                Sorry, the page you are looking for does not exist. It might have been moved or deleted.
            </p>
            <Link
                to="/"
                className="mt-8 inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFoundPage;