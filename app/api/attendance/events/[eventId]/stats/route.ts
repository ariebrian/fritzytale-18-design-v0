import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSession } from '@/lib/session'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  const { eventId } = await params

  try {
    const { data: guests, error } = await supabase
      .from('guests')
      .select('guest_type, checked_in')
      .eq('event_id', eventId)

    if (error) throw error

    const total = guests.length
    const checkedIn = guests.filter((g) => g.checked_in).length
    const byType = guests.reduce((acc: Record<string, number>, g) => {
      acc[g.guest_type] = (acc[g.guest_type] || 0) + 1
      return acc
    }, {})

    const checkedInByType = guests
      .filter((g) => g.checked_in)
      .reduce((acc: Record<string, number>, g) => {
        acc[g.guest_type] = (acc[g.guest_type] || 0) + 1
        return acc
      }, {})

    return NextResponse.json({
      total,
      checkedIn,
      notCheckedIn: total - checkedIn,
      byType,
      checkedInByType,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
