import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { postOrder } from '../../redux/slices/ordersSlice.js';
import { clearCart } from '../../redux/slices/cartSlice.js';
import { fetchAddresses } from '../../redux/slices/addressSlice.js';
import { Spinner, InlineError, useToast } from '../../components/EdgeStates';
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../../components/animations/PageTransition.jsx";
import FadeInUp from "../../components/animations/FadeInUp.jsx";
import './Checkout.scss';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();

    const { items, totalPrice } = useSelector((state) => state.cart);
    const { firstName, lastName, email, isAuthenticated } = useSelector((state) => state.user);
    const { addresses: savedAddresses, loading: addressesLoading } = useSelector((state) => state.addresses);
    const { loading, error } = useSelector((state) => state.orders);

    const [showAddressSelect, setShowAddressSelect] = useState(false);

    const [formData, setFormData] = useState({
        fullName: `${firstName} ${lastName}`.trim(),
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        deliveryNotes: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Fetch addresses on mount
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchAddresses());
        }
    }, [dispatch, isAuthenticated]);

    // Auto-fill first address if available
    useEffect(() => {
        if (savedAddresses.length > 0 && !formData.address) {
            const primary = savedAddresses[0];
            setFormData(prev => ({
                ...prev,
                address: primary.street,
                city: primary.city,
                postalCode: primary.postalCode
            }));
        }
    }, [savedAddresses]);

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0 && !orderSuccess) {
            navigate('/cart');
        }
    }, [items, navigate, orderSuccess]);

    const handleSelectAddress = (addr) => {
        setFormData(prev => ({
            ...prev,
            address: addr.street,
            city: addr.city,
            postalCode: addr.postalCode
        }));
        setShowAddressSelect(false);
        toast.info('Address updated from your book');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }
        if (!formData.address.trim()) errors.address = 'Delivery address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        // Build the products list for the backend.
        // Regular items map 1:1. Custom bouquets are expanded into their
        // constituent sub-items (each has a real numeric product ID).
        const products = [];
        items.forEach(item => {
            if (item.type === 'CUSTOM_BOUQUET' && Array.isArray(item.items)) {
                item.items.forEach(sub => {
                    products.push({
                        id: sub.id,
                        name: sub.name,
                        description: sub.description || '',
                        price: sub.price,
                        count: sub.count,
                        available: sub.available !== undefined ? String(sub.available) : "true"
                    });
                });
            } else {
                products.push({
                    id: item.id,
                    name: item.name,
                    description: item.description || '',
                    price: item.price,
                    count: item.count,
                    available: item.available !== undefined ? String(item.available) : "true"
                });
            }
        });

        const orderData = { products };

        try {
            await dispatch(postOrder(orderData)).unwrap();
            setOrderSuccess(true);
            dispatch(clearCart());
            toast.success('Order placed successfully!');
            setTimeout(() => navigate('/orders'), 1500);
        } catch (err) {
            console.error('Order failed:', err);
        }
    };

    const getImageUrl = (item) => {
        return item.image?.imageId
            ? `${import.meta.env.VITE_API_KEY}/products/images/${item.image.imageId}`
            : 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&q=80';
    };

    if (orderSuccess) {
        return (
            <PageTransition>
                <div className="checkout-page">
                    <main className="checkout">
                        <div className="checkout__container">
                            <motion.div
                                className="checkout__success"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="success-icon">
                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                        <circle cx="32" cy="32" r="32" fill="#10b981" fillOpacity="0.1" />
                                        <path d="M20 32L28 40L44 24" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h1>Order Placed Successfully!</h1>
                                <p>Thank you for your order. You will be redirected to your orders page...</p>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="checkout-page">
                <main className="checkout">
                    <div className="checkout__container">
                        <FadeInUp className="checkout__form-section">
                            <div className="checkout__form-section-inner">
                                <h1 className="checkout__title">Checkout</h1>
                                <div className="checkout__form">
                                    <div className="form__header">
                                        <h2 className="form__section-title">Delivery Information</h2>
                                        {savedAddresses.length > 0 && (
                                            <button
                                                type="button"
                                                className="form__address-btn"
                                                onClick={() => setShowAddressSelect(!showAddressSelect)}
                                            >
                                                {showAddressSelect ? 'Close' : 'Use Saved Address'}
                                            </button>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {showAddressSelect && (
                                            <motion.div
                                                className="address-select-dropdown"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                            >
                                                {savedAddresses.map((addr) => (
                                                    <div
                                                        key={addr.id}
                                                        className="address-option"
                                                        onClick={() => handleSelectAddress(addr)}
                                                    >
                                                        <p className="address-option__street">{addr.street}</p>
                                                        <p className="address-option__details">{addr.city}, {addr.postalCode}</p>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="form__group">
                                        <label htmlFor="fullName">Full Name *</label>
                                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className={formErrors.fullName ? 'error' : ''} />
                                        <InlineError message={formErrors.fullName} show={!!formErrors.fullName} />
                                    </div>
                                    <div className="form__group">
                                        <label htmlFor="phone">Phone Number *</label>
                                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" className={formErrors.phone ? 'error' : ''} />
                                        <InlineError message={formErrors.phone} show={!!formErrors.phone} />
                                    </div>
                                    <div className="form__group">
                                        <label htmlFor="address">Street Address *</label>
                                        <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className={formErrors.address ? 'error' : ''} />
                                        <InlineError message={formErrors.address} show={!!formErrors.address} />
                                    </div>
                                    <div className="form__row">
                                        <div className="form__group">
                                            <label htmlFor="city">City *</label>
                                            <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} className={formErrors.city ? 'error' : ''} />
                                            <InlineError message={formErrors.city} show={!!formErrors.city} />
                                        </div>
                                        <div className="form__group">
                                            <label htmlFor="postalCode">Postal Code *</label>
                                            <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={formErrors.postalCode ? 'error' : ''} />
                                            <InlineError message={formErrors.postalCode} show={!!formErrors.postalCode} />
                                        </div>
                                    </div>
                                    <div className="form__group">
                                        <label htmlFor="deliveryNotes">Delivery Notes (Optional)</label>
                                        <textarea id="deliveryNotes" name="deliveryNotes" value={formData.deliveryNotes} onChange={handleInputChange} rows="3" placeholder="Any special instructions for delivery..." />
                                    </div>
                                    {error && (
                                        <div className="checkout__error">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M10 6V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <circle cx="10" cy="14" r="0.75" fill="currentColor" />
                                            </svg>
                                            <span>{error}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FadeInUp>

                        <FadeInUp delay={0.2} className="checkout__summary">
                            <div className="order-summary">
                                <h2 className="order-summary__title">Order Summary</h2>
                                <div className="order-summary__items">
                                    {items.map((item) => (
                                        <div key={item.id} className="summary-item">
                                            <div className="summary-item__image">
                                                <img src={getImageUrl(item)} alt={item.name} />
                                            </div>
                                            <div className="summary-item__details">
                                                <h3>{item.name}</h3>
                                                <p>Qty: {item.count}</p>
                                            </div>
                                            <div className="summary-item__price">${(item.price * item.count).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-summary__totals">
                                    <div className="order-summary__row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
                                    <div className="order-summary__row"><span>Shipping</span><span>Free</span></div>
                                    <div className="order-summary__total"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
                                </div>
                                <motion.button
                                    className="order-summary__submit"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" variant="light" />
                                            <span style={{ marginLeft: '8px' }}>Processing...</span>
                                        </>
                                    ) : 'Place Order'}
                                </motion.button>
                                <p className="order-summary__note">By placing your order, you agree to our terms and conditions.</p>
                            </div>
                        </FadeInUp>
                    </div>
                </main>
            </div>
        </PageTransition>
    );
};

export default Checkout;
