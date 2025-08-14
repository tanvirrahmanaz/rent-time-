import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import PrivateRoute from './components/Routes/PrivateRoute';

// থিম এবং অন্যান্য ইমপোর্ট
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

// লেআউট এবং পেইজগুলো ইমপোর্ট করুন
import MainLayout from './layouts/MainLayout';
import HomePage from './components/Layout/HomeLayout';
import LoginPage from './components/pages/Login';
import SignUpPage from './components/pages/SignUpPage';
import NotFoundPage from './components/pages/NotFoundPage';
import CreatePostPage from './components/pages/CreatePostPage';
import PostDetailsPage from './components/pages/PostDetailsPage';
import RoommatePage from './components/pages/RoommatePage';
import HousePage from './components/pages/HousePage';
import DashboardPage from './components/pages/DashboardPage';
import BlogListPage from './components/pages/BlogListPage';
import BlogPostPage from './components/pages/BlogPostPage';
import BookingRequestsPage from './components/pages/BookingRequestsPage';
import MyRequestsPage from './components/pages/MyRequestsPage';

// import App from './App.jsx'; // App.jsx এর আর প্রয়োজন নেই

// রাউটার তৈরি করুন
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // মূল লেআউট
    errorElement: <NotFoundPage />, // যেকোনো রুটের ভুলে এই পেইজ দেখাবে
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },

      {
        path: "/create-post",
        element: (
          <PrivateRoute>
            <CreatePostPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/post/:id", // নতুন ডাইনামিক রুট
        element: <PostDetailsPage />,
      },
      {
        path: "/house",
        element: <HousePage />,
      },
      {
        path: "/roommate",
        element: <RoommatePage />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/blog",
        element: <BlogListPage />,
      },
      {
        path: "/blog/:slug", // ডাইনামিক রুট
        element: <BlogPostPage />,
      },
      {
        path: "/dashboard/booking-requests",
        element: (<PrivateRoute><BookingRequestsPage /></PrivateRoute>),
      },
      {
    path: "/dashboard/my-requests",
    element: (<PrivateRoute><MyRequestsPage /></PrivateRoute>),
},

      // এখানে আপনার অন্যান্য পেইজের জন্য রুট যোগ করতে পারেন
      // যেমন: /house, /roommate, /blog ইত্যাদি
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* <App /> এর পরিবর্তে RouterProvider ব্যবহার করুন */}
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);