/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  fetchAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadImage,
} from '../../services/adminService';

const CATEGORIES = ['All', 'Annual Meet', 'Cultural', 'Yaoshang', 'Career', 'Campus', 'General'];

export default function GalleryAdminView({ darkMode = false }) {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('General');
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'vercel'
  const [imageUrl, setImageUrl] = useState('');
  const [sourceType, setSourceType] = useState('SUPABASE');
  const [displayOrder, setDisplayOrder] = useState(0);

  const loadGallery = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchAdminGallery(selectedCategory === 'All' ? '' : selectedCategory);
      setItems(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const openUploadModal = () => {
    setEditingItem(null);
    setTitle('');
    setCaption('');
    setCategory('General');
    setImageMode('upload');
    setImageUrl('');
    setSourceType('SUPABASE');
    setDisplayOrder(0);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setCaption(item.caption || '');
    setCategory(item.category || 'General');
    setImageMode(item.source_type === 'VERCEL' || item.image_url?.startsWith('http') ? 'vercel' : 'upload');
    setImageUrl(item.image_url || '');
    setSourceType(item.source_type || 'SUPABASE');
    setDisplayOrder(item.display_order ?? 0);
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadImage(file, 'gallery');
      if (res?.url) {
        setImageUrl(res.url);
        setSourceType('SUPABASE');
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return alert('Please upload an image or provide a valid image URL/path');

    setSaving(true);
    try {
      const payload = {
        title: title.trim() || 'Untitled Photo',
        caption: caption.trim(),
        imageUrl: imageUrl.trim(),
        sourceType: imageMode === 'upload' ? 'SUPABASE' : (sourceType || 'VERCEL'),
        category,
        displayOrder: Number(displayOrder) || 0,
      };

      if (editingItem) {
        await updateGalleryItem(editingItem.id, payload);
      } else {
        await createGalleryItem(payload);
      }
      setModalOpen(false);
      await loadGallery();
    } catch (err) {
      alert(`Failed to save photo: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, itemTitle) => {
    if (!window.confirm(`Delete photo "${itemTitle || 'Untitled'}"?`)) return;
    try {
      await deleteGalleryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  // Theme constants
  const textPrimary = darkMode ? '#FAF9FC' : '#1A1429';
  const textSecondary = darkMode ? '#A89EC4' : '#7E7394';
  const cardBg = darkMode ? '#1A152B' : '#FFFFFF';
  const cardBorder = darkMode ? 'rgba(168, 143, 240, 0.15)' : '#EAE5F2';
  const inputBg = darkMode ? '#140F24' : '#FFFFFF';
  const inputBorder = darkMode ? '#3E3263' : '#D1C9DE';
  const modalBg = darkMode ? '#1B152E' : '#FFFFFF';

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Playfair Display, Georgia, serif', fontSize: 24, color: textPrimary }}>
            Gallery & Media Management
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: textSecondary }}>
            Upload event photos stored in Supabase or link static photos hosted on Vercel.
          </p>
        </div>
        <button
          onClick={openUploadModal}
          style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #7C5CFC 0%, #583B9C 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 14px rgba(124, 92, 252, 0.35)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <span>📸</span> Add Photo
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: 14, background: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', border: '1px solid #fecaca', color: darkMode ? '#FCA5A5' : '#b91c1c', borderRadius: 6, marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: active ? '1px solid #583B9C' : `1px solid ${cardBorder}`,
                background: active
                  ? 'linear-gradient(135deg, #7C5CFC 0%, #583B9C 100%)'
                  : cardBg,
                color: active ? '#fff' : textSecondary,
                fontSize: 12,
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: textSecondary }}>Loading gallery photos…</div>
      ) : items.length === 0 ? (
        <div style={{ padding: 48, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 8, textAlign: 'center' }}>
          <p style={{ margin: '0 0 12px', fontSize: 16, color: textPrimary, fontWeight: 600 }}>No gallery photos in this category</p>
          <button
            onClick={openUploadModal}
            style={{ padding: '8px 16px', background: '#583B9C', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
          >
            Add first photo
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 10,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{ position: 'relative', height: 180, background: darkMode ? '#251E3D' : '#f0ecf5' }}>
                <img
                  src={item.image_url}
                  alt={item.title || 'Gallery item'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200';
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    background: item.source_type === 'VERCEL' ? '#0B0E1A' : '#583B9C',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {item.source_type === 'VERCEL' ? 'Vercel / Asset' : 'Supabase'}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: darkMode ? 'rgba(26,20,41,0.85)' : 'rgba(255,255,255,0.92)',
                    color: textPrimary,
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 10,
                    border: `1px solid ${cardBorder}`,
                  }}
                >
                  {item.category || 'General'}
                </span>
              </div>

              <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: textPrimary }}>
                  {item.title || 'Untitled'}
                </h4>
                {item.caption && (
                  <p style={{ margin: '0 0 12px', fontSize: 12, color: textSecondary, lineHeight: 1.4, flex: 1 }}>
                    {item.caption}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${cardBorder}`, paddingTop: 10, marginTop: 'auto', gap: 6 }}>
                  <button
                    onClick={() => openEditModal(item)}
                    style={{
                      padding: '4px 10px',
                      background: darkMode ? 'rgba(124, 92, 252, 0.15)' : '#F3F0FA',
                      color: darkMode ? '#D5CCF5' : '#583B9C',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>

                  <a
                    href={item.image_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 11, color: '#7C5CFC', textDecoration: 'none', fontWeight: 600 }}
                  >
                    View Original ↗
                  </a>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    style={{
                      padding: '4px 10px',
                      background: 'transparent',
                      color: '#EF4444',
                      border: darkMode ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fca5a5',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 8, 18, 0.75)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: modalBg,
              borderRadius: 10,
              maxWidth: 540,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 26,
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              border: `1px solid ${cardBorder}`,
              color: textPrimary,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, color: textPrimary }}>
                {editingItem ? 'Edit Photo Details' : 'Add Photo to Gallery'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: textSecondary, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                  Photo Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pune Reunion 2026"
                  style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Brief note about the event, participants, or year…"
                  style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c} style={{ background: inputBg, color: textPrimary }}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 6 }}>
                  Image Source
                </label>
                <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                  <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: textPrimary }}>
                    <input
                      type="radio"
                      name="galImgMode"
                      value="upload"
                      checked={imageMode === 'upload'}
                      onChange={() => setImageMode('upload')}
                    />
                    Upload Image to Supabase
                  </label>
                  <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: textPrimary }}>
                    <input
                      type="radio"
                      name="galImgMode"
                      value="vercel"
                      checked={imageMode === 'vercel'}
                      onChange={() => setImageMode('vercel')}
                    />
                    Vercel / Static Image URL
                  </label>
                </div>

                {imageMode === 'upload' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      style={{
                        padding: '8px 18px',
                        background: '#583B9C',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#6F4EBF')}
                      onMouseOut={(e) => (e.currentTarget.style.background = '#583B9C')}
                    >
                      {uploadingImage ? 'Uploading to Supabase…' : 'Choose File'}
                    </button>
                    {uploadingImage && <span style={{ fontSize: 12, color: '#583B9C' }}>Uploading…</span>}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. /images/event1.jpg or full URL"
                    style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  />
                )}

                {imageUrl && (
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: darkMode ? '#150F26' : '#F9F8FC', borderRadius: 6, border: `1px solid ${cardBorder}` }}>
                    <img src={imageUrl} alt="Preview" style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} />
                    <span style={{ fontSize: 11, color: textSecondary, wordBreak: 'break-all' }}>{imageUrl}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '8px 16px', background: darkMode ? '#2B2244' : '#f3f0f7', color: textPrimary, border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  style={{
                    padding: '8px 20px',
                    background: 'linear-gradient(135deg, #7C5CFC 0%, #583B9C 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    boxShadow: '0 4px 14px rgba(124, 92, 252, 0.35)',
                  }}
                >
                  {saving ? 'Saving…' : editingItem ? 'Update Photo' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
