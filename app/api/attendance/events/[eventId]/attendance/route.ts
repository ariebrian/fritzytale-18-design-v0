import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSession } from '@/lib/session'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  const { eventId } = await params

  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*, fanbases(name), donors(name)')
      .eq('event_id', eventId)
      .order('checked_in_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}
