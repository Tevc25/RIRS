export const API_BASE = (process.env.VITE_BACKEND_URL as string) || '';

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem('token') || window.sessionStorage.getItem('token');
  } catch (err) {
    console.warn('Unable to access storage for auth token', err);
    return null;
  }
};

export async function apiFetch(input: string, init: RequestInit = {}) {
  const url = input.startsWith('http') ? input : `${API_BASE}${input}`;
  const headers = new Headers(init.headers || {});
  const token = getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const finalInit: RequestInit = {
    credentials: init.credentials ?? 'include',
    ...init,
    headers
  };
  return fetch(url, finalInit);
}

export default apiFetch;
