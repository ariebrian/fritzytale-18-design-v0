import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { session, unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*, events(id)')
      .eq('qr_code_token', token)
      .single()

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 404 })
    }

    // Member/guest QR codes are reusable — always report success without
    // enforcing single-use or recording an attendance log.
    const isRepeatable = guest.guest_type === 'member' || guest.guest_type === 'guest'

    if (isRepeatable) {
      return NextResponse.json({ message: 'Checked in successfully', guest })
    }

    if (guest.checked_in) {
      return NextResponse.json({ error: 'Guest already checked in', guest }, { status: 400 })
    }

    const now = new Date().toISOString()

    const { error: updateError } = await supabase
      .from('guests')
      .update({
        checked_in: true,
        checked_in_at: now,
      })
      .eq('id', guest.id)

    if (updateError) throw updateError

    const forwardedFor = req.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : null

    const { error: logError } = await supabase.from('attendance_logs').insert({
      guest_id: guest.id,
      event_id: guest.event_id,
      checked_in_by: session!.user!.id,
      ip_address: ipAddress,
      user_agent: req.headers.get('user-agent'),
    })

    if (logError) throw logError

    return NextResponse.json({ message: 'Checked in successfully', guest: { ...guest, checked_in: true, checked_in_at: now } })
  } catch (error) {
    console.error('Error checking in:', error)
    return NextResponse.json({ error: 'Failed to check in' }, { status: 500 })
  }
}
