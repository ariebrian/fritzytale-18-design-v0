import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import { requireSession } from '@/lib/session'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  const { id: eventId } = await params

  try {
    const { guests } = await req.json()

    if (!guests || !Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json({ error: 'Guests array is required' }, { status: 400 })
    }

    const guestsToInsert = guests.map((guest: any) => ({
      event_id: eventId,
      name: guest.name,
      contact: guest.contact || null,
      guest_type: guest.guest_type,
      fanbase_id: guest.guest_type === 'fanbase' ? guest.fanbase_id : null,
      donor_id: guest.guest_type === 'donor' ? guest.donor_id : null,
      qr_code_token: uuidv4(),
    }))

    const { data, error } = await supabase.from('guests').insert(guestsToInsert).select()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating guests:', error)
    return NextResponse.json({ error: 'Failed to create guests' }, { status: 500 })
  }
}
