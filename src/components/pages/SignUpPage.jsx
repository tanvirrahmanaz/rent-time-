// src/components/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import SignInWithGoogle from '../../components/Auth/SignInWithGoogle';
import Swal from 'sweetalert2';

// helper: setDoc with timeout (so UI never hangs)
const safeSetDoc = async (ref, data, opts = {}, timeoutMs = 3000) => {
  const write = setDoc(ref, data, opts);
  const timeout = new Promise((_, rej) =>
    setTimeout(() => rej(new Error('firestore-timeout')), timeoutMs)
  );
  return Promise.race([write, timeout]);
};

const SignUpPage = () => {
  const [formData, setFormData]   = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const navigate                  = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleInputChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.id]: e.target.value }));
  };

  const showSuccessThenGoHome = async (msg) => {
    try {
      await Swal.fire({
        title: 'Welcome! 🎉',
        text: msg || 'Account created successfully!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        heightAuto: false,
      });
    } catch {}
    navigate('/', { replace: true });
  };

  const showError = (msg) => {
    Swal.fire({
      title: 'Oops!',
      text: msg || 'Something went wrong. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK',
      heightAuto: false,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match.';
      setError(msg);
      return showError(msg);
    }
    if (password.length < 6) {
      const msg = 'Password should be at least 6 characters long.';
      setError(msg);
      return showError(msg);
    }

    setLoading(true);
    try {
      // 1) create Firebase Auth user
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // 2) update displayName (use the user returned)
      await updateProfile(user, { displayName: name });

      // 3) try to write profile to Firestore (won't block UX if slow/fails)
      const userRef = doc(db, 'users', user.uid);
      try {
        await safeSetDoc(userRef, {
          uid: user.uid,
          name,
          email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true }, 3000); // 3s timeout
      } catch (wErr) {
        // log only; do not block the flow
        console.warn('Firestore profile write skipped:', wErr?.message || wErr);
      }

      setLoading(false);
      return showSuccessThenGoHome('Account created successfully. Welcome to RentTime!');
    } catch (err) {
      console.error('Sign Up Error:', err);
      setLoading(false);
      let uiMsg = 'Failed to create an account. Please try again.';
      if (err?.code === 'auth/email-already-in-use') uiMsg = 'This email address is already in use.';
      setError(uiMsg);
      return showError(uiMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm text-center">{error}</p>
        )}

        {/* Email/Password Sign Up */}
        <form onSubmit={handleSignUp} noValidate className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input id="name" type="text" value={name} onChange={handleInputChange} required
                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input id="email" type="email" value={email} onChange={handleInputChange} required
                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" value={password} onChange={handleInputChange} required
                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={handleInputChange} required
                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google sign-up → success হলে একই SweetAlert + redirect */}
        <SignInWithGoogle
          onSuccess={() => showSuccessThenGoHome('Signed up with Google. Welcome!')}
          onError={(msg) => showError(msg || 'Google sign-in failed.')}
        />

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
