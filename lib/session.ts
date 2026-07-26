import { cookies } from 'next/headers'
import { getIronSession, type SessionOptions } from 'iron-session'
import { NextResponse } from 'next/server'

export interface SessionUser {
  id: string
  username: string
  display_name: string | null
  created_at: string
}

export interface SessionData {
  user?: SessionUser
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'ff.sid',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}

export async function requireSession() {
  const session = await getSession()
  if (!session.user) {
    return { session: null, unauthorized: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { session, unauthorized: null }
}
