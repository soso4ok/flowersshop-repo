import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useToast } from '../../components/EdgeStates/ToastProvider';
import AddressBook from './AddressBook';
import Security from './Security';
import './user-profile.scss';

const UserProfile = () => {
    const { firstName, lastName, email } = useSelector((state) => state.user);
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        setFormData({
            firstName: firstName || '',
            lastName: lastName || '',
            email: email || '',
            phone: '' // Assuming phone isn't in Redux yet or comes from elsewhere
        });
    }, [firstName, lastName, email]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSaving(false);
        toast.success("Profile updated successfully");
    };

    const tabs = [
        { id: 'general', label: 'General Info' },
        { id: 'security', label: 'Security' },
        { id: 'address', label: 'Address Book' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'security':
                return <Security />;
            case 'address':
                return <AddressBook />;
            case 'general':
            default:
                return (
                    <>
                        <header className="user-profile__header">
                            <h2>Account Settings</h2>
                            <p>Manage your personal details and preferences.</p>
                        </header>

                        <form className="user-profile__form" onSubmit={handleSave}>
                            <div className="user-profile__form-row">
                                <div className="user-profile__form-group">
                                    <label className="user-profile__form-label">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="user-profile__form-input"
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div className="user-profile__form-group">
                                    <label className="user-profile__form-label">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="user-profile__form-input"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            <div className="user-profile__form-group">
                                <label className="user-profile__form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    className="user-profile__form-input"
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="user-profile__form-group">
                                <label className="user-profile__form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="user-profile__form-input"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <footer className="user-profile__footer">
                                <button
                                    type="submit"
                                    className="user-profile__save-btn"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </footer>
                        </form>
                    </>
                );
        }
    };

    return (
        <motion.div
            className="user-profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="user-profile__container">
                <div className="user-profile__grid">
                    {/* Left Column (Sidebar/Nav) */}
                    <aside className="user-profile__nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`user-profile__nav-item ${activeTab === tab.id ? 'user-profile__nav-item--active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </aside>

                    {/* Right Column (Content) */}
                    <main className="user-profile__content">
                        {renderTabContent()}
                    </main>
                </div>
            </div>

            {/* Artistic Touch - Subtle Flower */}
            <div className="user-profile__bg-flower">
                <img src="/src/assets/2 flowers.svg" alt="" aria-hidden="true" />
            </div>
        </motion.div>
    );
};

export default UserProfile;
