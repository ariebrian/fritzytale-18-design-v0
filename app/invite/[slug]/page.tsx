import { notFound } from 'next/navigation'
import { Invitation } from '@/components/invitation'
import { getInvitationBySlug } from '@/lib/data/invitations'

export default async function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const invitation = await getInvitationBySlug(slug)

  if (!invitation) notFound()

  return <Invitation event={invitation.event} guest={invitation.guest} />
}
