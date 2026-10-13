/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import {
  fetchAdminStories,
  createStory,
  updateStory,
  deleteStory,
  uploadImage,
} from '../../services/adminService';

const CATEGORIES = ['Spotlight', 'Milestone', 'Culture', 'Community', 'Career', 'News'];

export default function ArticlesAdminView({ darkMode = false }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [conflictError, setConflictError] = useState(null);
  const fileInputRef = useRef(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('MSAP Spotlight');
  const [category, setCategory] = useState('Spotlight');
  const [publishedDate, setPublishedDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'SPOTLIGHT'

  const loadStories = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchAdminStories();
      setStories(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleToggleSpotlight = async (story) => {
    const current = Boolean(story.is_featured || story.isFeatured);
    const updatedStatus = !current;
    try {
      setStories((prev) =>
        prev.map((s) => (s.id === story.id ? { ...s, is_featured: updatedStatus, isFeatured: updatedStatus } : s))
      );
      await updateStory(story.id, { isFeatured: updatedStatus });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update spotlight status');
      loadStories();
    }
  };

  const [additionalImages, setAdditionalImages] = useState([]);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const additionalFileInputRef = useRef(null);

  const openCreateModal = () => {
    setEditingStory(null);
    setTitle('');
    setSource('MSAP Spotlight');
    setCategory('Spotlight');
    setPublishedDate(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    setImageUrl('');
    setImageMode('upload');
    setExcerpt('');
    setContent('');
    setIsFeatured(false);
    setAdditionalImages([]);
    setConflictError(null);
    setModalOpen(true);
  };

  const openEditModal = (story) => {
    setEditingStory(story);
    setConflictError(null);
    setTitle(story.title || '');
    setSource(story.source || '');
    setCategory(story.category || 'Spotlight');
    setPublishedDate(story.published_date || story.publishedDate || '');
    setImageUrl(story.image_url || story.image || '');
    setImageMode(story.image_url?.startsWith('http') || story.image_url?.startsWith('/images') ? 'url' : 'upload');
    setExcerpt(story.excerpt || '');
    setIsFeatured(Boolean(story.is_featured || story.isFeatured));

    // Parse existing additional/gallery photos from story properties or embedded content
    let cleanContent = story.content || '';
    let existingAddtl = [];
    if (Array.isArray(story.galleryImages)) {
      existingAddtl = story.galleryImages.map((g) => ({
        url: g.src || g.url || (typeof g === 'string' ? g : ''),
        caption: g.caption || '',
      }));
    } else if (typeof cleanContent === 'string') {
      const match = cleanContent.match(/<!--\s*GALLERY_PHOTOS:\s*(\[.*?\])\s*-->/s);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          if (Array.isArray(parsed)) {
            existingAddtl = parsed.map((p) => ({
              url: p.url || p.src || (typeof p === 'string' ? p : ''),
              caption: p.caption || '',
            }));
          }
        } catch (e) {
          console.warn('Error parsing gallery photos in modal:', e);
        }
        cleanContent = cleanContent.replace(/<!--\s*GALLERY_PHOTOS:\s*(\[.*?\])\s*-->/gs, '').trim();
      }
    }

    setAdditionalImages(existingAddtl);
    setContent(cleanContent);
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadImage(file, 'stories');
      if (res?.url) {
        setImageUrl(res.url);
      }
    } catch (err) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdditionalUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingAdditional(true);
    try {
      for (const file of files) {
        const res = await uploadImage(file, 'stories');
        if (res?.url) {
          setAdditionalImages((prev) => [
            ...prev,
            { url: res.url, caption: file.name.replace(/\.[^/.]+$/, '') }
          ]);
        }
      }
    } catch (err) {
      alert(`Additional image upload failed: ${err.message}`);
    } finally {
      setUploadingAdditional(false);
      if (additionalFileInputRef.current) {
        additionalFileInputRef.current.value = '';
      }
    }
  };

  const addImageUrlEntry = () => {
    setAdditionalImages((prev) => [...prev, { url: '', caption: '' }]);
  };

  const updateAdditionalImage = (index, field, value) => {
    setAdditionalImages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');
    if (!imageUrl.trim()) return alert('Cover image URL or upload is required');

    setSaving(true);
    try {
      let finalContent = content.trim();
      const validAdditional = additionalImages.filter((img) => img.url && img.url.trim());
      if (validAdditional.length > 0) {
        finalContent = `${finalContent}\n\n<!-- GALLERY_PHOTOS: ${JSON.stringify(validAdditional)} -->`;
      }

      const payload = {
        title: title.trim(),
        source: source.trim() || 'MSAP News',
        category: category || 'Spotlight',
        publishedDate: publishedDate.trim() || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        imageUrl: imageUrl.trim(),
        excerpt: excerpt.trim(),
        content: finalContent || null,
        isFeatured: Boolean(isFeatured),
      };

      if (editingStory) {
        payload.lastKnownUpdatedAt = editingStory.updated_at || editingStory.updatedAt;
        await updateStory(editingStory.id, payload);
      } else {
        await createStory(payload);
      }
      setModalOpen(false);
      setConflictError(null);
      await loadStories();
    } catch (err) {
      if (
        err.status === 409 ||
        err.message?.includes('Conflict detected') ||
        err.message?.includes('modified by another editor')
      ) {
        setConflictError(
          err.message ||
            'Conflict detected: Another team member updated this article while you were editing it. To prevent silent overwrites, your changes have not been saved.'
        );
      } else {
        alert(`Failed to save article: ${err.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, articleTitle) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${articleTitle}"?`)) return;
    try {
      await deleteStory(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
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
            Articles & Stories Management
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: textSecondary }}>
            Publish alumni features, news, and historical records on the public website.
          </p>
        </div>
        <button
          onClick={openCreateModal}
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
          <span>+</span> Write New Article
        </button>
      </div>

      {/* Spotlight & Category quick filter */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
        <button
          onClick={() => setActiveFilter('ALL')}
          style={{
            padding: '7px 16px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            border: activeFilter === 'ALL' ? '1px solid #7C5CFC' : `1px solid ${cardBorder}`,
            background: activeFilter === 'ALL' ? (darkMode ? 'rgba(124, 92, 252, 0.25)' : '#F3F0FA') : 'transparent',
            color: activeFilter === 'ALL' ? (darkMode ? '#EAE5F2' : '#583B9C') : textSecondary,
            transition: 'all 0.15s',
          }}
        >
          All Articles ({stories.length})
        </button>
        <button
          onClick={() => setActiveFilter('SPOTLIGHT')}
          style={{
            padding: '7px 16px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            border: activeFilter === 'SPOTLIGHT' ? '1px solid #EAB308' : `1px solid ${cardBorder}`,
            background: activeFilter === 'SPOTLIGHT' ? 'rgba(234, 179, 8, 0.15)' : 'transparent',
            color: activeFilter === 'SPOTLIGHT' ? '#EAB308' : textSecondary,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s',
          }}
        >
          <span>⭐ Spotlighted</span>
          <span style={{ fontSize: 11, background: '#EAB308', color: '#000', padding: '1px 7px', borderRadius: 10, fontWeight: 700 }}>
            {stories.filter((s) => s.is_featured || s.isFeatured).length}
          </span>
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: 14, background: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', border: '1px solid #fecaca', color: darkMode ? '#FCA5A5' : '#b91c1c', borderRadius: 6, marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: textSecondary }}>Loading stories…</div>
      ) : stories.length === 0 ? (
        <div style={{ padding: 48, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 8, textAlign: 'center' }}>
          <p style={{ margin: '0 0 12px', fontSize: 16, color: textPrimary, fontWeight: 600 }}>No articles yet</p>
          <button
            onClick={openCreateModal}
            style={{ padding: '8px 16px', background: '#583B9C', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
          >
            Create your first article
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {(activeFilter === 'SPOTLIGHT' ? stories.filter((s) => s.is_featured || s.isFeatured) : stories).map((story) => {
            const img = story.image_url || story.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800';
            const isSpotlighted = Boolean(story.is_featured || story.isFeatured);
            return (
              <div
                key={story.id}
                style={{
                  background: cardBg,
                  border: isSpotlighted ? '1.5px solid rgba(234, 179, 8, 0.6)' : `1px solid ${cardBorder}`,
                  borderRadius: 10,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isSpotlighted ? '0 4px 20px rgba(234, 179, 8, 0.15)' : (darkMode ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)'),
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div style={{ position: 'relative', height: 160, background: darkMode ? '#251E3D' : '#f3f0f7' }}>
                  <img
                    src={img}
                    alt={story.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800';
                    }}
                  />
                  {(story.is_featured || story.isFeatured) && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: '#583B9C',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Featured
                    </span>
                  )}
                  {story.category && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        background: 'rgba(26, 20, 41, 0.75)',
                        backdropFilter: 'blur(4px)',
                        color: '#EAE5F2',
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {story.category}
                    </span>
                  )}
                </div>

                <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: textSecondary, marginBottom: 6 }}>
                    <span>{story.source || 'MSAP'}</span>
                    <span>{story.published_date || story.publishedDate || '—'}</span>
                  </div>

                  <h3
                    style={{
                      margin: '0 0 8px',
                      fontSize: 16,
                      fontWeight: 600,
                      color: textPrimary,
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {story.title}
                  </h3>

                  <p
                    style={{
                      margin: '0 0 16px',
                      fontSize: 13,
                      color: textSecondary,
                      lineHeight: 1.5,
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {story.excerpt}
                  </p>

                  <div style={{ display: 'flex', gap: 6, borderTop: `1px solid ${cardBorder}`, paddingTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => handleToggleSpotlight(story)}
                      title={isSpotlighted ? 'Remove from Homepage Spotlight' : 'Spotlight on Homepage'}
                      style={{
                        padding: '7px 10px',
                        background: isSpotlighted ? 'rgba(234, 179, 8, 0.18)' : (darkMode ? 'rgba(255,255,255,0.06)' : '#F3F4F6'),
                        color: isSpotlighted ? '#EAB308' : textSecondary,
                        border: isSpotlighted ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid transparent',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'all 0.15s',
                      }}
                    >
                      <span>{isSpotlighted ? '⭐ Spotlight' : '☆ Spotlight'}</span>
                    </button>
                    <button
                      onClick={() => openEditModal(story)}
                      style={{
                        flex: 1,
                        padding: '7px 0',
                        background: darkMode ? 'rgba(124, 92, 252, 0.15)' : '#F3F0FA',
                        color: darkMode ? '#D5CCF5' : '#583B9C',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(story.id, story.title)}
                      style={{
                        padding: '7px 12px',
                        background: 'transparent',
                        color: '#EF4444',
                        border: darkMode ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FEE2E2',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = darkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Dialog */}
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
              maxWidth: 640,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 28,
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              border: `1px solid ${cardBorder}`,
              color: textPrimary,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontFamily: 'Playfair Display, Georgia, serif', fontSize: 22, color: textPrimary }}>
                {editingStory ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, color: textSecondary, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {conflictError && (
                <div
                  style={{
                    background: darkMode ? '#3b1219' : '#FEF2F2',
                    border: '1px solid #DC2626',
                    borderRadius: 8,
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#DC2626', fontWeight: 700, fontSize: 13 }}>
                    <span>⚠️</span>
                    <span>Concurrency Conflict (Silent Overwrite Prevented)</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: darkMode ? '#FCA5A5' : '#B91C1C', lineHeight: 1.4 }}>
                    {conflictError}
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      await loadStories();
                      setModalOpen(false);
                      setConflictError(null);
                    }}
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: 4,
                      background: '#DC2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      padding: '6px 14px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ↻ Reload Latest Version from Server
                  </button>
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pune Alumni Mentorship Launch 2026"
                  style={{ width: '100%', padding: '10px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                    Source / Desk
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. MSAP Secretariat"
                    style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} style={{ background: inputBg, color: textPrimary }}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                    Published Date Label
                  </label>
                  <input
                    type="text"
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    placeholder="e.g. October 2026"
                    style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
                  <input
                    type="checkbox"
                    id="isFeaturedToggle"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#7C5CFC' }}
                  />
                  <label htmlFor="isFeaturedToggle" style={{ fontSize: 13, fontWeight: 600, color: textPrimary, cursor: 'pointer' }}>
                    Feature on Homepage
                  </label>
                </div>
              </div>

              {/* Cover Image Choice */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 6 }}>
                  Cover Image *
                </label>
                <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                  <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: textPrimary }}>
                    <input
                      type="radio"
                      name="imageMode"
                      value="upload"
                      checked={imageMode === 'upload'}
                      onChange={() => setImageMode('upload')}
                    />
                    Upload Image to Supabase Storage
                  </label>
                  <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: textPrimary }}>
                    <input
                      type="radio"
                      name="imageMode"
                      value="url"
                      checked={imageMode === 'url'}
                      onChange={() => setImageMode('url')}
                    />
                    Image URL / Asset Path
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
                    placeholder="https://... or /images/story1.jpg"
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

              {/* Additional Article Photos & Gallery */}
              <div style={{ padding: 14, background: darkMode ? '#150F26' : '#F9F8FC', borderRadius: 8, border: `1px solid ${cardBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: textPrimary, margin: 0 }}>
                      📸 Additional Article Photos &amp; Gallery ({additionalImages.length})
                    </label>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: textSecondary }}>
                      Add more photos to this article (e.g. event albums, award ceremonies, reunions). Displayed in high-res on the article page.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="file"
                      ref={additionalFileInputRef}
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleAdditionalUpload}
                      disabled={uploadingAdditional}
                    />
                    <button
                      type="button"
                      onClick={() => additionalFileInputRef.current?.click()}
                      disabled={uploadingAdditional}
                      style={{
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #7C5CFC 0%, #583B9C 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: uploadingAdditional ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {uploadingAdditional ? 'Uploading…' : '+ Upload Photo(s)'}
                    </button>
                    <button
                      type="button"
                      onClick={addImageUrlEntry}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        color: textPrimary,
                        border: `1px solid ${inputBorder}`,
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      + Add URL
                    </button>
                  </div>
                </div>

                {additionalImages.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                    {additionalImages.map((img, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: 8,
                          background: darkMode ? '#1A152B' : '#FFFFFF',
                          border: `1px solid ${cardBorder}`,
                          borderRadius: 6,
                        }}
                      >
                        {img.url ? (
                          <img
                            src={img.url}
                            alt="Thumbnail"
                            style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd', flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: 52, height: 40, background: darkMode ? '#261F3B' : '#ECE8F4', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: textSecondary, flexShrink: 0 }}>
                            No img
                          </div>
                        )}

                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 8 }}>
                          <input
                            type="text"
                            value={img.url}
                            onChange={(e) => updateAdditionalImage(idx, 'url', e.target.value)}
                            placeholder="Image URL or uploaded path..."
                            style={{ width: '100%', padding: '6px 10px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 4, fontSize: 12, boxSizing: 'border-box' }}
                          />
                          <input
                            type="text"
                            value={img.caption}
                            onChange={(e) => updateAdditionalImage(idx, 'caption', e.target.value)}
                            placeholder="Caption (e.g. Stage Ceremony)..."
                            style={{ width: '100%', padding: '6px 10px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 4, fontSize: 12, boxSizing: 'border-box' }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(idx)}
                          title="Remove photo"
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 13,
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '10px 0', textAlign: 'center', fontSize: 12, color: textSecondary }}>
                    No additional photos attached yet. You can attach multiple photos to any article by clicking <strong>+ Upload Photo(s)</strong> or <strong>+ Add URL</strong>.
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                  Summary / Excerpt *
                </label>
                <textarea
                  required
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short paragraph displayed in article cards on the stories page…"
                  style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                  Full Article Body (Optional)
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detailed article body or story transcript…"
                  style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              {/* Spotlight / Featured Toggle */}
              <div
                onClick={() => setIsFeatured(!isFeatured)}
                style={{
                  padding: '12px 16px',
                  background: isFeatured ? 'rgba(234, 179, 8, 0.12)' : (darkMode ? 'rgba(255,255,255,0.04)' : '#F9FAFB'),
                  border: isFeatured ? '1.5px solid rgba(234, 179, 8, 0.5)' : `1px solid ${inputBorder}`,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>⭐ Spotlight this Article</span>
                    {isFeatured && (
                      <span style={{ fontSize: 10, background: '#EAB308', color: '#000', fontWeight: 800, padding: '1px 6px', borderRadius: 4 }}>
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
                    Feature prominently at the top of the public website News & Events section.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#EAB308', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '9px 18px', background: darkMode ? '#2B2244' : '#f3f0f7', color: textPrimary, border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  style={{
                    padding: '9px 22px',
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
                  {saving ? 'Saving…' : editingStory ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
