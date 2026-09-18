import { request } from './api';

export async function submitRegistration(formData) {
  return request('/alumni/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export async function alumniLogin(email, password) {
  return request('/auth/alumni/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function googleLogin({ credential, email }) {
  return request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential, email }),
  });
}

export async function setAlumniPassword(email, password) {
  return request('/auth/alumni/set-password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function alumniLogout() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('msap_alumni_token');
    sessionStorage.removeItem('msap_alumni_user');
    window.dispatchEvent(new Event('msap_auth_change'));
  }
  return request('/auth/logout', { method: 'POST' });
}
