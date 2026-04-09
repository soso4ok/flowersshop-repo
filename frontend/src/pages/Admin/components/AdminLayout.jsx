import React from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users, BookOpen, Image, ArrowLeft } from "lucide-react";
import "../styles/admin.scss";

const AdminLayout = () => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin' ? 'active' : '';
        return location.pathname.startsWith(path) ? 'active' : '';
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar__logo">
                    <h2>Admin Panel</h2>
                </div>

                <nav className="admin-sidebar__nav">
                    <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>

                    <div className="nav-section-label">Catalog</div>
                    <Link to="/admin/products" className={`nav-item ${isActive('/admin/products')}`}>
                        <Package size={20} />
                        <span>Products</span>
                    </Link>
                    <Link to="/admin/blogs" className={`nav-item ${isActive('/admin/blogs')}`}>
                        <BookOpen size={20} />
                        <span>Blog Posts</span>
                    </Link>
                    <Link to="/admin/slides" className={`nav-item ${isActive('/admin/slides')}`}>
                        <Image size={20} />
                        <span>Slides</span>
                    </Link>

                    <div className="nav-section-label">Operations</div>
                    <Link to="/admin/orders" className={`nav-item ${isActive('/admin/orders')}`}>
                        <ShoppingBag size={20} />
                        <span>Orders</span>
                    </Link>
                    <Link to="/admin/users" className={`nav-item ${isActive('/admin/users')}`}>
                        <Users size={20} />
                        <span>Users</span>
                    </Link>
                </nav>

                <div className="admin-sidebar__footer">
                    <Link to="/" className="nav-item">
                        <ArrowLeft size={20} />
                        <span>Back to Shop</span>
                    </Link>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
