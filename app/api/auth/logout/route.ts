import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'

export async function POST() {
  const { session, unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  session.destroy()
  return NextResponse.json({ message: 'Logged out' })
}
