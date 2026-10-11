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

export async function fetchRegistrations({ status = '', page = 1, limit = 25 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (status) params.set('status', status);
  return request(`/alumni?${params.toString()}`);
}

export async function updateRegistrationStatus(id, status, adminNotes = '') {
  return request(`/alumni/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, adminNotes }),
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


