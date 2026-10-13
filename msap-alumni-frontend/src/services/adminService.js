import { request } from './api';

export async function adminLogin(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function adminLogout() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('msap_admin_token');
    sessionStorage.removeItem('msap_admin_user');
  }
  return request('/auth/logout', { method: 'POST' });
}

export async function fetchRegistrations({
  status = '',
  search = '',
  puneCollege = '',
  batchDecade = '',
  batchYear = '',
  page = 1,
  limit = 25,
} = {}) {
  const params = new URLSearchParams({ page, limit });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  if (puneCollege) params.set('puneCollege', puneCollege);
  if (batchDecade) params.set('batchDecade', batchDecade);
  if (batchYear) params.set('batchYear', batchYear);
  return request(`/alumni?${params.toString()}`);
}

export async function downloadAlumniCSV(filters = {}, fallbackItems = []) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'ALL') params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.puneCollege) params.set('puneCollege', filters.puneCollege);
  if (filters.batchDecade) params.set('batchDecade', filters.batchDecade);

  const token = typeof window !== 'undefined'
    ? (sessionStorage.getItem('msap_admin_token') || sessionStorage.getItem('msap_alumni_token'))
    : null;

  const dateStr = new Date().toISOString().split('T')[0];

  try {
    const url = `${BASE_URL}/alumni/export?${params.toString()}`;
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    });

    if (res.ok) {
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `msap_alumni_roster_${dateStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      return;
    }
  } catch (err) {
    console.warn('Backend CSV export failed, falling back to local dataset export:', err);
  }

  // Fallback: Generate RFC-4180 CSV with UTF-8 BOM from local dataset
  const headers = [
    'Full Name',
    'Email Address',
    'Phone',
    'Pune College / Institution',
    'Batch Year',
    'Current Location',
    'Profession / Designation',
    'Status',
    'Admin Notes',
    'Registered Date',
    'Reviewed At',
  ];

  const escape = (val) => {
    if (val === null || val === undefined) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  };

  const rows = fallbackItems.map((r) => [
    escape(r.full_name),
    escape(r.email),
    escape(r.phone),
    escape(r.pune_college),
    escape(r.batch_year),
    escape(r.current_location),
    escape(r.profession),
    escape(r.status),
    escape(r.admin_notes),
    escape(r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : ''),
    escape(r.reviewed_at ? new Date(r.reviewed_at).toISOString().split('T')[0] : ''),
  ]);

  const csvString = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `msap_alumni_roster_${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
}

export async function updateRegistrationStatus(id, status, adminNotes = '', options = {}) {
  return request(`/alumni/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      adminNotes,
      expectedStatus: options.expectedStatus,
      lastKnownUpdatedAt: options.lastKnownUpdatedAt,
    }),
  });
}

export async function deleteRegistration(id) {
  return request(`/alumni/${id}`, {
    method: 'DELETE',
  });
}

export async function updateAlumniProfile(id, profileData) {
  return request(`/alumni/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  });
}

// ─── Team & Roles Management ─────────────────────────────────────────────────

export async function fetchEditorialTeam() {
  return request('/alumni/team');
}

export async function assignAlumniRole(email, role = 'CONTENT_MANAGER') {
  return request('/alumni/assign-role', {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });
}

export async function revokeAlumniRole(email) {
  return request('/alumni/revoke-role', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// ─── Stories / Articles Management ──────────────────────────────────────────

export async function fetchAdminStories() {
  return request('/stories');
}

export async function createStory(storyData) {
  return request('/stories', {
    method: 'POST',
    body: JSON.stringify(storyData),
  });
}

export async function updateStory(id, storyData) {
  return request(`/stories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(storyData),
  });
}

export async function deleteStory(id) {
  return request(`/stories/${id}`, {
    method: 'DELETE',
  });
}

// ─── Gallery Management ──────────────────────────────────────────────────────

export async function fetchAdminGallery(category = '') {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return request(`/gallery${query}`);
}

export async function createGalleryItem(itemData) {
  return request('/gallery', {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
}

export async function updateGalleryItem(id, itemData) {
  return request(`/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  });
}

export async function deleteGalleryItem(id) {
  return request(`/gallery/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadImage(file, folder = 'general') {
  const formData = new FormData();
  formData.append('image', file);
  return request(`/upload?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    body: formData,
  });
}

// ─── Events Management ───────────────────────────────────────────────────────

export async function fetchAdminEvents() {
  return request('/events');
}

export async function createEvent(eventData) {
  return request('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

export async function updateEvent(id, eventData) {
  return request(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  });
}

export async function deleteEvent(id) {
  return request(`/events/${id}`, {
    method: 'DELETE',
  });
}


