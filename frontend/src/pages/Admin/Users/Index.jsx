import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users as UsersIcon, Trash2, Search, Shield, ShieldOff } from 'lucide-react';
import {
    fetchAdminUsers, deleteAdminUser, updateUserRole,
    clearAdminError, clearSuccessMessage,
} from '../../../redux/slices/adminSlice';

const AdminUsers = () => {
    const dispatch = useDispatch();
    const { users, usersLoading, error, successMessage } = useSelector(s => s.admin);
    const currentUser = useSelector(s => s.user);
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => { dispatch(fetchAdminUsers()); }, [dispatch]);

    useEffect(() => {
        if (successMessage) { const t = setTimeout(() => dispatch(clearSuccessMessage()), 3000); return () => clearTimeout(t); }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (error) { const t = setTimeout(() => dispatch(clearAdminError()), 5000); return () => clearTimeout(t); }
    }, [error, dispatch]);

    const filtered = (users || []).filter(u =>
        u.firstname?.toLowerCase().includes(search.toLowerCase()) ||
        u.lastname?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const handleRoleToggle = (user) => {
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
        dispatch(updateUserRole({ email: user.email, role: newRole }));
    };

    const handleDelete = () => {
        if (deleteTarget) {
            dispatch(deleteAdminUser(deleteTarget.id));
            setDeleteTarget(null);
        }
    };

    const isSelf = (user) => user.email === currentUser.email;

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Users</h1>
                    <p>Manage registered users and their roles</p>
                </div>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={18} className="admin-search__icon" />
                    <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <span style={{ fontSize: 14, color: '#666' }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {usersLoading ? (
                <div className="admin-loading"><div className="spinner" /><span>Loading users...</span></div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">
                    <UsersIcon size={48} className="admin-empty__icon" />
                    <h3>No users found</h3>
                    <p>{search ? 'Try adjusting your search.' : 'No registered users yet.'}</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <strong>{user.firstname} {user.lastname}</strong>
                                        {isSelf(user) && <span style={{ fontSize: 11, color: '#999', marginLeft: 8 }}>(you)</span>}
                                    </td>
                                    <td>{user.email}</td>
                                    <td><span className={`role-badge role-badge--${user.role?.toLowerCase()}`}>{user.role}</span></td>
                                    <td>
                                        <span className={`enabled-dot enabled-dot--${user.enabled}`} />
                                        {user.enabled ? 'Active' : 'Inactive'}
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            <button
                                                className="admin-btn admin-btn--ghost admin-btn--sm"
                                                onClick={() => handleRoleToggle(user)}
                                                disabled={isSelf(user)}
                                                title={isSelf(user) ? "Can't change own role" : `Make ${user.role === 'ADMIN' ? 'User' : 'Admin'}`}
                                            >
                                                {user.role === 'ADMIN' ? <ShieldOff size={14} /> : <Shield size={14} />}
                                                {user.role === 'ADMIN' ? 'Demote' : 'Promote'}
                                            </button>
                                            <button
                                                className="admin-btn admin-btn--ghost admin-btn--icon"
                                                onClick={() => setDeleteTarget(user)}
                                                disabled={isSelf(user)}
                                                title={isSelf(user) ? "Can't delete yourself" : 'Delete user'}
                                                style={{ color: isSelf(user) ? '#ccc' : '#D32F2F' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
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
                                <h2>Delete {deleteTarget.firstname} {deleteTarget.lastname}?</h2>
                                <p>This will permanently remove this user and all their orders. This action cannot be undone.</p>
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

export default AdminUsers;
