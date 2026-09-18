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
