import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';
import SignInWithGoogle from '../../components/Auth/SignInWithGoogle';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // useLocation এবং Link ইমপোর্ট করুন

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    // ব্যবহারকারী কোন পেইজ থেকে এসেছে তা বের করুন, না থাকলে ডিফল্ট '/' (হোমপেইজ)
    const from = location.state?.from?.pathname || '/';

    // সফল লগইনের পর কল করার জন্য একটি ফাংশন
    const handleLoginSuccess = () => {
        console.log(`Login successful, redirecting to: ${from}`);
        navigate(from, { replace: true }); // আগের পেইজে পাঠান
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            handleLoginSuccess(); // সফল হলে রিডাইরেক্ট ফাংশন কল করুন

        } catch (err) {
            // ... error handling ...
             if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Invalid email or password. Please try again.');
            } else {
                setError('Failed to log in. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
                
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

                <form onSubmit={handleLogin} noValidate>
                    {/* --- ফর্ম ইনপুট --- */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* গুগল সাইন-ইন কম্পোনেন্টে সফলতার পর কল করার জন্য ফাংশন পাস করুন */}
                <SignInWithGoogle onSuccess={handleLoginSuccess} />

                 <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;