import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Users, DollarSign, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchDashboardStats, fetchAllOrders } from '../../../redux/slices/adminSlice';

const API_BASE = (import.meta.env.VITE_API_KEY || 'http://localhost:8080/api/v1');

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
    <div className="stat-card">
        <div className="stat-card__icon" style={{ backgroundColor: `${color}20`, color }}>
            <Icon size={24} />
        </div>
        <div className="stat-card__info">
            <h3>{loading ? '—' : value}</h3>
            <p>{title}</p>
        </div>
    </div>
);

const statusClass = (status) => {
    const map = {
        IN_PROCESS: 'in-process',
        COMPLETED: 'completed',
        CANCELED: 'canceled',
        READY_TO_PICKUP: 'ready-to-pickup',
    };
    return map[status] || 'in-process';
};

const statusLabel = (status) => {
    const map = {
        IN_PROCESS: 'In Process',
        COMPLETED: 'Completed',
        CANCELED: 'Canceled',
        READY_TO_PICKUP: 'Ready to Pickup',
    };
    return map[status] || status;
};

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, statsLoading, orders, ordersLoading } = useSelector(s => s.admin);
    const user = useSelector(s => s.user);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const recentOrders = [...(orders || [])]
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 5);

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back, {user.firstName || 'Admin'}</p>
            </header>

            <div className="stats-grid">
                <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="#4CAF50" loading={statsLoading} />
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="#2196F3" loading={statsLoading} />
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue?.toFixed(2) || '0.00'}`} icon={DollarSign} color="#9C27B0" loading={statsLoading} />
                <StatCard title="Total Products" value={stats.totalProducts} icon={Package} color="#FF9800" loading={statsLoading} />
            </div>

            <div className="dashboard-content">
                <div className="recent-orders">
                    <h2>Recent Orders</h2>
                    {ordersLoading ? (
                        <div className="admin-loading">
                            <div className="spinner" />
                            <span>Loading orders...</span>
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="admin-empty">
                            <ShoppingBag size={48} className="admin-empty__icon" />
                            <h3>No orders yet</h3>
                            <p>Orders will appear here once customers start placing them.</p>
                        </div>
                    ) : (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Status</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <React.Fragment key={order.id}>
                                            <tr onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} style={{ cursor: 'pointer' }}>
                                                <td>
                                                    {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </td>
                                                <td>#{order.id}</td>
                                                <td>{order.user?.firstname || '—'} {order.user?.lastname || ''}</td>
                                                <td>
                                                    <span className={`status-badge status-badge--${statusClass(order.orderStatus)}`}>
                                                        {statusLabel(order.orderStatus)}
                                                    </span>
                                                </td>
                                                <td>{order.orderItems?.length || 0}</td>
                                                <td>${order.totalPrice?.toFixed(2)}</td>
                                                <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}</td>
                                            </tr>
                                            {expandedOrder === order.id && (
                                                <tr className="order-items-row">
                                                    <td colSpan={7}>
                                                        <div className="order-items-list">
                                                            {order.orderItems?.map((item, i) => (
                                                                <div key={i} className="order-item-card">
                                                                    <img src={`${API_BASE}/products/images/${item.imageId}`} alt={item.name} onError={e => e.target.style.display = 'none'} />
                                                                    <div className="order-item-card__info">
                                                                        <div className="name">{item.name}</div>
                                                                        <div className="meta">{item.count}× ${item.price?.toFixed(2)}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
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
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
