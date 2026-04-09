import React from 'react';
import './OrderAccordionItem.scss';

const OrderCard = ({ order }) => {
    const { id, orderDate, orderItems, totalPrice, orderStatus } = order;

    // Humanizer Logic for status badges
    const getStatusTheme = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case 'IN_PROCESS':
                return { label: 'Processing', class: 'status--processing' };
            case 'COMPLETED':
                return { label: 'Delivered', class: 'status--delivered' };
            case 'CANCELED':
                return { label: 'Cancelled', class: 'status--cancelled' };
            case 'READY_TO_PICKUP':
                return { label: 'Ready for Pickup', class: 'status--pickup' };
            default:
                return { label: status, class: 'status--default' };
        }
    };

    const status = getStatusTheme(orderStatus);
    const dateObj = orderDate ? new Date(orderDate) : new Date();
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
 
    const placeholderImage = 'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=200&q=80';
    const displayPrice = Number(totalPrice) || 0;
    const safeOrderItems = Array.isArray(orderItems) ? orderItems : [];
 
    return (
        <div className="order-card">
            <div className="order-card__header">
                <span className="order-card__date">{formattedDate}</span>
                <span className="order-card__total">${displayPrice.toFixed(2)}</span>
            </div>
 
            <div className="order-card__items">
                {safeOrderItems.slice(0, 5).map((item) => {
                    const apiKey = import.meta.env.VITE_API_KEY || '';
                    const itemImageUrl = item.imageId && apiKey
                        ? `${apiKey}/products/images/${item.imageId}`
                        : placeholderImage;
                    
                    return (
                        <div key={item.id} className="order-card__thumbnail">
                            <img
                                src={itemImageUrl}
                                alt={item.name || 'Order Item'}
                                onError={(e) => { e.target.src = placeholderImage; }}
                            />
                        </div>
                    );
                })}
                {safeOrderItems.length > 5 && (
                    <div className="order-card__more-badge">
                        +{safeOrderItems.length - 5}
                    </div>
                )}
            </div>

            <div className="order-card__footer">
                <div className={`status-badge ${status.class}`}>
                    {status.label}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
