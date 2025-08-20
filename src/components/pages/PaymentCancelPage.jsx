import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancelPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
                <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6">
                    Payment Incomplete
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-md">
                    Your payment process was cancelled or could not be completed. Your card has not been charged.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/dashboard/my-requests"
                        className="w-full sm:w-auto inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
                    >
                        Back to My Requests
                    </Link>
                    <Link
                        to="/"
                        className="w-full sm:w-auto inline-block bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-300 transition-all duration-300"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelPage;