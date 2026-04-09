import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchAddresses, addAddress, deleteAddress, clearAddressError } from '../../redux/slices/addressSlice';
import { motion, AnimatePresence } from 'framer-motion';

const AddressBook = () => {
    const dispatch = useDispatch();
    const { addresses, loading, error } = useSelector((state) => state.addresses);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        city: '',
        street: '',
        postalCode: '',
        country: ''
    });

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(addAddress(formData));
        setFormData({ city: '', street: '', postalCode: '', country: '' });
        setShowForm(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteAddress(id));
    };

    return (
        <div className="user-profile__address-book">
            <header className="user-profile__header">
                <div className="user-profile__header-row">
                    <div>
                        <h2>Address Book</h2>
                        <p>Manage your delivery addresses.</p>
                    </div>
                    <button
                        className="user-profile__add-btn"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '✕ Cancel' : '+ Add Address'}
                    </button>
                </div>
            </header>

            {error && (
                <div className="user-profile__alert user-profile__alert--error">
                    {error}
                    <button onClick={() => dispatch(clearAddressError())} className="user-profile__alert-close">✕</button>
                </div>
            )}

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        className="user-profile__address-form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="user-profile__form-row">
                            <div className="user-profile__form-group">
                                <label className="user-profile__form-label">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="user-profile__form-input"
                                    placeholder="e.g. Kyiv"
                                    required
                                />
                            </div>
                            <div className="user-profile__form-group">
                                <label className="user-profile__form-label">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="user-profile__form-input"
                                    placeholder="e.g. Ukraine"
                                    required
                                />
                            </div>
                        </div>

                        <div className="user-profile__form-group">
                            <label className="user-profile__form-label">Street Address</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                                className="user-profile__form-input"
                                placeholder="e.g. Khreshchatyk 1, Apt 12"
                                required
                            />
                        </div>

                        <div className="user-profile__form-row">
                            <div className="user-profile__form-group">
                                <label className="user-profile__form-label">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className="user-profile__form-input"
                                    placeholder="e.g. 01001"
                                    required
                                />
                            </div>
                            <div className="user-profile__form-group" /> {/* Spacer */}
                        </div>

                        <footer className="user-profile__footer">
                            <button type="submit" className="user-profile__save-btn" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Address'}
                            </button>
                        </footer>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Address Cards */}
            <div className="user-profile__address-grid">
                {loading && addresses.length === 0 ? (
                    <p className="user-profile__empty-text">Loading addresses…</p>
                ) : addresses.length === 0 ? (
                    <div className="user-profile__empty-state">
                        <span className="user-profile__empty-icon">📍</span>
                        <p className="user-profile__empty-text">No saved addresses yet.</p>
                        <p className="user-profile__empty-subtext">Add your first delivery address to get started.</p>
                    </div>
                ) : (
                    addresses.map((addr) => (
                        <motion.div
                            key={addr.id}
                            className="user-profile__address-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            layout
                        >
                            <div className="user-profile__address-card-body">
                                <p className="user-profile__address-street">{addr.street}</p>
                                <p className="user-profile__address-city">
                                    {addr.city}, {addr.postalCode}
                                </p>
                                <p className="user-profile__address-country">{addr.country}</p>
                            </div>
                            <button
                                className="user-profile__address-delete"
                                onClick={() => handleDelete(addr.id)}
                                aria-label="Delete address"
                            >
                                🗑
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AddressBook;
