import { supabase } from '@/lib/supabase'

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
    guest_type: 'fanbase' | 'donor' | 'member' | 'guest' | 'general'
  }
}

const GUEST_SELECT = 'name, qr_code_token, guest_type, events(title, description, event_date, location)'

export async function getInvitationBySlug(identifier: string): Promise<InvitationData | null> {
  const { data: bySlug } = await supabase
    .from('guests')
    .select(GUEST_SELECT)
    .eq('slug', identifier)
    .maybeSingle()

  const guest =
    bySlug ??
    (
      await supabase
        .from('guests')
        .select(GUEST_SELECT)
        .eq('qr_code_token', identifier)
        .maybeSingle()
    ).data

  if (!guest) return null

  const event = guest.events as unknown as InvitationData['event']

  return {
    event: {
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
    },
    guest: {
      name: guest.name,
      qr_code_token: guest.qr_code_token,
      guest_type: guest.guest_type,
    },
  }
}
