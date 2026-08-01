export interface User {
  id: string
  username: string
  display_name: string | null
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  location: string | null
  created_by: string
  created_at: string
}

export interface Guest {
  id: string
  event_id: string
  name: string
  contact: string | null
  guest_type: 'fanbase' | 'donor' | 'member' | 'guest' | 'general'
  fanbase_id: string | null
  donor_id: string | null
  qr_code_token: string
  slug: string
  checked_in: boolean
  checked_in_at: string | null
  created_at: string
  fanbases?: { name: string } | null
  donors?: { name: string } | null
}

export interface Fanbase {
  id: string
  name: string
}

export interface Donor {
  id: string
  name: string
}

export interface AttendanceStats {
  total: number
  checkedIn: number
  notCheckedIn: number
  byType: Record<string, number>
  checkedInByType: Record<string, number>
}

export interface InvitationData {
  event: {
    title: string
    description: string | null
    event_date: string
    location: string | null
  }
  guest: {
    name: string
    qr_code_token: string
  }
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const body = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    throw new ApiError(body?.error || 'Request failed', res.status)
  }

  return body as T
}

export const authApi = {
  login: (username: string, password: string) =>
    apiFetch<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  me: () => apiFetch<{ user: User }>('/auth/me'),
}

export const eventsApi = {
  list: () => apiFetch<Event[]>('/events'),
  get: (id: string) => apiFetch<Event>(`/events/${id}`),
  create: (data: Partial<Event>) => apiFetch<Event>('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Event>) =>
    apiFetch<Event>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/events/${id}`, { method: 'DELETE' }),
}

export const fanbasesApi = {
  list: () => apiFetch<Fanbase[]>('/fanbases'),
  create: (data: { name: string }) => apiFetch<Fanbase>('/fanbases', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { name: string }) =>
    apiFetch<Fanbase>(`/fanbases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/fanbases/${id}`, { method: 'DELETE' }),
}

export const donorsApi = {
  list: () => apiFetch<Donor[]>('/donors'),
  create: (data: { name: string }) => apiFetch<Donor>('/donors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { name: string }) =>
    apiFetch<Donor>(`/donors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/donors/${id}`, { method: 'DELETE' }),
}

export const guestsApi = {
  list: (eventId: string) => apiFetch<Guest[]>(`/events/${eventId}/guests`),
  create: (eventId: string, data: Partial<Guest>) =>
    apiFetch<Guest>(`/events/${eventId}/guests`, { method: 'POST', body: JSON.stringify(data) }),
  bulkCreate: (eventId: string, guests: Partial<Guest>[]) =>
    apiFetch<Guest[]>(`/events/${eventId}/guests/bulk`, { method: 'POST', body: JSON.stringify({ guests }) }),
  delete: (id: string) => apiFetch(`/guests/${id}`, { method: 'DELETE' }),
}

export const attendanceApi = {
  checkIn: (token: string) =>
    apiFetch<{ guest: Guest }>('/attendance/check-in', { method: 'POST', body: JSON.stringify({ token }) }),
  list: (eventId: string) => apiFetch<Guest[]>(`/attendance/events/${eventId}/attendance`),
  stats: (eventId: string) => apiFetch<AttendanceStats>(`/attendance/events/${eventId}/stats`),
}

export const publicApi = {
  getInvitation: (token: string) => apiFetch<InvitationData>(`/invite/${token}`),
}
