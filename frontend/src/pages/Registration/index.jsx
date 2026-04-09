import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { regUser, getUser, clearError } from "../../redux/slices/userSlice.js";
import { InlineError } from "../../components/EdgeStates";
import AuthLayout from "../Auth/AuthLayout.jsx";
import luxuryImage from "../../assets/luxury_floral_editorial.png";
import PageTransition from "../../components/animations/PageTransition.jsx";

const RegistrationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const { loading, error, registrationSuccess } = useSelector((state) => state.user);

    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const validate = () => {
        const errors = {};
        if (!inputs.firstName) errors.firstName = "First name is required";
        if (!inputs.lastName) errors.lastName = "Last name is required";
        if (!inputs.email) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(inputs.email)) errors.email = "Invalid email";
        if (!inputs.password) errors.password = "Password is required";
        else if (inputs.password.length < 4) errors.password = "Too short";
        if (inputs.password !== inputs.confirmPassword) {
            errors.confirmPassword = "Passwords match required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        dispatch(regUser({
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            email: inputs.email,
            password: inputs.password
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (registrationSuccess) {
        return (
            <PageTransition>
                <AuthLayout title="Check Your Inbox" visualImage={luxuryImage}>
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                        <div style={{
                            width: '64px', height: '64px',
                            background: 'rgba(44, 62, 46, 0.05)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2C3E2E" strokeWidth="1.5">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '24px', marginBottom: '1rem', color: '#2C3E2E' }}>Almost there!</h2>
                        <p style={{ color: 'rgba(44, 62, 46, 0.7)', lineHeight: '1.6', marginBottom: '2rem' }}>
                            We've sent a verification link to <strong>{inputs.email}</strong>.<br />
                            Please check your email to activate your account.
                        </p>
                        <Link to="/login" className="auth-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
                            Back to Sign In
                        </Link>
                    </div>
                </AuthLayout>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <AuthLayout title="Join Floralia" visualImage={luxuryImage} isRegister>
                <form onSubmit={handleSubmit}>
                    <div className="error-container">
                        <InlineError message={error} show={!!error} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="auth-input-group">
                            <label>First Name</label>
                            <input name="firstName" placeholder="John" onChange={handleChange} value={inputs.firstName} className={formErrors.firstName ? 'error' : ''} />
                            <div className="focus-line"></div>
                        </div>
                        <div className="auth-input-group">
                            <label>Last Name</label>
                            <input name="lastName" placeholder="Doe" onChange={handleChange} value={inputs.lastName} className={formErrors.lastName ? 'error' : ''} />
                            <div className="focus-line"></div>
                        </div>
                    </div>
                    <div className="auth-input-group">
                        <label>Email Address</label>
                        <input name="email" type="email" placeholder="john@doe.com" onChange={handleChange} value={inputs.email} className={formErrors.email ? 'error' : ''} />
                        <div className="focus-line"></div>
                        <InlineError message={formErrors.email} show={!!formErrors.email} />
                    </div>
                    <div className="auth-input-group">
                        <label>Password</label>
                        <input name="password" type="password" placeholder="••••••••" onChange={handleChange} value={inputs.password} className={formErrors.password ? 'error' : ''} />
                        <div className="focus-line"></div>
                        <InlineError message={formErrors.password} show={!!formErrors.password} />
                    </div>
                    <div className="auth-input-group">
                        <label>Confirm Password</label>
                        <input name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} value={inputs.confirmPassword} className={formErrors.confirmPassword ? 'error' : ''} />
                        <div className="focus-line"></div>
                    </div>
                    <button className="auth-button" type="submit" disabled={loading}>
                        <span>{loading ? 'Creating Account...' : 'Initialize Membership'}</span>
                        {!loading && (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.16666 10H15.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10.8333 5L15.8333 10L10.8333 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                    <div className="auth-footer">
                        <span>Already a member? </span>
                        <Link to='/login'>Sign in</Link>
                    </div>
                </form>
            </AuthLayout>
        </PageTransition>
    );
};

export default RegistrationPage;