import React from 'react'
import './App.css'
import { Route, BrowserRouter, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home/Home.jsx";
import { FlowerPage } from "./pages/FlowerPage/index.jsx";
import Orders from "./pages/Order/index.jsx";
import Cart from "./pages/Cart/index.jsx";
import Checkout from "./pages/Checkout/index.jsx";
import Login from "./pages/Login/index.jsx";
import Registration from "./pages/Registration/index.jsx";
import VerifyEmail from "./pages/Auth/VerifyEmail.jsx";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser, logout } from "./redux/slices/userSlice.js";
import { fetchFavoriteIds } from "./redux/slices/favoritesSlice.js";
import Blog from "./pages/Blog/index.jsx";
import BlogPost from "./pages/BlogPost/index.jsx";
import About from "./pages/About/index.jsx";
import Builder from "./pages/Builder/Index.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AnimatePresence, motion } from "framer-motion";
import ScrollToTop from "./components/utils/ScrollToTop.jsx";
import Preloader from "./components/ui/Preloader.jsx";
import { Header } from "./pages/Components/Header/Index.jsx";
import Footer from "./pages/Components/Footer/index.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";

import Wishlist from "./pages/Wishlist/Index.jsx";
import AdminRoute from "./pages/Admin/components/AdminRoute.jsx";
import AdminLayout from "./pages/Admin/components/AdminLayout.jsx";
import Dashboard from "./pages/Admin/Dashboard/Index.jsx";
import Products from "./pages/Admin/Products/Index.jsx";
import AdminOrders from "./pages/Admin/Orders/Index.jsx";
import AdminUsers from "./pages/Admin/Users/Index.jsx";
import AdminBlogs from "./pages/Admin/Blogs/Index.jsx";
import AdminSlides from "./pages/Admin/Slides/Index.jsx";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<FlowerPage />} />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                } />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <Checkout />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/about" element={<About />} />
                <Route path="/builder" element={<Builder />} />
                <Route path="/custom-bouquet" element={<Builder />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                    <ProtectedRoute>
                        <Wishlist />
                    </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="slides" element={<AdminSlides />} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    const dispatch = useDispatch();

    // Check if user has already seen the intro this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro') === 'true';
    const [isLoading, setIsLoading] = useState(!hasSeenIntro);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(getUser())
                .unwrap()
                .then(() => {
                    dispatch(fetchFavoriteIds());
                })
                .catch(() => {
                    dispatch(logout());
                });
        }
        // Preloader will handle setting isLoading to false
    }, [dispatch]);

    const handlePreloaderComplete = () => {
        setIsLoading(false);
    };

    // Parallax depth effect variants
    const contentVariants = {
        loading: {
            scale: 0.95,
            y: 40,
            transition: {
                duration: 0
            }
        },
        ready: {
            scale: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <>
            {/* Preloader Overlay */}
            {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

            <BrowserRouter>
                <ScrollToTop />
                <Header />
                {/* Main App Content with Depth Effect */}
                <motion.div
                    className="app-content"
                    variants={contentVariants}
                    initial="loading"
                    animate={isLoading ? "loading" : "ready"}
                    style={{
                        willChange: 'transform',
                        transformOrigin: 'center center',
                        minHeight: '100vh'
                    }}
                >
                    <AnimatedRoutes />
                </motion.div>
                <Footer />
            </BrowserRouter>
        </>
    )
}

export default App
