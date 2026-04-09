import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { changePassword, clearPasswordStatus } from '../../redux/slices/userSlice';

const Security = () => {
    const dispatch = useDispatch();
    const { passwordLoading, passwordError, passwordSuccess } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        return () => {
            dispatch(clearPasswordStatus());
        };
    }, [dispatch]);

    useEffect(() => {
        if (passwordSuccess) {
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        }
    }, [passwordSuccess]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setValidationError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');
        dispatch(clearPasswordStatus());

        if (formData.newPassword.length < 6) {
            setValidationError('New password must be at least 6 characters long.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setValidationError('New passwords do not match.');
            return;
        }

        if (formData.oldPassword === formData.newPassword) {
            setValidationError('New password must be different from the current one.');
            return;
        }

        dispatch(changePassword({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword
        }));
    };

    return (
        <div className="user-profile__security">
            <header className="user-profile__header">
                <h2>Security</h2>
                <p>Update your password to keep your account secure.</p>
            </header>

            {passwordSuccess && (
                <div className="user-profile__alert user-profile__alert--success">
                    ✓ Password changed successfully.
                </div>
            )}

            {(passwordError || validationError) && (
                <div className="user-profile__alert user-profile__alert--error">
                    {validationError || passwordError}
                </div>
            )}

            <form className="user-profile__form" onSubmit={handleSubmit}>
                <div className="user-profile__form-group">
                    <label className="user-profile__form-label">Current Password</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        className="user-profile__form-input"
                        placeholder="Enter your current password"
                        required
                    />
                </div>

                <div className="user-profile__form-row">
                    <div className="user-profile__form-group">
                        <label className="user-profile__form-label">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="user-profile__form-input"
                            placeholder="Min. 6 characters"
                            required
                        />
                    </div>
                    <div className="user-profile__form-group">
                        <label className="user-profile__form-label">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="user-profile__form-input"
                            placeholder="Repeat new password"
                            required
                        />
                    </div>
                </div>

                <footer className="user-profile__footer">
                    <button
                        type="submit"
                        className="user-profile__save-btn"
                        disabled={passwordLoading}
                    >
                        {passwordLoading ? 'Changing...' : 'Change Password'}
                    </button>
                </footer>
            </form>
        </div>
    );
};

export default Security;
