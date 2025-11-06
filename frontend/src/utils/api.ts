export const API_BASE = (process.env.VITE_BACKEND_URL as string) || '';

export async function apiFetch(input: string, init?: RequestInit) {
  const url = input.startsWith('http') ? input : `${API_BASE}${input}`;
  return fetch(url, init);
}

export default apiFetch;
