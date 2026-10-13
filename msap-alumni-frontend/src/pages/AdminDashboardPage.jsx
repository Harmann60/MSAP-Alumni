/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  fetchRegistrations,
  downloadAlumniCSV,
  updateRegistrationStatus,
  deleteRegistration,
  updateAlumniProfile,
  adminLogout,
  fetchEditorialTeam,
  assignAlumniRole,
  revokeAlumniRole,
} from '../services/adminService';
import ArticlesAdminView from '../components/admin/ArticlesAdminView';
import GalleryAdminView from '../components/admin/GalleryAdminView';
import EventsAdminView from '../components/admin/EventsAdminView';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ['ALL', 'PENDING', 'VERIFIED', 'REJECTED'];

function statusStyle(status) {
  switch (status) {
    case 'VERIFIED':  return { bg: '#edfbf2', color: '#15803D', label: 'Verified' };
    case 'REJECTED':  return { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' };
    default:          return { bg: '#EAE3F7', color: '#583B9C', label: 'Pending' };
  }
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Sidebar({ user, isSuperOrAdmin, activeFilter, onFilterChange, activeTab, onTabChange, counts, onLogout }) {
  return (
    <aside style={{ background: '#1A1429', minHeight: '100vh', width: 230, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '0' }}>
      {/* Brand */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(250,249,252,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/logo.png" alt="MSAP Alumni" style={{ width: 38, height: 38, objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#9E92B5' }}>
            MSAP Alumni
          </p>
          <p style={{ margin: 0, fontFamily: 'Playfair Display, Georgia, serif', fontSize: 18, color: '#FAF9FC', lineHeight: 1.2 }}>
            {isSuperOrAdmin ? 'Admin Portal' : 'Editorial Portal'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '20px 0', flex: 1 }}>
        {/* Registrations Section — ONLY for Super Admin & Admin */}
        {isSuperOrAdmin && (
          <>
            <p style={{ margin: '0 0 8px', padding: '0 24px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B5E82' }}>
              Registrations
            </p>
            {STATUS_FILTERS.map((f) => {
              const active = activeTab === 'REGISTRATIONS' && activeFilter === f;
              const count = f === 'ALL' ? counts.all : f === 'PENDING' ? counts.pending : f === 'VERIFIED' ? counts.verified : counts.rejected;
              return (
                <button
                  key={f}
                  id={`filter-${f.toLowerCase()}`}
                  onClick={() => {
                    onTabChange('REGISTRATIONS');
                    onFilterChange(f);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '10px 24px', background: active ? 'rgba(88,59,156,0.18)' : 'transparent',
                    border: 'none', borderLeft: active ? '3px solid #583B9C' : '3px solid transparent',
                    cursor: 'pointer', color: active ? '#FAF9FC' : '#9E92B5',
                    fontSize: 13, fontWeight: active ? 600 : 400, textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{f.charAt(0) + f.slice(1).toLowerCase()}</span>
                  {count !== undefined && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '1px 8px',
                      borderRadius: 10, background: active ? '#583B9C' : 'rgba(250,249,252,0.08)',
                      color: active ? '#fff' : '#9E92B5',
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </>
        )}

        {/* Content Management Section — Accessible to both Content Managers & Admins */}
        <p style={{ margin: isSuperOrAdmin ? '24px 0 8px' : '0 0 8px', padding: '0 24px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B5E82' }}>
          Content Management
        </p>
        <button
          onClick={() => onTabChange('ARTICLES')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '10px 24px',
            background: activeTab === 'ARTICLES' ? 'rgba(88,59,156,0.18)' : 'transparent',
            border: 'none', borderLeft: activeTab === 'ARTICLES' ? '3px solid #583B9C' : '3px solid transparent',
            cursor: 'pointer', color: activeTab === 'ARTICLES' ? '#FAF9FC' : '#9E92B5',
            fontSize: 13, fontWeight: activeTab === 'ARTICLES' ? 600 : 400, textAlign: 'left',
            transition: 'all 0.15s',
          }}
        >
          <span>📰</span>
          <span>Articles & Stories</span>
        </button>
        <button
          onClick={() => onTabChange('EVENTS')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '10px 24px',
            background: activeTab === 'EVENTS' ? 'rgba(88,59,156,0.18)' : 'transparent',
            border: 'none', borderLeft: activeTab === 'EVENTS' ? '3px solid #583B9C' : '3px solid transparent',
            cursor: 'pointer', color: activeTab === 'EVENTS' ? '#FAF9FC' : '#9E92B5',
            fontSize: 13, fontWeight: activeTab === 'EVENTS' ? 600 : 400, textAlign: 'left',
            transition: 'all 0.15s',
          }}
        >
          <span>🗓️</span>
          <span>Events & Calendar</span>
        </button>
        <button
          onClick={() => onTabChange('GALLERY')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '10px 24px',
            background: activeTab === 'GALLERY' ? 'rgba(88,59,156,0.18)' : 'transparent',
            border: 'none', borderLeft: activeTab === 'GALLERY' ? '3px solid #583B9C' : '3px solid transparent',
            cursor: 'pointer', color: activeTab === 'GALLERY' ? '#FAF9FC' : '#9E92B5',
            fontSize: 13, fontWeight: activeTab === 'GALLERY' ? 600 : 400, textAlign: 'left',
            transition: 'all 0.15s',
          }}
        >
          <span>🖼️</span>
          <span>Photo Gallery</span>
        </button>

        {/* Roles & Permissions Section — ONLY for Super Admin & Admin */}
        {isSuperOrAdmin && (
          <>
            <p style={{ margin: '24px 0 8px', padding: '0 24px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B5E82' }}>
              Administration & Access
            </p>
            <button
              id="tab-roles-mgmt"
              onClick={() => onTabChange('ROLES_MGMT')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 24px',
                background: activeTab === 'ROLES_MGMT' ? 'rgba(88,59,156,0.18)' : 'transparent',
                border: 'none', borderLeft: activeTab === 'ROLES_MGMT' ? '3px solid #583B9C' : '3px solid transparent',
                cursor: 'pointer', color: activeTab === 'ROLES_MGMT' ? '#FAF9FC' : '#9E92B5',
                fontSize: 13, fontWeight: activeTab === 'ROLES_MGMT' ? 600 : 400, textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span>👥</span>
              <span>Editorial Team & Roles</span>
            </button>
          </>
        )}

        <div style={{ marginTop: 24, padding: '0 24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: '#9B9484', textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#F5F0E8'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#9B9484'; }}
          >
            ← Public Website
          </Link>
        </div>
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(245,240,232,0.08)' }}>
        <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#F5F0E8' }}>
          {user?.fullName || (isSuperOrAdmin ? 'Admin' : 'Content Manager')}
        </p>
        <div style={{ marginBottom: 12 }}>
          <span style={{
            display: 'inline-block',
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '2px 8px',
            borderRadius: 10,
            background: isSuperOrAdmin ? 'rgba(217, 119, 6, 0.2)' : 'rgba(124, 92, 252, 0.25)',
            color: isSuperOrAdmin ? '#FBBF24' : '#C4B5FD',
          }}>
            {isSuperOrAdmin ? (user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin') : 'Content Manager'}
          </span>
        </div>
        <button
          id="admin-logout-btn"
          onClick={onLogout}
          style={{
            width: '100%', padding: '8px 0', background: 'transparent',
            border: '1px solid rgba(245,240,232,0.12)', color: '#9B9484',
            fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseOver={(e) => { e.target.style.borderColor = '#D64933'; e.target.style.color = '#D64933'; }}
          onMouseOut={(e) => { e.target.style.borderColor = 'rgba(245,240,232,0.12)'; e.target.style.color = '#9B9484'; }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

function StatsBanner({ counts, darkMode = false }) {
  const cardBg = darkMode ? '#1A152B' : '#fff';
  const cardBorder = darkMode ? 'rgba(168, 143, 240, 0.15)' : '#EAE5F2';
  const valColor = darkMode ? '#FAF9FC' : '#1A1429';
  const lblColor = darkMode ? '#A89EC4' : '#7E7394';

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
      {[
        { label: 'Total', value: counts.all ?? '—', color: darkMode ? '#9E92B5' : '#1A1429' },
        { label: 'Pending Review', value: counts.pending ?? '—', color: '#7C5CFC' },
        { label: 'Verified', value: counts.verified ?? '—', color: '#16A34A' },
        { label: 'Rejected', value: counts.rejected ?? '—', color: '#DC2626' },
      ].map((s) => (
        <div key={s.label} style={{
          flex: 1, padding: '18px 20px', background: cardBg,
          border: `1px solid ${cardBorder}`, borderLeft: `4px solid ${s.color}`,
          borderRadius: 8,
          boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
        }}>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 30, color: valColor, lineHeight: 1 }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: lblColor, marginTop: 6 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function RegistrationRow({ reg, isExpanded, onToggle, onSetStatus, onApprove, onReject, onDelete, onUpdateProfile, actionLoading, darkMode = false }) {
  const [decisionNotes, setDecisionNotes] = useState(reg.admin_notes || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setDecisionNotes(reg.admin_notes || '');
  }, [reg.admin_notes]);
  const [formData, setFormData] = useState({
    fullName: reg.full_name || '',
    email: reg.email || '',
    phone: reg.phone || '',
    puneCollege: reg.pune_college || '',
    batchYear: reg.batch_year || '',
    currentLocation: reg.current_location || '',
    profession: reg.profession || '',
    status: reg.status || 'PENDING',
    adminNotes: reg.admin_notes || '',
  });

  useEffect(() => {
    setFormData({
      fullName: reg.full_name || '',
      email: reg.email || '',
      phone: reg.phone || '',
      puneCollege: reg.pune_college || '',
      batchYear: reg.batch_year || '',
      currentLocation: reg.current_location || '',
      profession: reg.profession || '',
      status: reg.status || 'PENDING',
      adminNotes: reg.admin_notes || '',
    });
  }, [reg]);

  const st = statusStyle(reg.status);

  const handleSaveEdit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile(reg.id, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        puneCollege: formData.puneCollege || null,
        batchYear: formData.batchYear ? Number(formData.batchYear) : null,
        currentLocation: formData.currentLocation || null,
        profession: formData.profession || null,
        status: formData.status,
        adminNotes: formData.adminNotes || null,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      setIsEditing(false);
    } catch (err) {
      alert(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <tr
        id={`row-${reg.id}`}
        onClick={onToggle}
        style={{
          cursor: 'pointer',
          borderBottom: darkMode ? '1px solid rgba(168, 143, 240, 0.12)' : '1px solid #E8E2D8',
          background: isExpanded ? (darkMode ? '#231B3B' : '#faf9f5') : (darkMode ? '#1A152B' : '#fff'),
          transition: 'background 0.15s',
        }}
        onMouseOver={(e) => { if (!isExpanded) e.currentTarget.style.background = darkMode ? '#221B38' : '#fdfcf9'; }}
        onMouseOut={(e) => { if (!isExpanded) e.currentTarget.style.background = darkMode ? '#1A152B' : '#fff'; }}
      >
        <td style={{ padding: '14px 20px', fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 15, color: darkMode ? '#FAF9FC' : '#0B0E1A', fontWeight: 400 }}>
          {reg.full_name}
        </td>
        <td style={{ padding: '14px 20px', fontSize: 13, color: darkMode ? '#C5BDDB' : '#5C5347' }}>
          {reg.email}
        </td>
        <td style={{ padding: '14px 20px', fontSize: 13, color: darkMode ? '#A89EC4' : '#9B9484' }}>
          {reg.pune_college || '—'}
        </td>
        <td style={{ padding: '14px 20px', fontSize: 13, color: darkMode ? '#A89EC4' : '#9B9484' }}>
          {reg.batch_year || '—'}
        </td>
        <td style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
            <span style={{
              display: 'inline-block', padding: '3px 10px',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              background: st.bg, color: st.color, borderRadius: 2,
            }}>
              {st.label}
            </span>
            {reg.admin_notes && (
              <span
                title={`Admin note: ${reg.admin_notes}`}
                style={{
                  fontSize: 10,
                  color: darkMode ? '#C5BDDB' : '#7E7394',
                  maxWidth: 130,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'help',
                }}
              >
                📝 {reg.admin_notes}
              </span>
            )}
          </div>
        </td>
        <td style={{ padding: '14px 20px', fontSize: 12, color: '#9B9484' }}>
          {formatDate(reg.created_at)}
        </td>
        <td style={{ padding: '14px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
          <button
            id={`quick-edit-${reg.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!isExpanded) onToggle();
              setIsEditing(true);
            }}
            title="Edit user details"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#7C5CFC',
              cursor: 'pointer',
              padding: '4px 6px',
              marginRight: 4,
              fontSize: 14,
              transition: 'transform 0.15s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            ✏️
          </button>
          <button
            id={`quick-delete-${reg.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(reg.id, reg.full_name);
            }}
            title="Permanently remove user"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9E92B5',
              cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
              padding: '4px 6px',
              marginRight: 8,
              fontSize: 14,
              transition: 'color 0.15s, transform 0.15s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.transform = 'scale(1.2)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#9E92B5'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            🗑
          </button>
          <span style={{ fontSize: 11, color: '#9B9484', userSelect: 'none' }}>
            {isExpanded ? '▲ Collapse' : '▼ Manage'}
          </span>
        </td>
      </tr>

      {/* Inline expanded details + edit / action panel */}
      {isExpanded && (
        <tr>
          <td colSpan={7} style={{ padding: 0 }}>
            <div style={{ background: '#faf9f5', borderBottom: '2px solid #D64933', padding: '24px 20px 20px' }}>
              
              {/* Header toolbar with Edit button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1429', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {isEditing ? 'Editing Record Information' : 'Alumni Information & Management'}
                  </span>
                  {saveSuccess && (
                    <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 600, background: '#dcfce7', padding: '2px 8px', borderRadius: 4 }}>
                      ✓ Changes saved successfully!
                    </span>
                  )}
                </div>
                <div>
                  {!isEditing ? (
                    <button
                      type="button"
                      id={`edit-btn-${reg.id}`}
                      onClick={() => setIsEditing(true)}
                      style={{
                        padding: '6px 14px', background: '#fff', border: '1px solid #7C5CFC',
                        color: '#7C5CFC', fontSize: 12, fontWeight: 600, borderRadius: 2,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.15s',
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#7C5CFC'; e.currentTarget.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#7C5CFC'; }}
                    >
                      ✏️ Edit Information
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{
                        padding: '6px 14px', background: 'transparent', border: '1px solid #9B9484',
                        color: '#5C5347', fontSize: 12, fontWeight: 600, borderRadius: 2,
                        cursor: 'pointer',
                      }}
                    >
                      ✕ Cancel Edit
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                /* ─── Inline Edit Form ─── */
                <form onSubmit={handleSaveEdit} style={{ background: '#fff', border: '1px solid #EAE5F2', padding: 20, borderRadius: 2 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px 20px', marginBottom: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#7E7394', marginBottom: 4 }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #EAE5F2', fontSize: 13, boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#7E7394', marginBottom: 4 }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #EAE5F2', fontSize: 13, boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#7E7394', marginBottom: 4 }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #EAE5F2', fontSize: 13, boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#7E7394', marginBottom: 4 }}>
                        College in Pune
                      </label>
                      <input
                        type="text"
                        value={formData.puneCollege}
                        onChange={(e) => setFormData({ ...formData, puneCollege: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #EAE5F2', fontSize: 13, boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#7E7394', marginBottom: 4 }}>
                        Batch Year
                      </label>
                      <input
                        type="number"
                        min="1970"
                        max="2035"
                        value={formData.batchYear}
                        onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #EAE5F2', fontSize: 13, boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#7E7394', marginBottom: 4 }}>
                        Current Location
                      </label>
                      <input
                        type="text"
                        value={formData.currentLocation}
                        onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #EAE5F2', fontSize: 13, boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#7E7394', marginBottom: 4 }}>
                        Profession / Role
                      </label>
                      <input
                        type="text"
                        value={formData.profession}
                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #EAE5F2', fontSize: 13, boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#7E7394', marginBottom: 4 }}>
                        Verification Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #EAE5F2', fontSize: 13, boxSizing: 'border-box', background: '#fff' }}
                      >
                        <option value="PENDING">PENDING (Review Needed)</option>
                        <option value="VERIFIED">VERIFIED (Accepted Alumni)</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#7E7394', marginBottom: 4 }}>
                      Admin Notes (Internal / Decision explanation)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.adminNotes}
                      onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                      placeholder="Notes regarding this alumnus or reason for status update…"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #EAE5F2', fontSize: 13, boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        padding: '10px 24px', background: '#1A1429', color: '#fff',
                        border: 'none', fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.06em', cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1,
                      }}
                    >
                      {saving ? 'Saving changes…' : '💾 Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{
                        padding: '10px 20px', background: 'transparent', border: '1px solid #EAE5F2',
                        color: '#5C5347', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* ─── Standard Review View ─── */
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: 20 }}>
                  {/* Left: Applicant Details */}
                  <div>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                      <tbody>
                        {[
                          ['Full Name', reg.full_name],
                          ['Email', reg.email],
                          ['Phone', reg.phone],
                          ['College', reg.pune_college],
                          ['Batch Year', reg.batch_year],
                          ['Location', reg.current_location],
                          ['Profession', reg.profession],
                          ['Submitted', formatDate(reg.created_at)],
                        ].map(([label, value]) => value ? (
                          <tr key={label}>
                            <td style={{ padding: '5px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9B9484', width: 110, verticalAlign: 'top' }}>{label}</td>
                            <td style={{ padding: '5px 0 5px 12px', fontSize: 13, color: '#0B0E1A' }}>{value}</td>
                          </tr>
                        ) : null)}
                      </tbody>
                    </table>
                  </div>

                  {/* Right: Actions */}
                  <div>
                    <div style={{
                      padding: '20px',
                      borderRadius: 8,
                      border: darkMode ? '1px solid rgba(168, 143, 240, 0.2)' : '1px solid #EAE5F2',
                      background: darkMode ? '#1A1429' : '#FFFFFF',
                      boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.03)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: st.color }}>
                          Status: {st.label}
                        </span>
                        <span style={{ fontSize: 11, color: darkMode ? '#A89EC4' : '#9B9484' }}>
                          ID: {reg.id.slice(0, 8)}…
                        </span>
                      </div>

                      {/* Decision Notes & Reason Input */}
                      <div style={{ marginBottom: 14 }}>
                        <label style={{
                          display: 'block',
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: darkMode ? '#C5BDDB' : '#5C5347',
                          marginBottom: 6,
                        }}>
                          Admin Note / Rejection Reason (Included in email & shown in applicant portal)
                        </label>
                        <textarea
                          value={decisionNotes}
                          onChange={(e) => setDecisionNotes(e.target.value)}
                          placeholder="e.g. Please submit a valid college student ID or degree certificate for verification..."
                          rows={3}
                          style={{
                            width: '100%',
                            border: darkMode ? '1px solid rgba(168, 143, 240, 0.3)' : '1px solid #D1C9DE',
                            background: darkMode ? '#241B3B' : '#FAF9FC',
                            color: darkMode ? '#FAF9FC' : '#1A1429',
                            padding: '10px 12px',
                            fontSize: 13,
                            borderRadius: 6,
                            resize: 'vertical',
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                        />

                        {/* Quick Presets */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                          <span style={{ fontSize: 10, color: darkMode ? '#8B7FA8' : '#9B9484', alignSelf: 'center' }}>Presets:</span>
                          {[
                            'Student / Degree ID needed',
                            'Batch year mismatch',
                            'Details could not be verified',
                            'Welcome to the MSAP Alumni Network!'
                          ].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setDecisionNotes(preset)}
                              style={{
                                fontSize: 10,
                                padding: '3px 8px',
                                borderRadius: 12,
                                border: darkMode ? '1px solid rgba(168, 143, 240, 0.25)' : '1px solid #EAE5F2',
                                background: darkMode ? '#292042' : '#F5F0E8',
                                color: darkMode ? '#D5CEE8' : '#5C5347',
                                cursor: 'pointer',
                              }}
                            >
                              + {preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons based on status */}
                      {reg.status === 'VERIFIED' ? (
                        <div>
                          <p style={{ margin: '0 0 12px', fontSize: 12, color: '#16A34A', fontWeight: 600 }}>
                            ✓ Active Member — This user can currently log in and browse the directory.
                          </p>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => (onSetStatus || onReject)(reg.id, 'PENDING', decisionNotes || 'Verification revoked for re-review.')}
                              disabled={actionLoading === reg.id}
                              style={{
                                padding: '8px 14px',
                                background: '#D97706',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              ⚠️ Revoke to Pending
                            </button>
                            <button
                              type="button"
                              onClick={() => (onSetStatus || onReject)(reg.id, 'REJECTED', decisionNotes || 'Verification rejected by administrator.')}
                              disabled={actionLoading === reg.id}
                              style={{
                                padding: '8px 14px',
                                background: 'transparent',
                                color: '#DC2626',
                                border: '1px solid #DC2626',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              }}
                            >
                              ✕ Reject Application
                            </button>
                            {decisionNotes !== (reg.admin_notes || '') && (
                              <button
                                type="button"
                                onClick={() => (onSetStatus || onApprove)(reg.id, 'VERIFIED', decisionNotes)}
                                disabled={actionLoading === reg.id}
                                style={{
                                  padding: '8px 14px',
                                  background: '#7C5CFC',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 4,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                                }}
                              >
                                💾 Update Note
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={async () => {
                                await (onSetStatus || onApprove)(reg.id, 'VERIFIED', decisionNotes || reg.admin_notes || 'Welcome to the MSAP Alumni Society!');
                                alert(`🎉 Welcome & congratulatory email dispatched to ${reg.email}!`);
                              }}
                              disabled={actionLoading === reg.id}
                              style={{
                                padding: '8px 14px',
                                background: '#15803D',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                              title="Send or resend the welcome & congratulations email to this verified alumnus"
                            >
                              ✉️ Resend Welcome Email
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(reg.id, reg.full_name)}
                              disabled={actionLoading === reg.id}
                              style={{
                                padding: '8px 14px',
                                background: '#dc2626',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                marginLeft: 'auto',
                                cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              }}
                            >
                              🗑 Delete User
                            </button>
                          </div>
                        </div>
                      ) : reg.status === 'REJECTED' ? (
                        <div>
                          <p style={{ margin: '0 0 12px', fontSize: 12, color: '#DC2626', fontWeight: 600 }}>
                            ✕ Rejected — User cannot sign in to the alumni directory.
                          </p>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => (onSetStatus || onApprove)(reg.id, 'VERIFIED', decisionNotes || 'Re-approved after review.')}
                              disabled={actionLoading === reg.id}
                              style={{
                                padding: '8px 14px',
                                background: '#16A34A',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              }}
                            >
                              ✓ Re-Approve & Verify
                            </button>
                            <button
                              type="button"
                              onClick={() => (onSetStatus || onApprove)(reg.id, 'PENDING', decisionNotes || 'Moved back to review queue.')}
                              disabled={actionLoading === reg.id}
                              style={{
                                padding: '8px 14px',
                                background: '#D97706',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              }}
                            >
                              Move to Pending
                            </button>
                            {decisionNotes !== (reg.admin_notes || '') && (
                              <button
                                type="button"
                                onClick={() => (onSetStatus || onReject)(reg.id, 'REJECTED', decisionNotes)}
                                disabled={actionLoading === reg.id}
                                style={{
                                  padding: '8px 14px',
                                  background: '#7C5CFC',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 4,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                                }}
                              >
                                💾 Save New Note
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onDelete(reg.id, reg.full_name)}
                              disabled={actionLoading === reg.id}
                              style={{
                                padding: '8px 14px',
                                background: 'transparent',
                                color: '#DC2626',
                                border: '1px solid #fca5a5',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                marginLeft: 'auto',
                                cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              }}
                            >
                              🗑 Delete Permanently
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* PENDING */
                        <div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button
                              id={`approve-${reg.id}`}
                              type="button"
                              onClick={() => (onSetStatus || onApprove)(reg.id, 'VERIFIED', decisionNotes)}
                              disabled={actionLoading === reg.id}
                              style={{
                                flex: 1,
                                minWidth: 140,
                                padding: '10px 16px',
                                background: '#16A34A',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {actionLoading === reg.id ? 'Updating…' : '✓ Approve & Verify'}
                            </button>
                            <button
                              id={`reject-${reg.id}`}
                              type="button"
                              onClick={() => (onSetStatus || onReject)(reg.id, 'REJECTED', decisionNotes || 'Application details could not be verified.')}
                              disabled={actionLoading === reg.id}
                              style={{
                                flex: 1,
                                minWidth: 140,
                                padding: '10px 16px',
                                background: 'transparent',
                                color: '#DC2626',
                                border: '1px solid #DC2626',
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              }}
                            >
                              ✕ Reject Application
                            </button>
                            <button
                              id={`delete-${reg.id}`}
                              type="button"
                              onClick={() => onDelete(reg.id, reg.full_name)}
                              disabled={actionLoading === reg.id}
                              style={{
                                padding: '10px 14px',
                                background: '#dc2626',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              }}
                              title="Permanently remove from database"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Editorial Team Management Component ─────────────────────────────────────

function EditorialTeamManagementView({ darkMode = false }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const cardBg = darkMode ? '#1A152B' : '#fff';
  const cardBorder = darkMode ? 'rgba(168, 143, 240, 0.15)' : '#EAE5F2';
  const textPrimary = darkMode ? '#FAF9FC' : '#1A1429';
  const textSecondary = darkMode ? '#A89EC4' : '#7E7394';
  const inputBg = darkMode ? '#140F24' : '#FFFFFF';
  const inputBorder = darkMode ? '#3E3263' : '#D1C9DE';

  const loadTeam = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEditorialTeam();
      setTeam(data || []);
    } catch (err) {
      console.error('Failed to load team roster:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      await assignAlumniRole(emailInput.trim(), 'CONTENT_MANAGER');
      setFeedback({
        type: 'success',
        text: `Granted Content Manager role to "${emailInput.trim()}". They can now log in to manage stories, events, and galleries.`,
      });
      setEmailInput('');
      await loadTeam();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Failed to assign role. Make sure the user has submitted an alumni registration first.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (memberEmail) => {
    if (!window.confirm(`Are you sure you want to revoke editorial permissions for "${memberEmail}"?`)) return;
    try {
      await revokeAlumniRole(memberEmail);
      await loadTeam();
    } catch (err) {
      alert(err.message || 'Failed to revoke role');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, borderBottom: darkMode ? '1px solid rgba(168, 143, 240, 0.12)' : '1px solid #EAE5F2', paddingBottom: 20 }}>
        <h1 style={{ margin: '0 0 6px', fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 600, color: textPrimary }}>
          Editorial Team & Roles
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: textSecondary }}>
          Assign Content Manager roles to registered alumni by email. Content Managers can publish and update articles, events, and gallery records without access to membership registrations.
        </p>
      </div>

      {/* Role Assignment Card */}
      <div style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 8,
        padding: 24,
        marginBottom: 24,
        boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
      }}>
        <h3 style={{ margin: '0 0 8px', fontFamily: 'Playfair Display, Georgia, serif', fontSize: 18, color: textPrimary }}>
          Grant Editorial Access to a Registered Alumnus
        </h3>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: textSecondary }}>
          Enter the email address of a registered alumnus. They will receive Content Manager permissions to curate stories, events, and gallery assets.
        </p>

        {feedback && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 13,
            background: feedback.type === 'success'
              ? (darkMode ? 'rgba(22, 163, 74, 0.15)' : '#edfbf2')
              : (darkMode ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2'),
            border: `1px solid ${feedback.type === 'success' ? '#16A34A' : '#DC2626'}`,
            color: feedback.type === 'success' ? '#16A34A' : '#DC2626',
          }}>
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleAssign} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: textSecondary, marginBottom: 6 }}>
              Registered Alumnus Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. sanjit.ningombam@gmail.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                background: inputBg,
                color: textPrimary,
                border: `1px solid ${inputBorder}`,
                fontSize: 13,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ width: 180 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: textSecondary, marginBottom: 6 }}>
              Assigned Role
            </label>
            <div style={{
              padding: '10px 14px',
              borderRadius: 6,
              background: darkMode ? '#261C3D' : '#F4F0FA',
              color: '#7C5CFC',
              fontWeight: 700,
              fontSize: 13,
              border: '1px solid rgba(124, 92, 252, 0.3)',
            }}>
              Content Manager
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !emailInput.trim()}
            style={{
              padding: '10px 20px',
              background: submitting ? '#9E92B5' : '#7C5CFC',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {submitting ? 'Assigning…' : '+ Grant Role'}
          </button>
        </form>
      </div>

      {/* Team Roster Table */}
      <div style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${cardBorder}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: darkMode ? '#161126' : '#FAF9FC',
        }}>
          <h3 style={{ margin: 0, fontFamily: 'Playfair Display, Georgia, serif', fontSize: 17, color: textPrimary }}>
            Current Staff & Editorial Roster
          </h3>
          <span style={{ fontSize: 12, fontWeight: 600, color: textSecondary }}>
            {team.length} member{team.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: textSecondary, fontSize: 13 }}>
            Loading team roster…
          </div>
        ) : team.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: textSecondary, fontSize: 13 }}>
            No staff or content managers found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: darkMode ? '#150F26' : '#F9F7FC', borderBottom: `1px solid ${cardBorder}` }}>
                  {['Name & Email', 'Assigned Role', 'Access Scope', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: textSecondary,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {team.map((m) => {
                  const isSuperAdmin = m.role === 'SUPER_ADMIN';
                  const isModerator = m.role === 'MODERATOR' || m.role === 'CONTENT_MANAGER';
                  return (
                    <tr key={m.id || m.email} style={{ borderBottom: `1px solid ${cardBorder}` }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: textPrimary }}>
                          {m.full_name || 'Staff Member'}
                        </div>
                        <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
                          {m.email}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 700,
                          background: isSuperAdmin
                            ? 'rgba(217, 119, 6, 0.15)'
                            : isModerator
                            ? 'rgba(124, 92, 252, 0.15)'
                            : 'rgba(22, 163, 74, 0.15)',
                          color: isSuperAdmin ? '#D97706' : isModerator ? '#7C5CFC' : '#16A34A',
                        }}>
                          {isSuperAdmin ? 'Super Admin' : isModerator ? 'Content Manager' : m.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: textSecondary }}>
                        {isSuperAdmin
                          ? 'Full Access (Registrations + Content + Roles)'
                          : 'Editorial Only (Articles, Events, Gallery)'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          color: m.is_active ? '#16A34A' : '#DC2626',
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.is_active ? '#16A34A' : '#DC2626' }} />
                          {m.is_active ? 'Active' : 'Revoked'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {!isSuperAdmin && m.is_active && (
                          <button
                            type="button"
                            onClick={() => handleRevoke(m.email)}
                            style={{
                              padding: '5px 12px',
                              background: 'transparent',
                              border: '1px solid #DC2626',
                              color: '#DC2626',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            Revoke Access
                          </button>
                        )}
                        {isSuperAdmin && (
                          <span style={{ fontSize: 11, color: textSecondary, fontStyle: 'italic' }}>
                            Permanent
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Retrieve session
  const user = (() => {
    try {
      const stored = sessionStorage.getItem('msap_admin_user') || sessionStorage.getItem('msap_alumni_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();
  const isSuperOrAdmin = Boolean(user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role));
  const isContentManager = Boolean(user && ['MODERATOR', 'CONTENT_MANAGER'].includes(user.role));
  const isAuthorizedStaff = isSuperOrAdmin || isContentManager;

  const [activeTab, setActiveTab] = useState(isSuperOrAdmin ? 'REGISTRATIONS' : 'ARTICLES');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('msap_admin_dark_mode') === 'true');

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('msap_admin_dark_mode', String(next));
      return next;
    });
  };
  const [registrations, setRegistrations] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, verified: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // id of row being actioned
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 25;

  // Search & Filter toolbar states
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [decadeFilter, setDecadeFilter] = useState('');
  const [exportingCSV, setExportingCSV] = useState(false);

  // RBAC guard: redirect if not authenticated or not authorized staff
  useEffect(() => {
    if (!isAuthorizedStaff) navigate('/admin/login', { replace: true });
  }, [isAuthorizedStaff, navigate]);

  const loadRegistrations = useCallback(async () => {
    if (!isSuperOrAdmin) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const statusParam = activeFilter === 'ALL' ? '' : activeFilter;
      const data = await fetchRegistrations({
        status: statusParam,
        search: searchQuery,
        puneCollege: collegeFilter,
        batchDecade: decadeFilter,
        page,
        limit: LIMIT,
      });
      setRegistrations(data?.items || []);
      setTotal(data?.total || 0);

      // Also load all-statuses counts for the sidebar badges
      const [all, pending, verified, rejected] = await Promise.all([
        fetchRegistrations({ status: '', page: 1, limit: 1 }),
        fetchRegistrations({ status: 'PENDING', page: 1, limit: 1 }),
        fetchRegistrations({ status: 'VERIFIED', page: 1, limit: 1 }),
        fetchRegistrations({ status: 'REJECTED', page: 1, limit: 1 }),
      ]);
      setCounts({
        all: all?.total ?? 0,
        pending: pending?.total ?? 0,
        verified: verified?.total ?? 0,
        rejected: rejected?.total ?? 0,
      });
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        sessionStorage.clear();
        navigate('/admin/login', { replace: true });
      } else {
        setErrorMsg(err.message || 'Failed to load registrations.');
      }
    } finally {
      setLoading(false);
    }
  }, [activeFilter, searchQuery, collegeFilter, decadeFilter, page, navigate, isSuperOrAdmin]);

  useEffect(() => { loadRegistrations(); }, [loadRegistrations]);

  const handleFilterChange = (f) => {
    setActiveFilter(f);
    setPage(1);
    setExpandedId(null);
  };

  const handleExportCSV = async () => {
    setExportingCSV(true);
    try {
      await downloadAlumniCSV(
        {
          status: activeFilter === 'ALL' ? '' : activeFilter,
          search: searchQuery,
          puneCollege: collegeFilter,
          batchDecade: decadeFilter,
        },
        registrations
      );
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setExportingCSV(false);
    }
  };

  const handleAction = async (id, newStatus, notes) => {
    setActionLoading(id);
    try {
      const target = registrations.find((r) => r.id === id);
      await updateRegistrationStatus(id, newStatus, notes, {
        expectedStatus: target?.status,
        lastKnownUpdatedAt: target?.updated_at,
      });
      // Optimistically update the local row
      setRegistrations((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: newStatus, admin_notes: notes } : r)
      );
      setCounts((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        [newStatus === 'VERIFIED' ? 'verified' : 'rejected']: prev[newStatus === 'VERIFIED' ? 'verified' : 'rejected'] + 1,
      }));
      setExpandedId(null);
    } catch (err) {
      if (err.status === 409 || err.message?.includes('Conflict')) {
        alert(`Concurrency Conflict: ${err.message}\n\nThe record was updated by another administrator. Reloading registrations.`);
        await loadRegistrations();
      } else {
        alert(err.message || 'Failed to update status. Please try again.');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, name) => {
    const ok = window.confirm(
      `Are you sure you want to permanently delete the registration for "${name || 'this applicant'}"?\n\nThis will remove the record from both the database and this dashboard.`
    );
    if (!ok) return;

    setActionLoading(id);
    try {
      await deleteRegistration(id);

      const target = registrations.find((r) => r.id === id);
      const targetStatus = target ? target.status : null;

      // Remove from table state
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));

      // Update sidebar badge counters
      setCounts((prev) => ({
        ...prev,
        all: Math.max(0, prev.all - 1),
        pending: targetStatus === 'PENDING' ? Math.max(0, prev.pending - 1) : prev.pending,
        verified: targetStatus === 'VERIFIED' ? Math.max(0, prev.verified - 1) : prev.verified,
        rejected: targetStatus === 'REJECTED' ? Math.max(0, prev.rejected - 1) : prev.rejected,
      }));

      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      alert(err.message || 'Failed to delete registration. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateProfile = async (id, profileData) => {
    setActionLoading(id);
    try {
      const updated = await updateAlumniProfile(id, profileData);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
      );
      // Refresh count badges
      const [all, pending, verified, rejected] = await Promise.all([
        fetchRegistrations({ status: '', page: 1, limit: 1 }),
        fetchRegistrations({ status: 'PENDING', page: 1, limit: 1 }),
        fetchRegistrations({ status: 'VERIFIED', page: 1, limit: 1 }),
        fetchRegistrations({ status: 'REJECTED', page: 1, limit: 1 }),
      ]);
      setCounts({
        all: all?.total ?? 0,
        pending: pending?.total ?? 0,
        verified: verified?.total ?? 0,
        rejected: rejected?.total ?? 0,
      });
      return updated;
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {
      // Ignore network errors during logout
    }
    sessionStorage.clear();
    navigate('/admin/login', { replace: true });
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: darkMode ? '#0C0917' : '#FAF9FC',
      fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
      color: darkMode ? '#FAF9FC' : '#1A1429',
      transition: 'background 0.2s',
    }}>
      <Sidebar
        user={user}
        isSuperOrAdmin={isSuperOrAdmin}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main style={{
        flex: 1,
        padding: '24px 36px 40px',
        overflowY: 'auto',
        minWidth: 0,
        background: darkMode ? '#0F0B1E' : '#FAF9FC',
        color: darkMode ? '#FAF9FC' : '#1A1429',
      }}>
        {/* Top bar with quick breadcrumb & Dark Mode toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          paddingBottom: 14,
          borderBottom: darkMode ? '1px solid rgba(168, 143, 240, 0.12)' : '1px solid #EAE5F2',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#7C5CFC', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              MSAP Admin
            </span>
            <span style={{ fontSize: 12, color: darkMode ? '#6B5E82' : '#B8B0C8' }}>/</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: darkMode ? '#A89EC4' : '#7E7394' }}>
              {activeTab === 'ARTICLES'
                ? 'Articles & Stories'
                : activeTab === 'EVENTS'
                ? 'Events & Calendar'
                : activeTab === 'GALLERY'
                ? 'Photo Gallery'
                : activeTab === 'ROLES_MGMT'
                ? 'Editorial Team & Roles'
                : 'Alumni Registrations'}
            </span>
          </div>

          <button
            onClick={toggleDarkMode}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              background: darkMode ? '#1D1730' : '#FFFFFF',
              border: darkMode ? '1px solid #4D3D75' : '1px solid #D1C9DE',
              color: darkMode ? '#FAF9FC' : '#1A1429',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
            <span style={{
              display: 'inline-block',
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: darkMode ? '#7C5CFC' : '#EAE3F7',
              textAlign: 'center',
              lineHeight: '16px',
              fontSize: 9,
              color: darkMode ? '#fff' : '#583B9C',
              fontWeight: 700,
            }}>
              {darkMode ? '✓' : '●'}
            </span>
          </button>
        </div>

        {activeTab === 'ARTICLES' ? (
          <ArticlesAdminView darkMode={darkMode} />
        ) : activeTab === 'EVENTS' ? (
          <EventsAdminView darkMode={darkMode} />
        ) : activeTab === 'GALLERY' ? (
          <GalleryAdminView darkMode={darkMode} />
        ) : activeTab === 'ROLES_MGMT' && isSuperOrAdmin ? (
          <EditorialTeamManagementView darkMode={darkMode} />
        ) : isSuperOrAdmin ? (
          <>
            {/* Header */}
            <div style={{ marginBottom: 24, borderBottom: darkMode ? '1px solid rgba(168, 143, 240, 0.12)' : '1px solid #EAE5F2', paddingBottom: 20 }}>
              <h1 style={{ margin: '0 0 6px', fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 600, color: darkMode ? '#FAF9FC' : '#1A1429' }}>
                {activeFilter === 'ALL' ? 'All Registrations' : `${activeFilter.charAt(0) + activeFilter.slice(1).toLowerCase()} Registrations`}
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: darkMode ? '#A89EC4' : '#7E7394' }}>
                Review alumni submissions, edit member details, and manage verification status.
              </p>
            </div>

        {/* Stats */}
        <StatsBanner counts={counts} darkMode={darkMode} />

        {/* Status Filter Pills Bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Submissions', count: counts.all, dot: null },
            { id: 'PENDING', label: 'Pending Review', count: counts.pending, dot: '#7C5CFC' },
            { id: 'VERIFIED', label: 'Verified Alumni', count: counts.verified, dot: '#16A34A' },
            { id: 'REJECTED', label: 'Rejected', count: counts.rejected, dot: '#DC2626' },
          ].map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id.toLowerCase()}`}
                type="button"
                onClick={() => handleFilterChange(tab.id)}
                style={{
                  padding: '9px 18px',
                  background: active ? '#7C5CFC' : (darkMode ? '#1A152B' : '#fff'),
                  color: active ? '#FAF9FC' : (darkMode ? '#FAF9FC' : '#5C5347'),
                  border: active ? '1px solid #7C5CFC' : (darkMode ? '1px solid rgba(168, 143, 240, 0.15)' : '1px solid #EAE5F2'),
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: active ? '0 2px 8px rgba(124, 92, 252, 0.3)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {tab.dot && (
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: tab.dot }} />
                )}
                <span>{tab.label}</span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '1px 8px',
                  borderRadius: 10,
                  background: active ? '#583B9C' : (darkMode ? '#292140' : '#F0ECE4'),
                  color: active ? '#FAF9FC' : (darkMode ? '#A89EC4' : '#7E7394'),
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, College Filter, Batch Decade & CSV Export Toolbar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          background: darkMode ? '#1A152B' : '#FFFFFF',
          border: darkMode ? '1px solid rgba(168, 143, 240, 0.15)' : '1px solid #EAE5F2',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 20,
          boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flex: 1, minWidth: 280, alignItems: 'center' }}>
            {/* Text Search Input */}
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
              <input
                type="text"
                placeholder="🔍 Search name, email, phone, location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  background: darkMode ? '#140F24' : '#FAF9FC',
                  border: darkMode ? '1px solid #3E3263' : '1px solid #D1C9DE',
                  borderRadius: 6,
                  color: darkMode ? '#FAF9FC' : '#1A1429',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            {/* College Filter Dropdown */}
            <select
              value={collegeFilter}
              onChange={(e) => {
                setCollegeFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '8px 12px',
                background: darkMode ? '#140F24' : '#FAF9FC',
                border: darkMode ? '1px solid #3E3263' : '1px solid #D1C9DE',
                borderRadius: 6,
                color: darkMode ? '#FAF9FC' : '#1A1429',
                fontSize: 12,
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">🏛️ All Colleges</option>
              <option value="Fergusson">Fergusson College</option>
              <option value="COEP">COEP</option>
              <option value="Symbiosis">Symbiosis International</option>
              <option value="BMCC">BMCC</option>
              <option value="SPPU">SPPU / Pune University</option>
              <option value="Bharati Vidyapeeth">Bharati Vidyapeeth</option>
              <option value="MIT">MIT Pune</option>
              <option value="DY Patil">D.Y. Patil University</option>
              <option value="AFMC">AFMC</option>
            </select>

            {/* Batch Decade Dropdown */}
            <select
              value={decadeFilter}
              onChange={(e) => {
                setDecadeFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '8px 12px',
                background: darkMode ? '#140F24' : '#FAF9FC',
                border: darkMode ? '1px solid #3E3263' : '1px solid #D1C9DE',
                borderRadius: 6,
                color: darkMode ? '#FAF9FC' : '#1A1429',
                fontSize: 12,
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">🎓 All Batch Decades</option>
              <option value="1970">1970s (1970–1979)</option>
              <option value="1980">1980s (1980–1989)</option>
              <option value="1990">1990s (1990–1999)</option>
              <option value="2000">2000s (2000–2009)</option>
              <option value="2010">2010s (2010–2019)</option>
              <option value="2020">2020s (2020–2029)</option>
            </select>

            {/* Reset Filters */}
            {(searchQuery || collegeFilter || decadeFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCollegeFilter('');
                  setDecadeFilter('');
                  setPage(1);
                }}
                style={{
                  padding: '6px 10px',
                  background: 'transparent',
                  border: 'none',
                  color: darkMode ? '#A89EC4' : '#7E7394',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Export to CSV Action */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exportingCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: darkMode ? 'rgba(124, 92, 252, 0.2)' : '#F3F0FA',
              color: darkMode ? '#FAF9FC' : '#583B9C',
              border: darkMode ? '1px solid rgba(124, 92, 252, 0.4)' : '1px solid #D5CCF5',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: exportingCSV ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            title="Download verified and registered alumni roster as CSV spreadsheet"
          >
            <span>{exportingCSV ? '⏳' : '📥'}</span>
            <span>{exportingCSV ? 'Exporting...' : 'Export to CSV'}</span>
          </button>
        </div>

        {/* Error */}
        {errorMsg && (
          <div style={{ padding: '12px 16px', background: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef1ee', border: '1px solid #D64933', color: darkMode ? '#FCA5A5' : '#D64933', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
            {errorMsg}
            <button onClick={loadRegistrations} style={{ marginLeft: 12, fontSize: 12, fontWeight: 700, background: 'none', border: 'none', color: darkMode ? '#FCA5A5' : '#D64933', cursor: 'pointer', textDecoration: 'underline' }}>
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ background: darkMode ? '#1A152B' : '#fff', border: darkMode ? '1px solid rgba(168, 143, 240, 0.15)' : '1px solid #E8E2D8', borderRadius: 8, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ padding: '14px 20px', borderBottom: darkMode ? '1px solid rgba(168, 143, 240, 0.12)' : '1px solid #E8E2D8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: darkMode ? '#161126' : '#fff' }}>
            <h3 style={{ margin: 0, fontFamily: 'Playfair Display, Georgia, serif', fontSize: 17, fontWeight: 600, color: darkMode ? '#FAF9FC' : '#0B0E1A' }}>
              {activeFilter === 'VERIFIED' ? 'Accepted & Verified Alumni Directory' : activeFilter === 'PENDING' ? 'Pending Review Queue' : 'Registration Queue'}
            </h3>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: darkMode ? '#A89EC4' : '#9B9484' }}>
              {total} total
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: darkMode ? '#A89EC4' : '#9B9484', fontSize: 13 }}>
              Loading registrations…
            </div>
          ) : registrations.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, color: darkMode ? '#FAF9FC' : '#0B0E1A', margin: '0 0 8px' }}>
                No registrations found
              </p>
              <p style={{ fontSize: 13, color: darkMode ? '#A89EC4' : '#9B9484', margin: 0 }}>
                {searchQuery || collegeFilter || decadeFilter
                  ? 'No registrations found matching your search or filter criteria. Try clearing your filters.'
                  : activeFilter !== 'ALL'
                  ? `No ${activeFilter.toLowerCase()} submissions yet.`
                  : 'No one has registered yet.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: darkMode ? '#221B38' : '#F5F0E8' }}>
                    {['Name', 'Email', 'College', 'Batch', 'Status', 'Submitted', ''].map((col) => (
                      <th key={col} style={{
                        padding: '12px 20px', textAlign: 'left', fontSize: 11,
                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: darkMode ? '#A89EC4' : '#9B9484', borderBottom: darkMode ? '1px solid rgba(168, 143, 240, 0.12)' : '1px solid #E8E2D8', whiteSpace: 'nowrap',
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <RegistrationRow
                      key={reg.id}
                      reg={reg}
                      isExpanded={expandedId === reg.id}
                      onToggle={() => setExpandedId(expandedId === reg.id ? null : reg.id)}
                      onSetStatus={(id, status, notes) => handleAction(id, status, notes)}
                      onApprove={(id, notes) => handleAction(id, 'VERIFIED', notes)}
                      onReject={(id, notes) => handleAction(id, 'REJECTED', notes)}
                      onDelete={handleDelete}
                      onUpdateProfile={handleUpdateProfile}
                      actionLoading={actionLoading}
                      darkMode={darkMode}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: '7px 16px', background: 'transparent', border: '1px solid #E8E2D8',
                    fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: page === 1 ? '#C8C0B0' : '#0B0E1A', cursor: page === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Previous
                </button>
                <span style={{ fontSize: 12, color: '#9B9484' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: '7px 16px', background: 'transparent', border: '1px solid #E8E2D8',
                    fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: page === totalPages ? '#C8C0B0' : '#0B0E1A', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <ArticlesAdminView darkMode={darkMode} />
        )}
      </main>
    </div>
  );
}
