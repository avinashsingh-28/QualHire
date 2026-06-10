/**
 * API service layer — base configuration
 * Replace BASE_URL and implement real fetch logic when backend is ready.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name  = 'ApiError';
    this.status = status;
    this.data   = data;
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('qh_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  if (!res.ok) {
    let data;
    try { data = await res.json(); } catch { data = null; }
    throw new ApiError(data?.message || res.statusText, res.status, data);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const api = {
  get: (path, params) => {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    }).then(handleResponse);
  },

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(body),
    }).then(handleResponse),

  patch: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    }).then(handleResponse),

  upload: (path, formData) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }, // Browser automatically sets Content-Type boundary for multipart
      body: formData,
    }).then(handleResponse),
};

export { ApiError };
export default api;
