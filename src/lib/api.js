export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function api(path, opts={}) {
  const token = window.__authToken || null; // অথবা context থেকে নাও
  const headers = { 'Content-Type':'application/json', ...(opts.headers||{}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const data = await res.json().catch(()=> ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
