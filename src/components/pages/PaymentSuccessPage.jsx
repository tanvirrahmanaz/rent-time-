// src/components/pages/PaymentSuccessPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Auth context (provides currentUser + loading)
  const { currentUser, loading: authLoading } = useAuth(); // uses central AuthProvider state:contentReference[oaicite:5]{index=5}

  // UI state
  const [status, setStatus] = useState('idle'); // idle | verifying | success | fail
  const [message, setMessage] = useState('Verifying your payment...');

  // Read session_id from URL
  const sessionId = useMemo(() => searchParams.get('session_id'), [searchParams]);

  // API base URL (fallbacks for robustness)
  const baseURL =
    import.meta.env.VITE_API_BASE_URL ||
    window.__API_BASE_URL ||
    `${window.location.origin.replace(/\/$/, '')}`;

  // Call server to verify payment
  const verifyPayment = async () => {
    try {
      setStatus('verifying');
      setMessage('Verifying your payment...');

      if (!sessionId) {
        setStatus('fail');
        setMessage('Missing session_id in URL.');
        return;
      }
      if (!currentUser) {
        setStatus('fail');
        setMessage('You must be logged in to verify the payment.');
        return;
      }

      const token = await currentUser.getIdToken();

      // POST /api/payments/verify-payment expects Bearer token (verifyToken):contentReference[oaicite:6]{index=6}
      const res = await fetch(`${baseURL}/api/payments/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!res.ok) {
        let serverMsg = 'Payment verification failed.';
        try {
          const data = await res.json();
          if (data?.message) serverMsg = data.message;
        } catch (_) {}
        throw new Error(serverMsg);
      }

      // Backend marks the Booking as Paid on success:contentReference[oaicite:7]{index=7}
      setStatus('success');
      setMessage('Payment successful! Your booking is confirmed.');
    } catch (err) {
      setStatus('fail');
      setMessage(err.message || 'There was an issue verifying your payment.');
    }
  };

  // Trigger verification only when auth state is ready
  useEffect(() => {
    if (authLoading) return; // wait until Auth initializes:contentReference[oaicite:8]{index=8}

    if (!sessionId) {
      setStatus('fail');
      setMessage('Missing session_id in URL.');
      return;
    }

    if (currentUser) {
      verifyPayment();
    } else {
      setStatus('fail');
      setMessage('Please log in to verify your payment.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, currentUser, sessionId]);

  const goToLogin = () =>
    navigate('/login', {
      replace: false,
      state: { from: location }, // so user can come back after login
    });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      {/* verifying */}
      {status === 'idle' || status === 'verifying' ? (
        <>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-6"></div>
          <h1 className="text-3xl font-bold text-gray-800">Payment Processed</h1>
          <p className="mt-4 text-lg text-gray-600">{message}</p>
        </>
      ) : null}

      {/* success */}
      {status === 'success' ? (
        <>
          <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800">Payment Successful</h1>
          <p className="mt-4 text-lg text-gray-600">{message}</p>

          {/* After success, user can review status on My Requests page */}
          <Link
            to="/dashboard/my-requests"
            className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700"
          >
            Back to My Requests
          </Link>
          {/* This route exists and is inside dashboard, protected by PrivateRoute in router config:contentReference[oaicite:9]{index=9}:contentReference[oaicite:10]{index=10} */}
        </>
      ) : null}

      {/* fail */}
      {status === 'fail' ? (
        <>
          <XCircle className="w-24 h-24 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800">Payment Verification Failed</h1>
          <p className="mt-4 text-lg text-gray-600">{message}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {!currentUser && (
              <button
                onClick={goToLogin}
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700"
              >
                Log in and Verify
              </button>
            )}
            <Link
              to="/dashboard/my-requests"
              className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300"
            >
              Go to My Requests
            </Link>
          </div>

          {/* Helpful tips */}
          <div className="mt-6 max-w-lg text-left text-sm text-gray-500">
            <ul className="list-disc ml-5 space-y-2">
              <li>Make sure you are logged in before verifying payment.:contentReference[oaicite:11]{index=11}</li>
              <li>
                Check your API base URL. Current baseURL detected:{' '}
                <code className="bg-gray-100 px-2 py-0.5 rounded">{baseURL}</code>
              </li>
              <li>
                The verify endpoint requires a valid session_id and Bearer token; on success your booking status becomes
                <strong> Paid</strong>. View it from Dashboard → My Requests.:contentReference[oaicite:12]{index=12}:contentReference[oaicite:13]{index=13}
              </li>
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PaymentSuccessPage;
