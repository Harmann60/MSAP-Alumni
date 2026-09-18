const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? (sessionStorage.getItem('msap_admin_token') || sessionStorage.getItem('msap_alumni_token')) : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    headers,
    credentials: 'include', // Important: sends/receives HttpOnly cookies
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        result?.message ||
        (result?.errors && result.errors.map((e) => e.message).join(', ')) ||
        `Request failed with status ${response.status}`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = result;
      throw error;
    }

    return result?.data;
  } catch (error) {
    // Fallback error formatting
    if (!error.status) {
      console.warn(`[API Connection Note] Could not connect to backend at ${url}. Operating in local offline fallback.`);
    }
    throw error;
  }
}
