/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import {
  fetchAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../../services/adminService';

const EVENT_CATEGORIES = ['Flagship', 'Reunion', 'Community', 'Career', 'Cultural', 'Onboarding', 'General'];

export default function EventsAdminView({ darkMode = false }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'FEATURED'

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Flagship');
  const [dateDisplay, setDateDisplay] = useState('');
  const [timeDisplay, setTimeDisplay] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [registrationLink, setRegistrationLink] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchAdminEvents();
      setEvents(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle('');
    setCategory('Flagship');
    setDateDisplay('15 Aug 2026');
    setTimeDisplay('10:00 AM – 6:00 PM IST');
    setLocation('Pune, Maharashtra');
    setDescription('');
    setIsFeatured(false);
    setRegistrationLink('');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingEvent(item);
    setTitle(item.title || '');
    setCategory(item.category || 'General');
    setDateDisplay(item.date_display || item.dateDisplay || '');
    setTimeDisplay(item.time_display || item.timeDisplay || item.time || '');
    setLocation(item.location || '');
    setDescription(item.description || '');
    setIsFeatured(Boolean(item.is_featured || item.isFeatured));
    setRegistrationLink(item.registration_link || item.registrationLink || '');
    setModalOpen(true);
  };

  const handleToggleFeatured = async (item) => {
    const current = Boolean(item.is_featured || item.isFeatured);
    const updatedStatus = !current;
    try {
      setEvents((prev) =>
        prev.map((e) => (e.id === item.id ? { ...e, is_featured: updatedStatus, isFeatured: updatedStatus } : e))
      );
      await updateEvent(item.id, { isFeatured: updatedStatus });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update event spotlight status');
      loadEvents();
    }
  };

  const handleDelete = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete event');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !description.trim()) {
      setErrorMsg('Title, Location, and Description are required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    const payload = {
      title: title.trim(),
      category,
      dateDisplay: dateDisplay.trim(),
      timeDisplay: timeDisplay.trim(),
      location: location.trim(),
      description: description.trim(),
      isFeatured,
      registrationLink: registrationLink.trim() || undefined,
    };

    try {
      if (editingEvent) {
        const updated = await updateEvent(editingEvent.id, payload);
        setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? { ...e, ...updated } : e)));
      } else {
        const created = await createEvent(payload);
        setEvents((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  // Styling helpers
  const textPrimary = darkMode ? '#FAF9FC' : '#1A1429';
  const textSecondary = darkMode ? '#A99EC2' : '#6B5E82';
  const cardBg = darkMode ? '#1A152B' : '#FFFFFF';
  const cardBorder = darkMode ? 'rgba(168, 143, 240, 0.15)' : '#EAE5F2';
  const inputBg = darkMode ? '#140F24' : '#FFFFFF';
  const inputBorder = darkMode ? '#3E3263' : '#D1C9DE';
  const modalBg = darkMode ? '#1B152E' : '#FFFFFF';

  const displayedEvents = filterMode === 'FEATURED'
    ? events.filter((e) => e.is_featured || e.isFeatured)
    : events;

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Playfair Display, Georgia, serif', fontSize: 24, color: textPrimary }}>
            Events & Calendar Management
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: textSecondary }}>
            Schedule reunions, webinars, and cultural gatherings displayed on the homepage and events calendar.
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
          <span>+</span> Schedule Event
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
        <button
          onClick={() => setFilterMode('ALL')}
          style={{
            padding: '7px 16px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            border: filterMode === 'ALL' ? '1px solid #7C5CFC' : `1px solid ${cardBorder}`,
            background: filterMode === 'ALL' ? (darkMode ? 'rgba(124, 92, 252, 0.25)' : '#F3F0FA') : 'transparent',
            color: filterMode === 'ALL' ? (darkMode ? '#EAE5F2' : '#583B9C') : textSecondary,
            transition: 'all 0.15s',
          }}
        >
          All Events ({events.length})
        </button>
        <button
          onClick={() => setFilterMode('FEATURED')}
          style={{
            padding: '7px 16px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            border: filterMode === 'FEATURED' ? '1px solid #EAB308' : `1px solid ${cardBorder}`,
            background: filterMode === 'FEATURED' ? 'rgba(234, 179, 8, 0.15)' : 'transparent',
            color: filterMode === 'FEATURED' ? '#EAB308' : textSecondary,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s',
          }}
        >
          <span>⭐ Featured / Spotlighted</span>
          <span style={{ fontSize: 11, background: '#EAB308', color: '#000', padding: '1px 7px', borderRadius: 10, fontWeight: 700 }}>
            {events.filter((e) => e.is_featured || e.isFeatured).length}
          </span>
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: 14, background: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', border: '1px solid #fecaca', color: darkMode ? '#FCA5A5' : '#b91c1c', borderRadius: 6, marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: textSecondary }}>Loading events…</div>
      ) : events.length === 0 ? (
        <div style={{ padding: 48, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 8, textAlign: 'center' }}>
          <p style={{ margin: '0 0 12px', fontSize: 16, color: textPrimary, fontWeight: 600 }}>No events scheduled yet</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={openCreateModal}
              style={{ padding: '8px 16px', background: '#583B9C', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
            >
              + Create your first event
            </button>
            <button
              onClick={loadEvents}
              style={{ padding: '8px 16px', background: 'transparent', color: textSecondary, border: `1px solid ${cardBorder}`, borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
            >
              ↻ Refresh Events
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {displayedEvents.map((item) => {
            const isFeaturedEvent = Boolean(item.is_featured || item.isFeatured);
            return (
              <div
                key={item.id}
                style={{
                  background: cardBg,
                  border: isFeaturedEvent ? '1.5px solid rgba(234, 179, 8, 0.6)' : `1px solid ${cardBorder}`,
                  borderRadius: 10,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isFeaturedEvent ? '0 4px 20px rgba(234, 179, 8, 0.15)' : (darkMode ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)'),
                  transition: 'transform 0.2s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: darkMode ? 'rgba(124, 92, 252, 0.2)' : '#F3F0FA',
                      color: darkMode ? '#D5CCF5' : '#583B9C',
                    }}>
                      {item.category || 'General'}
                    </span>
                    {isFeaturedEvent && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        background: '#EAB308',
                        color: '#000',
                        padding: '2px 7px',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}>
                        ⭐ FEATURED
                      </span>
                    )}
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: textPrimary, lineHeight: 1.3 }}>
                    {item.title}
                  </h3>

                  <div style={{ fontSize: 12, color: '#EAB308', fontWeight: 600, marginBottom: 4 }}>
                    📅 {item.date_display || item.dateDisplay} · ⏰ {item.time_display || item.timeDisplay || item.time || 'TBD'}
                  </div>

                  <div style={{ fontSize: 12, color: textSecondary, marginBottom: 12 }}>
                    📍 {item.location}
                  </div>

                  <p style={{
                    margin: '0 0 16px',
                    fontSize: 13,
                    color: textSecondary,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 6, borderTop: `1px solid ${cardBorder}`, paddingTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(item)}
                    style={{
                      padding: '7px 10px',
                      background: isFeaturedEvent ? 'rgba(234, 179, 8, 0.18)' : (darkMode ? 'rgba(255,255,255,0.06)' : '#F3F4F6'),
                      color: isFeaturedEvent ? '#EAB308' : textSecondary,
                      border: isFeaturedEvent ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid transparent',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.15s',
                    }}
                    title={isFeaturedEvent ? 'Remove from Spotlight' : 'Spotlight on homepage calendar'}
                  >
                    <span>{isFeaturedEvent ? '⭐ Featured' : '☆ Spotlight'}</span>
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
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
                    onClick={() => handleDelete(item.id, item.title)}
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
              maxWidth: 600,
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
                {editingEvent ? 'Edit Event' : 'Schedule New Event'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: textSecondary, fontSize: 20, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                  Event Title *
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 51st Annual MSAP Alumni Meet 2026"
                  style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  >
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                    Date Display *
                  </label>
                  <input
                    required
                    type="text"
                    value={dateDisplay}
                    onChange={(e) => setDateDisplay(e.target.value)}
                    placeholder="e.g. 15 Aug 2026"
                    style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                    Time Display *
                  </label>
                  <input
                    required
                    type="text"
                    value={timeDisplay}
                    onChange={(e) => setTimeDisplay(e.target.value)}
                    placeholder="e.g. 10:00 AM – 6:00 PM IST"
                    style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                    Location / Venue *
                  </label>
                  <input
                    required
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Symbiosis Campus, Pune"
                    style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details about the event, agenda, and instructions for attendees…"
                  style={{ width: '100%', padding: '8px 12px', background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                  Registration / RSVP Link (Optional)
                </label>
                <input
                  type="url"
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                  placeholder="https://..."
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
                    <span>⭐ Feature / Spotlight this Event</span>
                    {isFeatured && (
                      <span style={{ fontSize: 10, background: '#EAB308', color: '#000', fontWeight: 800, padding: '1px 6px', borderRadius: 4 }}>
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
                    Highlight prominently on the homepage events calendar.
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
                  disabled={saving}
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
                  {saving ? 'Saving…' : editingEvent ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
