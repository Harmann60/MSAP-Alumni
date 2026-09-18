import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  fetchRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  updateAlumniProfile,
  adminLogout,
} from '../services/adminService';

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

function Sidebar({ user, activeFilter, onFilterChange, counts, onLogout }) {
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
            Admin Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '20px 0', flex: 1 }}>
        <p style={{ margin: '0 0 8px', padding: '0 24px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B5E82' }}>
          Registrations
        </p>
        {STATUS_FILTERS.map((f) => {
          const active = activeFilter === f;
          const count = f === 'ALL' ? counts.all : f === 'PENDING' ? counts.pending : f === 'VERIFIED' ? counts.verified : counts.rejected;
          return (
            <button
              key={f}
              id={`filter-${f.toLowerCase()}`}
              onClick={() => onFilterChange(f)}
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
        <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 600, color: '#F5F0E8' }}>
          {user?.fullName || 'Admin'}
        </p>
        <p style={{ margin: '0 0 12px', fontSize: 11, color: '#5C5347' }}>
          {user?.role?.replace('_', ' ')}
        </p>
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

function StatsBanner({ counts }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
      {[
        { label: 'Total', value: counts.all ?? '—', color: '#1A1429' },
        { label: 'Pending Review', value: counts.pending ?? '—', color: '#7C5CFC' },
        { label: 'Verified', value: counts.verified ?? '—', color: '#16A34A' },
        { label: 'Rejected', value: counts.rejected ?? '—', color: '#DC2626' },
      ].map((s) => (
        <div key={s.label} style={{
          flex: 1, padding: '18px 20px', background: '#fff',
          border: '1px solid #EAE5F2', borderLeft: `4px solid ${s.color}`,
          borderRadius: 2,
        }}>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 30, color: '#1A1429', lineHeight: 1 }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7E7394', marginTop: 6 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function RegistrationRow({ reg, isExpanded, onToggle, onApprove, onReject, onDelete, onUpdateProfile, actionLoading }) {
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
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

  /* eslint-disable react-hooks/set-state-in-effect */
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
  /* eslint-enable react-hooks/set-state-in-effect */

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
          cursor: 'pointer', borderBottom: '1px solid #E8E2D8',
          background: isExpanded ? '#faf9f5' : '#fff',
          transition: 'background 0.15s',
        }}
        onMouseOver={(e) => { if (!isExpanded) e.currentTarget.style.background = '#fdfcf9'; }}
        onMouseOut={(e) => { if (!isExpanded) e.currentTarget.style.background = '#fff'; }}
      >
        <td style={{ padding: '14px 20px', fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 15, color: '#0B0E1A', fontWeight: 400 }}>
          {reg.full_name}
        </td>
        <td style={{ padding: '14px 20px', fontSize: 13, color: '#5C5347' }}>
          {reg.email}
        </td>
        <td style={{ padding: '14px 20px', fontSize: 13, color: '#9B9484' }}>
          {reg.pune_college || '—'}
        </td>
        <td style={{ padding: '14px 20px', fontSize: 13, color: '#9B9484' }}>
          {reg.batch_year || '—'}
        </td>
        <td style={{ padding: '14px 20px' }}>
          <span style={{
            display: 'inline-block', padding: '3px 10px',
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            background: st.bg, color: st.color, borderRadius: 2,
          }}>
            {st.label}
          </span>
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
                    {reg.status === 'VERIFIED' ? (
                      <div style={{ padding: '18px', border: '1px solid #bbf7d0', background: '#f0fdf4' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#16A34A', letterSpacing: '0.08em' }}>
                            ✓ Active Verified Alumnus
                          </span>
                          <span style={{ fontSize: 11, color: '#15803D' }}>Can log in & browse network</span>
                        </div>
                        {reg.admin_notes && (
                          <p style={{ margin: '8px 0 14px', fontSize: 12, color: '#166534', fontStyle: 'italic' }}>
                            "{reg.admin_notes}"
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #dcfce7', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => onReject(reg.id, 'Verification revoked by admin.')}
                            disabled={actionLoading === reg.id}
                            style={{
                              padding: '6px 12px', background: 'transparent', color: '#DC2626',
                              border: '1px solid #fca5a5', fontSize: 11, fontWeight: 600,
                              cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                            }}
                          >
                            Revoke / Mark Rejected
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(reg.id, reg.full_name)}
                            disabled={actionLoading === reg.id}
                            style={{
                              padding: '6px 12px', background: '#dc2626', color: '#fff',
                              border: 'none', fontSize: 11, fontWeight: 700,
                              cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                            }}
                          >
                            🗑 Remove User from Database
                          </button>
                        </div>
                      </div>
                    ) : reg.status === 'REJECTED' ? (
                      <div style={{ padding: '18px', border: '1px solid #fecaca', background: '#fef2f2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#DC2626', letterSpacing: '0.08em' }}>
                            ✕ Registration Rejected
                          </span>
                        </div>
                        {reg.admin_notes && (
                          <p style={{ margin: '8px 0 14px', fontSize: 12, color: '#991b1b', fontStyle: 'italic' }}>
                            "{reg.admin_notes}"
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #fee2e2' }}>
                          <button
                            type="button"
                            onClick={() => onApprove(reg.id, 'Re-verified by admin.')}
                            disabled={actionLoading === reg.id}
                            style={{
                              padding: '6px 12px', background: '#16A34A', color: '#fff',
                              border: 'none', fontSize: 11, fontWeight: 700,
                              cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                            }}
                          >
                            ✓ Re-Approve (Verify)
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(reg.id, reg.full_name)}
                            disabled={actionLoading === reg.id}
                            style={{
                              padding: '6px 12px', background: 'transparent', color: '#DC2626',
                              border: '1px solid #fca5a5', fontSize: 11, fontWeight: 600,
                              cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                            }}
                          >
                            🗑 Delete Permanently
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* PENDING Review Action Panel */
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9B9484', marginBottom: 6 }}>
                          Decision Notes (optional — included in email to applicant)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Optional explanation or reason sent to applicant (e.g., please provide your roll number)…"
                          rows={3}
                          style={{
                            width: '100%', border: '1px solid #E8E2D8', background: '#fff',
                            padding: '10px 12px', fontSize: 13, color: '#0B0E1A',
                            resize: 'vertical', fontFamily: 'Source Sans 3, system-ui, sans-serif',
                            outline: 'none', boxSizing: 'border-box', marginBottom: 12,
                          }}
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            id={`approve-${reg.id}`}
                            type="button"
                            onClick={() => onApprove(reg.id, notes)}
                            disabled={actionLoading === reg.id}
                            style={{
                              flex: 1, padding: '10px 0', background: '#2D8A4E', color: '#fff',
                              border: 'none', fontSize: 12, fontWeight: 700,
                              textTransform: 'uppercase', letterSpacing: '0.08em',
                              cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              opacity: actionLoading === reg.id ? 0.6 : 1, transition: 'opacity 0.15s',
                            }}
                          >
                            {actionLoading === reg.id ? 'Saving…' : '✓ Approve'}
                          </button>
                          <button
                            id={`reject-${reg.id}`}
                            type="button"
                            onClick={() => onReject(reg.id, notes)}
                            disabled={actionLoading === reg.id}
                            style={{
                              flex: 1, padding: '10px 0', background: 'transparent', color: '#D64933',
                              border: '1px solid #D64933', fontSize: 12, fontWeight: 700,
                              textTransform: 'uppercase', letterSpacing: '0.08em',
                              cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              opacity: actionLoading === reg.id ? 0.6 : 1, transition: 'all 0.15s',
                            }}
                          >
                            ✕ Reject
                          </button>
                          <button
                            id={`delete-${reg.id}`}
                            type="button"
                            onClick={() => onDelete(reg.id, reg.full_name)}
                            disabled={actionLoading === reg.id}
                            style={{
                              padding: '10px 14px', background: 'transparent', color: '#888',
                              border: '1px solid #ddd', fontSize: 12, fontWeight: 600,
                              cursor: actionLoading === reg.id ? 'not-allowed' : 'pointer',
                              opacity: actionLoading === reg.id ? 0.6 : 1, transition: 'all 0.15s',
                              display: 'flex', alignItems: 'center', gap: 4,
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.color = '#dc2626';
                              e.currentTarget.style.borderColor = '#dc2626';
                              e.currentTarget.style.background = '#fef2f2';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = '#888';
                              e.currentTarget.style.borderColor = '#ddd';
                              e.currentTarget.style.background = 'transparent';
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
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Retrieve session
  const token = sessionStorage.getItem('msap_admin_token');
  const user = (() => { try { return JSON.parse(sessionStorage.getItem('msap_admin_user')); } catch { return null; } })();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [registrations, setRegistrations] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, verified: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // id of row being actioned
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 25;

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) navigate('/admin/login', { replace: true });
  }, [token, navigate]);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const statusParam = activeFilter === 'ALL' ? '' : activeFilter;
      const data = await fetchRegistrations({ status: statusParam, page, limit: LIMIT });
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
      if (err.status === 401) {
        sessionStorage.clear();
        navigate('/admin/login', { replace: true });
      } else {
        setErrorMsg(err.message || 'Failed to load registrations.');
      }
    } finally {
      setLoading(false);
    }
  }, [activeFilter, page, navigate]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadRegistrations(); }, [loadRegistrations]);

  const handleFilterChange = (f) => {
    setActiveFilter(f);
    setPage(1);
    setExpandedId(null);
  };

  const handleAction = async (id, newStatus, notes) => {
    setActionLoading(id);
    try {
      await updateRegistrationStatus(id, newStatus, notes);
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
      alert(err.message || 'Failed to update status. Please try again.');
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
    await adminLogout().catch(() => {});
    sessionStorage.clear();
    navigate('/admin/login', { replace: true });
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF9FC', fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}>
      <Sidebar
        user={user}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        counts={counts}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', minWidth: 0 }}>

        {/* Header */}
        <div style={{ marginBottom: 24, borderBottom: '1px solid #EAE5F2', paddingBottom: 20 }}>
          <h1 style={{ margin: '0 0 6px', fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 600, color: '#1A1429' }}>
            {activeFilter === 'ALL' ? 'All Registrations' : `${activeFilter.charAt(0) + activeFilter.slice(1).toLowerCase()} Registrations`}
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#7E7394' }}>
            Review alumni submissions, edit member details, and manage verification status.
          </p>
        </div>

        {/* Stats */}
        <StatsBanner counts={counts} />

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
                  background: active ? '#1A1429' : '#fff',
                  color: active ? '#FAF9FC' : '#5C5347',
                  border: active ? '1px solid #1A1429' : '1px solid #EAE5F2',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: active ? '0 2px 6px rgba(26,20,41,0.15)' : 'none',
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
                  background: active ? '#583B9C' : '#F0ECE4',
                  color: active ? '#FAF9FC' : '#7E7394',
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Error */}
        {errorMsg && (
          <div style={{ padding: '12px 16px', background: '#fef1ee', border: '1px solid #D64933', color: '#D64933', marginBottom: 16, fontSize: 13 }}>
            {errorMsg}
            <button onClick={loadRegistrations} style={{ marginLeft: 12, fontSize: 12, fontWeight: 700, background: 'none', border: 'none', color: '#D64933', cursor: 'pointer', textDecoration: 'underline' }}>
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #E8E2D8' }}>
          {/* Table header */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #E8E2D8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 16, fontWeight: 400, color: '#0B0E1A' }}>
              {activeFilter === 'VERIFIED' ? 'Accepted & Verified Alumni Directory' : activeFilter === 'PENDING' ? 'Pending Review Queue' : 'Registration queue'}
            </h3>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9B9484' }}>
              {total} total
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9B9484', fontSize: 13 }}>
              Loading registrations…
            </div>
          ) : registrations.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, color: '#0B0E1A', margin: '0 0 8px' }}>
                No registrations found
              </p>
              <p style={{ fontSize: 13, color: '#9B9484', margin: 0 }}>
                {activeFilter !== 'ALL' ? `No ${activeFilter.toLowerCase()} submissions yet.` : 'No one has registered yet.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F5F0E8' }}>
                    {['Name', 'Email', 'College', 'Batch', 'Status', 'Submitted', ''].map((col) => (
                      <th key={col} style={{
                        padding: '10px 20px', textAlign: 'left', fontSize: 10,
                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: '#9B9484', borderBottom: '1px solid #E8E2D8', whiteSpace: 'nowrap',
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
                      onApprove={(id, notes) => handleAction(id, 'VERIFIED', notes)}
                      onReject={(id, notes) => handleAction(id, 'REJECTED', notes)}
                      onDelete={handleDelete}
                      onUpdateProfile={handleUpdateProfile}
                      actionLoading={actionLoading}
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
      </main>
    </div>
  );
}
