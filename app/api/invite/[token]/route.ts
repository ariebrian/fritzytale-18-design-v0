import { NextRequest, NextResponse } from 'next/server'
import { getInvitationByToken } from '@/lib/data/invitations'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const invitation = await getInvitationByToken(token)

  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  }

  return NextResponse.json(invitation)
}
