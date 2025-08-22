import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';
import SignInWithGoogle from '../../components/Auth/SignInWithGoogle';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // আগের পেজে না গিয়ে — সফল হলে সবসময় হোমপেজে নেব
  const redirectToHome = () => {
    navigate('/', { replace: true });
  };

  // ✅ সফল লগইনের কমন হ্যান্ডলার (Google + Email/Pass উভয়ের জন্য)
  const handleLoginSuccess = (msg = 'Logged in successfully.') => {
    Swal.fire({
      title: 'Welcome! 🎉',
      text: msg,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      heightAuto: false,
    }).then(() => {
      redirectToHome();
    });
  };

  // ❌ ত্রুটি দেখানোর কমন হ্যান্ডলার
  const handleLoginError = (msg = 'Failed to log in. Please try again.') => {
    Swal.fire({
      title: 'Oops!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'OK',
      heightAuto: false,
    });
  };

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleLoginSuccess('Logged in successfully.');
    } catch (err) {
      let uiMsg = 'Failed to log in. Please try again later.';
      if (
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/invalid-credential'
      ) {
        uiMsg = 'Invalid email or password. Please try again.';
      }
      setError(uiMsg);
      handleLoginError(uiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </p>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign-in */}
        {/* SignInWithGoogle এ onSuccess / onError props পাশ করে হোমে রিডাইরেক্ট করাচ্ছি */}
        <SignInWithGoogle
          onSuccess={() => handleLoginSuccess('Logged in with Google.')}
          onError={(msg) => handleLoginError(msg || 'Google sign-in failed.')}
        />

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
