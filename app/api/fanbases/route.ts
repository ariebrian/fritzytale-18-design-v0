import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSession } from '@/lib/session'

export async function GET() {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  try {
    const { data, error } = await supabase.from('fanbases').select('*').order('name')

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching fanbases:', error)
    return NextResponse.json({ error: 'Failed to fetch fanbases' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  try {
    const { name } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const { data, error } = await supabase.from('fanbases').insert({ name }).select().single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating fanbase:', error)
    return NextResponse.json({ error: 'Failed to create fanbase' }, { status: 500 })
  }
}
