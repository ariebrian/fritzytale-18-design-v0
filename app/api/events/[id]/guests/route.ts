import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import { requireSession } from '@/lib/session'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  const { id: eventId } = await params

  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*, fanbases(name), donors(name)')
      .eq('event_id', eventId)
      .order('name')

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching guests:', error)
    return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  const { id: eventId } = await params

  try {
    const { name, contact, guest_type, fanbase_id, donor_id } = await req.json()

    if (!name || !guest_type) {
      return NextResponse.json({ error: 'Name and guest type are required' }, { status: 400 })
    }

    if (guest_type === 'fanbase' && !fanbase_id) {
      return NextResponse.json({ error: 'Fanbase ID is required for fanbase type' }, { status: 400 })
    }

    if (guest_type === 'donor' && !donor_id) {
      return NextResponse.json({ error: 'Donor ID is required for donor type' }, { status: 400 })
    }

    const qr_code_token = uuidv4()

    const { data, error } = await supabase
      .from('guests')
      .insert({
        event_id: eventId,
        name,
        contact,
        guest_type,
        fanbase_id: guest_type === 'fanbase' ? fanbase_id : null,
        donor_id: guest_type === 'donor' ? donor_id : null,
        qr_code_token,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating guest:', error)
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 })
  }
}
