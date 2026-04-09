import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { verifyEmail } from '../../redux/slices/userSlice';
import AuthLayout from '../Auth/AuthLayout';
import luxuryImage from '../../assets/luxury_floral_editorial.png';
import PageTransition from '../../components/animations/PageTransition';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.user);

    useEffect(() => {
        if (token) {
            dispatch(verifyEmail(token));
        }
    }, [token, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, navigate]);

    // Content based on state
    const renderContent = () => {
        if (!token) {
            return (
                <div style={{ textAlign: 'center', color: '#F9F8F4' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>Invalid Link</h2>
                    <p style={{ opacity: 0.7, marginBottom: '2rem' }}>
                        The verification link is missing or invalid.
                    </p>
                    <Link to="/login" className="auth-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        Back to Login
                    </Link>
                </div>
            );
        }

        if (loading) {
            return (
                <div style={{ textAlign: 'center', color: '#F9F8F4' }}>
                    <div className="spinner" style={{
                        margin: '0 auto 1.5rem',
                        width: '40px', height: '40px',
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <h2 style={{ fontSize: '24px' }}>Verifying your email...</h2>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ textAlign: 'center', color: '#F9F8F4' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        background: 'rgba(255, 100, 100, 0.2)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF8A8A" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>Verification Failed</h2>
                    <p style={{ opacity: 0.7, marginBottom: '2rem' }}>{error}</p>
                    <Link to="/login" className="auth-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        Back to Login
                    </Link>
                </div>
            );
        }

        if (isAuthenticated) {
            return (
                <div style={{ textAlign: 'center', color: '#F9F8F4' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        background: 'rgba(100, 255, 100, 0.2)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A8E6CF" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>Email Verified!</h2>
                    <p style={{ opacity: 0.7, marginBottom: '2rem' }}>
                        Thank you for verifying your email. You are now logged in.
                        <br />Redirecting you to the home page...
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <PageTransition>
            <AuthLayout title="Email Verification" visualImage={luxuryImage}>
                {renderContent()}
            </AuthLayout>
        </PageTransition>
    );
};

export default VerifyEmail;
