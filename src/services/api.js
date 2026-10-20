import { getToken } from '../utils/authStorage';

const CANDIDATE_BASES = [
  process.env.REACT_APP_API_URL?.replace(/\/$/, ''),
  'http://127.0.0.1:8000/api',
  'http://127.0.0.1:8001/api',
  'http://localhost:8000/api',
  'http://localhost:8001/api',
].filter(Boolean);

let activeApiBase = CANDIDATE_BASES[0] || 'http://127.0.0.1:8000/api';

function formatError(data) {
  if (data.detail) return data.detail;
  if (typeof data === 'string') return data;
  const parts = [];
  Object.entries(data).forEach(([key, val]) => {
    const messages = Array.isArray(val) ? val : [String(val)];
    messages.forEach(msg => parts.push(key === 'non_field_errors' ? msg : `${key}: ${msg}`));
  });
  return parts.join(' ') || 'Request failed';
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const basesToTry = [activeApiBase, ...CANDIDATE_BASES.filter(b => b !== activeApiBase)];
  let lastError;

  for (const base of basesToTry) {
    try {
      const res = await fetch(`${base}${path}`, {
        ...options,
        headers,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(formatError(data));
      }
      activeApiBase = base;
      return data;
    } catch (err) {
      lastError = err;
      const isNetworkError =
        err.name === 'TypeError' ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('Network request failed');

      if (!isNetworkError) {
        throw err;
      }
    }
  }

  throw lastError || new Error('Request failed. Is the Django server running?');
}

export function registerUser(payload) {
  return request('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(username, password) {
  return request('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function logoutUser() {
  return request('/auth/logout/', { method: 'POST' });
}

export function fetchMe() {
  return request('/auth/me/');
}

export function fetchProducts({ category = 'all', ordering } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.set('category', category);
  if (ordering === 'low') params.set('ordering', 'price');
  if (ordering === 'high') params.set('ordering', '-price');
  const qs = params.toString();
  return request(`/products/${qs ? `?${qs}` : ''}`);
}

export function createOrder(payload) {
  return request('/orders/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchMyOrders() {
  return request('/orders/list/');
}

export function subscribeNewsletter(email) {
  return request('/newsletter/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
