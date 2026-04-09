import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Plus, Pencil, Trash2, Search, Upload, X } from 'lucide-react';
import {
    fetchBlogs, createBlog, updateBlog, deleteBlog,
    clearAdminError, clearSuccessMessage,
} from '../../../redux/slices/adminSlice';

const API_BASE = (import.meta.env.VITE_API_KEY || 'http://localhost:8080/api/v1');

const Blogs = () => {
    const dispatch = useDispatch();
    const { blogs, blogsLoading, error, successMessage } = useSelector(s => s.admin);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [form, setForm] = useState({ title: '', content: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { dispatch(fetchBlogs()); }, [dispatch]);

    useEffect(() => {
        if (successMessage) { const t = setTimeout(() => dispatch(clearSuccessMessage()), 3000); return () => clearTimeout(t); }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (error) { const t = setTimeout(() => dispatch(clearAdminError()), 5000); return () => clearTimeout(t); }
    }, [error, dispatch]);

    const filtered = (blogs || []).filter(b =>
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.content?.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => {
        setEditing(null);
        setForm({ title: '', content: '' });
        setImageFile(null);
        setImagePreview(null);
        setModalOpen(true);
    };

    const openEdit = (blog) => {
        setEditing(blog);
        setForm({ title: blog.title || '', content: blog.content || '' });
        setImageFile(null);
        setImagePreview(blog.image ? `${API_BASE}/products/images/${blog.image.imageId}` : null);
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
        setSubmitting(true);
        try {
            if (editing) {
                await dispatch(updateBlog({ id: editing.id, blogData: form })).unwrap();
            } else {
                if (!imageFile) { setSubmitting(false); return; }
                await dispatch(createBlog({ blogData: form, imageFile })).unwrap();
            }
            dispatch(fetchBlogs());
            setModalOpen(false);
        } catch (err) {
            // handled by redux
        }
        setSubmitting(false);
    };

    const handleDelete = () => {
        if (deleteTarget) {
            dispatch(deleteBlog(deleteTarget.id)).then(() => dispatch(fetchBlogs()));
            setDeleteTarget(null);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Blog Posts</h1>
                    <p>Manage your blog content</p>
                </div>
                <button className="admin-btn admin-btn--primary" onClick={openCreate}>
                    <Plus size={18} /> New Post
                </button>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={18} className="admin-search__icon" />
                    <input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {blogsLoading ? (
                <div className="admin-loading"><div className="spinner" /><span>Loading blogs...</span></div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">
                    <BookOpen size={48} className="admin-empty__icon" />
                    <h3>No blog posts found</h3>
                    <p>{search ? 'Try adjusting your search.' : 'Create your first blog post to get started.'}</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(blog => (
                                <tr key={blog.id}>
                                    <td>
                                        {blog.image ? (
                                            <img className="table-thumb" src={`${API_BASE}/products/images/${blog.image.imageId}`} alt={blog.title} onError={e => e.target.style.display = 'none'} />
                                        ) : (
                                            <div className="table-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BookOpen size={20} color="#ccc" />
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <strong>{blog.title}</strong>
                                        {blog.content && <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{blog.content.substring(0, 80)}{blog.content.length > 80 ? '…' : ''}</div>}
                                    </td>
                                    <td>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '—'}</td>
                                    <td>
                                        <div className="btn-group">
                                            <button className="admin-btn admin-btn--ghost admin-btn--icon" onClick={() => openEdit(blog)} title="Edit"><Pencil size={16} /></button>
                                            <button className="admin-btn admin-btn--ghost admin-btn--icon" onClick={() => setDeleteTarget(blog)} title="Delete" style={{ color: '#D32F2F' }}><Trash2 size={16} /></button>
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
                    <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h2>{editing ? 'Edit' : 'New'} Blog Post</h2>
                            <button className="admin-btn admin-btn--ghost admin-btn--icon" onClick={() => setModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-modal__body">
                                <div className="admin-form-group">
                                    <label>Title</label>
                                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                                </div>
                                <div className="admin-form-group">
                                    <label>Content</label>
                                    <textarea rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
                                </div>
                                {!editing && (
                                    <div className="admin-form-group">
                                        <label>Cover Image *</label>
                                        <div className="image-upload-zone">
                                            {imagePreview && <img src={imagePreview} className="image-upload-zone__preview" alt="Preview" />}
                                            <Upload size={24} className="image-upload-zone__icon" />
                                            <div className="image-upload-zone__text">{imageFile ? imageFile.name : 'Click to upload cover image'}</div>
                                            <input type="file" accept="image/*" onChange={handleFileChange} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="admin-modal__footer">
                                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : editing ? 'Update' : 'Publish'}
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
                                <h2>Delete "{deleteTarget.title}"?</h2>
                                <p>This will permanently remove this blog post. This action cannot be undone.</p>
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

export default Blogs;
