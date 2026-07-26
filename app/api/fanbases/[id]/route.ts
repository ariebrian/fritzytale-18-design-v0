import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSession } from '@/lib/session'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  const { id } = await params

  try {
    const { name } = await req.json()
    const { data, error } = await supabase
      .from('fanbases')
      .update({ name })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating fanbase:', error)
    return NextResponse.json({ error: 'Failed to update fanbase' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireSession()
  if (unauthorized) return unauthorized

  const { id } = await params

  try {
    const { error } = await supabase.from('fanbases').delete().eq('id', id)

    if (error) throw error
    return NextResponse.json({ message: 'Fanbase deleted' })
  } catch (error) {
    console.error('Error deleting fanbase:', error)
    return NextResponse.json({ error: 'Failed to delete fanbase' }, { status: 500 })
  }
}
