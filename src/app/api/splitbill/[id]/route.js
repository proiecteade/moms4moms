import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TABLE, validId, validData, validPoza } from '../validate'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const { id } = await params
  if (!validId(id)) {
    return NextResponse.json({ error: 'Negăsit.' }, { status: 404 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, data, poza')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Eroare la încărcare.' }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Negăsit.' }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function PUT(request, { params }) {
  const { id } = await params
  if (!validId(id)) {
    return NextResponse.json({ error: 'Negăsit.' }, { status: 404 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
  }

  const changes = { updated_at: new Date().toISOString() }
  if ('data' in body) {
    if (!validData(body.data)) return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
    changes.data = body.data
  }
  if ('poza' in body) {
    if (!validPoza(body.poza)) return NextResponse.json({ error: 'Poză invalidă.' }, { status: 400 })
    changes.poza = body.poza
  }

  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).update(changes).eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Eroare la salvare.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(request, { params }) {
  const { id } = await params
  if (!validId(id)) {
    return NextResponse.json({ error: 'Negăsit.' }, { status: 404 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Eroare la ștergere.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
