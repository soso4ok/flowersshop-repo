import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import {
    fetchSlides, createSlide, deleteSlide,
    clearAdminError, clearSuccessMessage,
} from '../../../redux/slices/adminSlice';

const API_BASE = (import.meta.env.VITE_API_KEY || 'http://localhost:8080/api/v1');

const Slides = () => {
    const dispatch = useDispatch();
    const { slides, slidesLoading, error, successMessage } = useSelector(s => s.admin);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => { dispatch(fetchSlides()); }, [dispatch]);

    useEffect(() => {
        if (successMessage) { const t = setTimeout(() => dispatch(clearSuccessMessage()), 3000); return () => clearTimeout(t); }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (error) { const t = setTimeout(() => dispatch(clearAdminError()), 5000); return () => clearTimeout(t); }
    }, [error, dispatch]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            await dispatch(createSlide(file)).unwrap();
            dispatch(fetchSlides());
        } catch (err) {
            // handled by redux
        }
        setUploading(false);
        e.target.value = '';
    };

    const handleDelete = () => {
        if (deleteTarget) {
            dispatch(deleteSlide(deleteTarget.id)).then(() => dispatch(fetchSlides()));
            setDeleteTarget(null);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Hero Slides</h1>
                    <p>Manage homepage carousel images</p>
                </div>
                <label className={`admin-btn admin-btn--primary ${uploading ? 'disabled' : ''}`} style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
                    <Plus size={18} /> {uploading ? 'Uploading...' : 'Upload Slide'}
                    <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
            </div>

            {slidesLoading ? (
                <div className="admin-loading"><div className="spinner" /><span>Loading slides...</span></div>
            ) : (slides || []).length === 0 ? (
                <div className="admin-empty">
                    <ImageIcon size={48} className="admin-empty__icon" />
                    <h3>No slides yet</h3>
                    <p>Upload images for the homepage carousel.</p>
                </div>
            ) : (
                <div className="slides-grid">
                    {slides.map(slide => (
                        <div key={slide.id} className="slide-card">
                            <img src={`${API_BASE}/products/images/${slide.imageId || slide.image?.imageId || slide.id}`} alt={`Slide ${slide.id}`}
                                onError={e => { e.target.src = ''; e.target.alt = 'Failed to load'; }} />
                            <div className="slide-card__overlay">
                                <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setDeleteTarget(slide)}>
                                    <Trash2 size={16} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteTarget && (
                <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="admin-modal__body">
                            <div className="confirm-dialog">
                                <div className="confirm-dialog__icon"><Trash2 size={28} /></div>
                                <h2>Delete this slide?</h2>
                                <p>This will remove the image from the homepage carousel.</p>
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

export default Slides;
