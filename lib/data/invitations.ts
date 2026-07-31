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
    guest_type: 'fanbase' | 'donor' | 'member' | 'guest'
  }
}

export async function getInvitationByToken(token: string): Promise<InvitationData | null> {
  const { data: guest, error } = await supabase
    .from('guests')
    .select('name, qr_code_token, guest_type, events(title, description, event_date, location)')
    .eq('qr_code_token', token)
    .single()

  if (error || !guest) return null

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
