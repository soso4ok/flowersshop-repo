import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import {
    fetchAllOrders, changeOrderStatus, deleteOrder,
    clearAdminError, clearSuccessMessage,
} from '../../../redux/slices/adminSlice';

const API_BASE = (import.meta.env.VITE_API_KEY || 'http://localhost:8080/api/v1');

const ORDER_STATUSES = ['IN_PROCESS', 'READY_TO_PICKUP', 'COMPLETED', 'CANCELED'];

const statusClass = (s) => ({
    IN_PROCESS: 'in-process', COMPLETED: 'completed',
    CANCELED: 'canceled', READY_TO_PICKUP: 'ready-to-pickup',
}[s] || 'in-process');

const statusLabel = (s) => ({
    IN_PROCESS: 'In Process', COMPLETED: 'Completed',
    CANCELED: 'Canceled', READY_TO_PICKUP: 'Ready to Pickup',
}[s] || s);

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, ordersLoading, error, successMessage } = useSelector(s => s.admin);
    const [search, setSearch] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => { dispatch(fetchAllOrders()); }, [dispatch]);

    useEffect(() => {
        if (successMessage) { const t = setTimeout(() => dispatch(clearSuccessMessage()), 3000); return () => clearTimeout(t); }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (error) { const t = setTimeout(() => dispatch(clearAdminError()), 5000); return () => clearTimeout(t); }
    }, [error, dispatch]);

    const filtered = (orders || []).filter(order => {
        const matchSearch = !search ||
            order.id?.toString().includes(search) ||
            order.user?.firstname?.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.lastname?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter;
        return matchSearch && matchStatus;
    }).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    const handleStatusChange = (orderId, newStatus) => {
        dispatch(changeOrderStatus({ orderId, newStatus }));
    };

    const handleDelete = () => {
        if (deleteTarget) {
            dispatch(deleteOrder(deleteTarget.id));
            setDeleteTarget(null);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Orders</h1>
                    <p>Manage customer orders and update their status</p>
                </div>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={18} className="admin-search__icon" />
                    <input placeholder="Search by ID or customer name..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="status-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="ALL">All Statuses</option>
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                </select>
            </div>

            {ordersLoading ? (
                <div className="admin-loading"><div className="spinner" /><span>Loading orders...</span></div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">
                    <ShoppingBag size={48} className="admin-empty__icon" />
                    <h3>No orders found</h3>
                    <p>{search || statusFilter !== 'ALL' ? 'Try adjusting your filters.' : 'Orders will appear here once placed.'}</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}></th>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => (
                                <React.Fragment key={order.id}>
                                    <tr>
                                        <td>
                                            <button className="admin-btn admin-btn--ghost admin-btn--icon"
                                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                                                {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </td>
                                        <td><strong>#{order.id}</strong></td>
                                        <td>{order.user?.firstname || '—'} {order.user?.lastname || ''}<br />
                                            <span style={{ fontSize: 12, color: '#999' }}>{order.user?.email}</span></td>
                                        <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}</td>
                                        <td>{order.orderItems?.length || 0}</td>
                                        <td><strong>${order.totalPrice?.toFixed(2)}</strong></td>
                                        <td>
                                            <select className="status-select" value={order.orderStatus}
                                                onChange={e => handleStatusChange(order.id, e.target.value)}>
                                                {ORDER_STATUSES.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <button className="admin-btn admin-btn--ghost admin-btn--icon" onClick={() => setDeleteTarget(order)}
                                                title="Delete" style={{ color: '#D32F2F' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedOrder === order.id && (
                                        <tr className="order-items-row">
                                            <td colSpan={8}>
                                                <div className="order-items-list">
                                                    {order.orderItems?.length ? order.orderItems.map((item, i) => (
                                                        <div key={i} className="order-item-card">
                                                            <img src={`${API_BASE}/products/images/${item.imageId}`} alt={item.name}
                                                                onError={e => e.target.style.display = 'none'} />
                                                            <div className="order-item-card__info">
                                                                <div className="name">{item.name}</div>
                                                                <div className="meta">{item.count}× ${item.price?.toFixed(2)}</div>
                                                            </div>
                                                        </div>
                                                    )) : <p style={{ color: '#999' }}>No items in this order</p>}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteTarget && (
                <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="admin-modal__body">
                            <div className="confirm-dialog">
                                <div className="confirm-dialog__icon"><Trash2 size={28} /></div>
                                <h2>Delete Order #{deleteTarget.id}?</h2>
                                <p>This will permanently remove this order and all its items. This action cannot be undone.</p>
                                <div className="btn-group">
                                    <button className="admin-btn admin-btn--secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                                    <button className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {successMessage && <div className="admin-toast admin-toast--success">{successMessage}</div>}
            {error && <div className="admin-toast admin-toast--error">{typeof error === 'string' ? error : 'An error occurred'}</div>}
        </div>
    );
};

export default Orders;
