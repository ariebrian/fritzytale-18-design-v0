import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/session'

export async function GET() {
  const { session, unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  return NextResponse.json({ user: session.user })
}
