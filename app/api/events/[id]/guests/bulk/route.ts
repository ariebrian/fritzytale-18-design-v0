import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import { requireSession } from '@/lib/session'
import { uniqueSlug } from '@/lib/slug'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  const { id: eventId } = await params

  try {
    const { guests } = await req.json()

    if (!guests || !Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json({ error: 'Guests array is required' }, { status: 400 })
    }

    const fanbaseIds = [...new Set(guests.filter((g: any) => g.guest_type === 'fanbase').map((g: any) => g.fanbase_id))]
    const donorIds = [...new Set(guests.filter((g: any) => g.guest_type === 'donor').map((g: any) => g.donor_id))]

    const [{ data: fanbaseRows }, { data: donorRows }, { data: existingSlugs }] = await Promise.all([
      fanbaseIds.length
        ? supabase.from('fanbases').select('id, name').in('id', fanbaseIds)
        : Promise.resolve({ data: [] as { id: string; name: string }[] }),
      donorIds.length
        ? supabase.from('donors').select('id, name').in('id', donorIds)
        : Promise.resolve({ data: [] as { id: string; name: string }[] }),
      supabase.from('guests').select('slug').not('slug', 'is', null),
    ])

    const fanbaseNameById = new Map((fanbaseRows ?? []).map((f) => [f.id, f.name]))
    const donorNameById = new Map((donorRows ?? []).map((d) => [d.id, d.name]))
    const taken = new Set((existingSlugs ?? []).map((g) => g.slug as string))

    const guestsToInsert = guests.map((guest: any) => {
      const slugBase =
        guest.guest_type === 'fanbase'
          ? fanbaseNameById.get(guest.fanbase_id) ?? guest.name
          : guest.guest_type === 'donor'
            ? donorNameById.get(guest.donor_id) ?? guest.name
            : guest.name

      return {
        event_id: eventId,
        name: guest.name,
        contact: guest.contact || null,
        guest_type: guest.guest_type,
        fanbase_id: guest.guest_type === 'fanbase' ? guest.fanbase_id : null,
        donor_id: guest.guest_type === 'donor' ? guest.donor_id : null,
        qr_code_token: uuidv4(),
        slug: uniqueSlug(slugBase, taken),
      }
    })

    const { data, error } = await supabase.from('guests').insert(guestsToInsert).select()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating guests:', error)
    return NextResponse.json({ error: 'Failed to create guests' }, { status: 500 })
  }
}
