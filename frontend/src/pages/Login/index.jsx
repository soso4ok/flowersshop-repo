import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logUser, getUser, clearError } from "../../redux/slices/userSlice.js";
import { fetchFavoriteIds } from "../../redux/slices/favoritesSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { InlineError } from "../../components/EdgeStates";
import AuthLayout from "../Auth/AuthLayout.jsx";
import luxuryImage from "../../assets/luxury_floral_editorial.png";
import PageTransition from "../../components/animations/PageTransition.jsx";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error } = useSelector((state) => state.user);
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const validateForm = () => {
        const errors = {};
        if (!email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email';
        if (!password.trim()) errors.password = 'Password is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🔐 Login form submitted');

        if (!validateForm()) {
            console.log('❌ Form validation failed');
            return;
        }

        try {
            console.log('📤 Dispatching logUser with email:', email);

            // Use unwrap() to get the actual payload or throw on rejection
            const token = await dispatch(logUser({ email, password })).unwrap();
            console.log('✅ Login successful, token received');

            // Token is already saved to localStorage by the reducer
            // Now fetch user details to populate role/info for protected routes
            console.log('👤 Fetching user details...');
            await dispatch(getUser()).unwrap();
            dispatch(fetchFavoriteIds());
            console.log('✅ User details loaded, navigating to:', from);

            // Navigate after everything is ready
            navigate(from, { replace: true });
        } catch (error) {
            // Error is already set in Redux state by rejected action
            console.error('❌ Login failed:', error);
            // The error will be displayed via the InlineError component
        }
    };

    return (
        <PageTransition>
            <AuthLayout title="Welcome Back" visualImage={luxuryImage}>
                <form onSubmit={handleSubmit}>
                    <div className="error-container">
                        <InlineError message={error} show={!!error} />
                    </div>
                    <div className="auth-input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" autoComplete="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="your@email.com" className={formErrors.email ? 'error' : ''} />

                        <InlineError message={formErrors.email} show={!!formErrors.email} />
                    </div>
                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="••••••••" className={formErrors.password ? 'error' : ''} />

                        <InlineError message={formErrors.password} show={!!formErrors.password} />
                    </div>
                    <button className="auth-button" type="submit" disabled={loading}>
                        <span>{loading ? 'Logging in...' : 'Enter Floralia'}</span>
                        {!loading && (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.16666 10H15.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10.8333 5L15.8333 10L10.8333 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                    <div className="auth-footer">
                        <span>New to our boutique? </span>
                        <Link to='/reg'>Create an account</Link>
                    </div>
                </form>
            </AuthLayout>
        </PageTransition>
    );
};

export default LoginForm;