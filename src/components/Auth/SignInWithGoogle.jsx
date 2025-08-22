// src/components/Auth/SignInWithGoogle.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';

const SignInWithGoogle = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // base API url (optional user sync)
  const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    window.__API_BASE_URL ||
    window.location.origin
  ).replace(/\/+$/, '');

  const defaultSuccess = async (msg = 'Signed in with Google!') => {
    try {
      await Swal.fire({
        title: 'Welcome! 🎉',
        text: msg,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        heightAuto: false,
      });
    } catch (_) {}
    navigate('/', { replace: true });
  };

  const defaultError = (msg = 'Google sign‑in failed. Please try again.') => {
    Swal.fire({
      title: 'Oops!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'OK',
      heightAuto: false,
    });
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 1) Firestore user doc upsert (merge)
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      await setDoc(
        userRef,
        {
          uid: user.uid,
          name: user.displayName || user.email,
          email: user.email,
          photoURL: user.photoURL || '',
          createdAt: userSnap.exists() ? userSnap.data()?.createdAt || serverTimestamp() : serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 2) (Optional) backend user sync with JWT
      try {
        if (API_BASE) {
          const token = await user.getIdToken();
          await fetch(`${API_BASE}/api/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // your verifyToken may use this; if not required, it's still fine
            },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              name: user.displayName || user.email,
              photoURL: user.photoURL || '',
            }),
          }).catch(() => {});
        }
      } catch (_) {
        // backend sync failure should not block login UX
      }

      setLoading(false);

      // 3) Prop callbacks or default UX
      if (typeof onSuccess === 'function') {
        onSuccess();
      } else {
        await defaultSuccess();
      }
    } catch (error) {
      console.error('Error during Google sign‑in:', error);
      setLoading(false);

      const msg =
        error?.message?.toString().replace('Firebase:', '').trim() ||
        'Google sign‑in failed. Please try again.';

      if (typeof onError === 'function') {
        onError(msg);
      } else {
        defaultError(msg);
      }
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      disabled={loading}
      className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
    >
      {/* Google Icon SVG (xmlns fixed) */}
      <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.94C34.353 4.882 29.353 2.5 24 2.5C11.318 2.5 2.5 11.318 2.5 24s8.818 21.5 21.5 21.5S45.5 36.682 45.5 24c0-1.573-.154-3.085-.436-4.564z"/>
        <path fill="#FF3D00" d="M6.306 14.691c2.259-3.83 6.26-6.6 10.994-7.689l-4.702-4.702C8.36 4.36 4.093 8.356 2.053 13.565l4.253 1.126z"/>
        <path fill="#4CAF50" d="M24 45.5c5.41 0 10.282-1.956 13.98-5.187l-4.253-4.253C30.95 38.634 27.65 40 24 40c-4.446 0-8.314-2.12-10.864-5.303l-4.957 4.957C12.316 43.146 17.84 45.5 24 45.5z"/>
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303a12.036 12.036 0 0 1-4.223 7.618l4.253 4.253C41.835 35.923 45.5 30.437 45.5 24c0-1.573-.154-3.085-.436-4.564z"/>
      </svg>
      {loading ? 'Continuing…' : 'Sign in with Google'}
    </button>
  );
};

export default SignInWithGoogle;
