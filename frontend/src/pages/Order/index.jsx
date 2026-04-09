import React, { useState, useEffect } from 'react';
import { Flower2 } from 'lucide-react';

import './Order.scss'
import OrderCard from "../Components/OrderCard/OrderAccordionItem.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "../../redux/slices/ordersSlice.js";
import { EmptyState } from "../../components/EdgeStates";

import PageTransition from "../../components/animations/PageTransition.jsx";
import StaggerGrid from "../../components/animations/StaggerGrid.jsx";

const OrderConfirmation = () => {
    const dispatch = useDispatch()
    const { orders, loading } = useSelector((state) => state.orders)
    const { id: userId } = useSelector((state) => state.user)

    useEffect(() => {
        if (userId) {
            dispatch(fetchOrder({ id: userId }))
        }
    }, [userId, dispatch]);

    // Render loading skeletons
    const renderSkeletons = () => (
        <div className="orders-grid">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={`skeleton-${index}`}
                    className="skeleton"
                    style={{ height: '180px', borderRadius: '12px' }}
                />
            ))}
        </div>
    );

    return (
        <PageTransition>
            <div className="orders-page">
                <main className="orders-container">
                    <header className="orders-header">
                        <h1 className="orders-header__title">Your Order History</h1>
                        <p className="orders-header__subtitle">
                            A curated look back at your floral favorites.
                        </p>
                    </header>

                    {loading ? (
                        renderSkeletons()
                    ) : orders && orders.length > 0 ? (
                        <StaggerGrid className="orders-grid">
                            {orders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                />
                            ))}
                        </StaggerGrid>
                    ) : (
                        <div className="orders-empty">
                            <EmptyState
                                icon={Flower2}
                                title="No orders found"
                                message="Your garden is waiting to be planted. Let's start with something beautiful."
                                actionButton={{
                                    label: "Explore Boutique",
                                    href: "/"
                                }}
                            />
                        </div>
                    )}
                </main>
            </div>
        </PageTransition>
    );
};

export default OrderConfirmation;
