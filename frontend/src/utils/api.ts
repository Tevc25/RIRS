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

export async function fetchInvitations(eventId: string) {
  const res = await apiFetch(`/api/events/${eventId}/invitations`);
  if (!res.ok) throw new Error('Failed to load invitations');
  return res.json();
}

export async function createInvitations(eventId: string, invitations: { email: string; name?: string | null }[]) {
  const res = await apiFetch(`/api/events/${eventId}/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invitations })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || 'Failed to send invitations');
  }
  return res.json();
}

export async function sendReminder(invitationId: string) {
  const res = await apiFetch(`/api/invitations/${invitationId}/reminder`, { method: 'POST' });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || 'Failed to send reminder');
  }
  return res.json();
}

export async function fetchEventReport(eventId: string) {
  const res = await apiFetch(`/api/events/${eventId}/report`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || 'Failed to fetch report');
  }
  return res.json();
}

export async function submitFeedback(eventId: string, rating: number, comment?: string | null) {
  const res = await apiFetch(`/api/events/${eventId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || 'Failed to submit feedback');
  }
  return res.json();
}

export async function fetchRsvpInvite(token: string) {
  const res = await apiFetch(`/api/rsvp/${token}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || 'Failed to load RSVP invitation');
  }
  return res.json();
}

export async function submitRsvp(token: string, data: { attending: boolean; companions?: number; dietary?: string | null; personalNote?: string | null }) {
  const res = await apiFetch(`/api/rsvp/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || 'Failed to submit RSVP');
  }
  return res.json();
}

export default apiFetch;
