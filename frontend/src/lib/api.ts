export function apiUrl(path: string): string {
  const base = (import.meta as any).env?.VITE_API_URL as string | undefined;
  // In dev without VITE_API_URL, rely on Vite proxy by using relative /api
  if (import.meta.env.DEV && !base) return path.startsWith('/') ? path : `/${path}`;
  // In docker/prod, use absolute base
  const root = base?.replace(/\/$/, '') || '';
  return `${root}${path.startsWith('/') ? path : `/${path}`}`;
}
