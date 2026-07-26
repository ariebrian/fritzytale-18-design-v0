import { notFound } from 'next/navigation'
import { Invitation } from '@/components/invitation'
import { getInvitationByToken } from '@/lib/data/invitations'

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const invitation = await getInvitationByToken(token)

  if (!invitation) notFound()

  return <Invitation event={invitation.event} guest={invitation.guest} />
}
