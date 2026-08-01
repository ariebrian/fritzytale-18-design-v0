import { NextRequest, NextResponse } from 'next/server'
import { getInvitationBySlug } from '@/lib/data/invitations'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const invitation = await getInvitationBySlug(slug)

  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  }

  return NextResponse.json(invitation)
}
