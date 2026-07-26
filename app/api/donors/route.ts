import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSession } from '@/lib/session'

export async function GET() {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  try {
    const { data, error } = await supabase.from('donors').select('*').order('name')

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching donors:', error)
    return NextResponse.json({ error: 'Failed to fetch donors' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  try {
    const { name } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const { data, error } = await supabase.from('donors').insert({ name }).select().single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating donor:', error)
    return NextResponse.json({ error: 'Failed to create donor' }, { status: 500 })
  }
}
