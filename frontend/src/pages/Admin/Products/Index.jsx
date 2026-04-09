import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Plus, Pencil, Trash2, Search, Upload, X, Flower2 } from 'lucide-react';
import {
    fetchFlowers, createFlower, updateFlower, deleteFlower,
    fetchBouquets, createBouquet, updateBouquet, deleteBouquet,
    clearAdminError, clearSuccessMessage,
} from '../../../redux/slices/adminSlice';

const API_BASE = (import.meta.env.VITE_API_KEY || 'http://localhost:8080/api/v1');
const FLOWER_TYPES = ['FLOWER', 'GREENERY', 'PACKAGING'];

const Products = () => {
    const dispatch = useDispatch();
    const { flowers, flowersLoading, bouquets, bouquetsLoading, error, successMessage } = useSelector(s => s.admin);

    const [tab, setTab] = useState('flowers');
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Form state
    const [form, setForm] = useState({ name: '', description: '', price: '', count: '', available: 'true', flowerType: 'FLOWER', flowerIds: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchFlowers());
        dispatch(fetchBouquets());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            const t = setTimeout(() => dispatch(clearSuccessMessage()), 3000);
            return () => clearTimeout(t);
        }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (error) {
            const t = setTimeout(() => dispatch(clearAdminError()), 5000);
            return () => clearTimeout(t);
        }
    }, [error, dispatch]);

    const items = tab === 'flowers' ? flowers : bouquets;
    const loading = tab === 'flowers' ? flowersLoading : bouquetsLoading;

    const filtered = (items || []).filter(item =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => {
        setEditing(null);
        setForm({ name: '', description: '', price: '', count: '', available: 'true', flowerType: 'FLOWER', flowerIds: '' });
        setImageFile(null);
        setImagePreview(null);
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            name: item.name || '',
            description: item.description || '',
            price: item.price?.toString() || '',
            count: item.count || '',
            available: item.available || 'true',
            flowerType: item.flowerType || 'FLOWER',
            flowerIds: item.flowerIds ? [...item.flowerIds].join(', ') : '',
        });
        setImageFile(null);
        setImagePreview(item.image ? `${API_BASE}/products/images/${item.image.imageId}` : null);
        setModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile && !editing) return;
        setSubmitting(true);

        const data = {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            count: form.count,
            available: form.available,
        };

        try {
            if (tab === 'flowers') {
                data.flowerType = form.flowerType;
                if (editing) {
                    await dispatch(updateFlower({ id: editing.id, flowerData: data, imageFile: imageFile || new Blob() })).unwrap();
                } else {
                    await dispatch(createFlower({ flowerData: data, imageFile })).unwrap();
                }
                dispatch(fetchFlowers());
            } else {
                data.flowerIds = form.flowerIds ? form.flowerIds.split(',').map(s => parseInt(s.trim())).filter(Boolean) : [];
                if (editing) {
                    await dispatch(updateBouquet({ id: editing.id, bouquetData: data, imageFile: imageFile || new Blob() })).unwrap();
                } else {
                    await dispatch(createBouquet({ bouquetData: data, imageFile })).unwrap();
                }
                dispatch(fetchBouquets());
            }
            setModalOpen(false);
        } catch (err) {
            // error handled by redux
        }
        setSubmitting(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        if (tab === 'flowers') {
            await dispatch(deleteFlower(deleteTarget.id));
            dispatch(fetchFlowers());
        } else {
            await dispatch(deleteBouquet(deleteTarget.id));
            dispatch(fetchBouquets());
        }
        setDeleteTarget(null);
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your flowers and bouquets</p>
                </div>
                <button className="admin-btn admin-btn--primary" onClick={openCreate}>
                    <Plus size={18} /> Add {tab === 'flowers' ? 'Flower' : 'Bouquet'}
                </button>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button className={`admin-tabs__tab ${tab === 'flowers' ? 'admin-tabs__tab--active' : ''}`} onClick={() => setTab('flowers')}>
                    Flowers ({flowers?.length || 0})
                </button>
                <button className={`admin-tabs__tab ${tab === 'bouquets' ? 'admin-tabs__tab--active' : ''}`} onClick={() => setTab('bouquets')}>
                    Bouquets ({bouquets?.length || 0})
                </button>
            </div>

            {/* Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={18} className="admin-search__icon" />
                    <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="admin-loading"><div className="spinner" /><span>Loading products...</span></div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">
                    <Package size={48} className="admin-empty__icon" />
                    <h3>No {tab} found</h3>
                    <p>{search ? 'Try adjusting your search.' : `Add your first ${tab === 'flowers' ? 'flower' : 'bouquet'} to get started.`}</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Available</th>
                                {tab === 'flowers' && <th>Type</th>}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        {item.image ? (
                                            <img className="table-thumb" src={`${API_BASE}/products/images/${item.image.imageId}`} alt={item.name} onError={e => e.target.style.display = 'none'} />
                                        ) : (
                                            <div className="table-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Flower2 size={20} color="#ccc" />
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <strong>{item.name}</strong>
                                        {item.description && <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{item.description.substring(0, 60)}{item.description.length > 60 ? '…' : ''}</div>}
                                    </td>
                                    <td>${item.price?.toFixed(2)}</td>
                                    <td>
                                        <span className={`enabled-dot enabled-dot--${item.available === 'true' || item.available === true}`} />
                                        {item.available === 'true' || item.available === true ? 'Yes' : 'No'}
                                    </td>
                                    {tab === 'flowers' && <td><span className="role-badge role-badge--user">{item.flowerType}</span></td>}
                                    <td>
                                        <div className="btn-group">
                                            <button className="admin-btn admin-btn--ghost admin-btn--icon" onClick={() => openEdit(item)} title="Edit">
                                                <Pencil size={16} />
                                            </button>
                                            <button className="admin-btn admin-btn--ghost admin-btn--icon" onClick={() => setDeleteTarget(item)} title="Delete" style={{ color: '#D32F2F' }}>
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

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h2>{editing ? 'Edit' : 'Add'} {tab === 'flowers' ? 'Flower' : 'Bouquet'}</h2>
                            <button className="admin-btn admin-btn--ghost admin-btn--icon" onClick={() => setModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-modal__body">
                                <div className="admin-form-row">
                                    <div className="admin-form-group">
                                        <label>Name</label>
                                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>Price</label>
                                        <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="admin-form-group">
                                    <label>Description</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </div>
                                <div className="admin-form-row">
                                    <div className="admin-form-group">
                                        <label>Count</label>
                                        <input value={form.count} onChange={e => setForm({ ...form, count: e.target.value })} />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>Available</label>
                                        <select value={form.available} onChange={e => setForm({ ...form, available: e.target.value })}>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </div>
                                {tab === 'flowers' && (
                                    <div className="admin-form-group">
                                        <label>Flower Type</label>
                                        <select value={form.flowerType} onChange={e => setForm({ ...form, flowerType: e.target.value })}>
                                            {FLOWER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                )}
                                {tab === 'bouquets' && (
                                    <div className="admin-form-group">
                                        <label>Flower IDs (comma-separated)</label>
                                        <input value={form.flowerIds} onChange={e => setForm({ ...form, flowerIds: e.target.value })} placeholder="1, 2, 3" />
                                    </div>
                                )}
                                <div className="admin-form-group">
                                    <label>Image {!editing && '*'}</label>
                                    <div className="image-upload-zone">
                                        {imagePreview && <img src={imagePreview} className="image-upload-zone__preview" alt="Preview" />}
                                        <Upload size={24} className="image-upload-zone__icon" />
                                        <div className="image-upload-zone__text">{imageFile ? imageFile.name : 'Click or drag to upload image'}</div>
                                        <input type="file" accept="image/*" onChange={handleFileChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="admin-modal__footer">
                                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteTarget && (
                <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="admin-modal__body">
                            <div className="confirm-dialog">
                                <div className="confirm-dialog__icon"><Trash2 size={28} /></div>
                                <h2>Delete {deleteTarget.name}?</h2>
                                <p>This will permanently remove this product. This action cannot be undone.</p>
                                <div className="btn-group">
                                    <button className="admin-btn admin-btn--secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                                    <button className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toasts */}
            {successMessage && <div className="admin-toast admin-toast--success">{successMessage}</div>}
            {error && <div className="admin-toast admin-toast--error">{error}</div>}
        </div>
    );
};

export default Products;
