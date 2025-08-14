import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';

// থিম এবং অন্যান্য ইমপোর্ট
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme'; 

// লেআউট এবং পেইজগুলো ইমপোর্ট করুন
import MainLayout from './layouts/MainLayout';
import HomePage from './components/Layout/HomeLayout';
import LoginPage from './components/pages/Login';
import SignUpPage from './components/pages/SignUpPage';
import NotFoundPage from './components/pages/NotFoundPage';
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