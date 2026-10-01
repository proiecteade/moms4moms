import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TABLE, validId, validData, validPoza, cleanOps, applyOp } from '../validate'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const { id } = await params
  if (!validId(id)) {
    return NextResponse.json({ error: 'Negăsit.' }, { status: 404 })
  }

  const noPoza = new URL(request.url).searchParams.has('nopoza')
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select(noPoza ? 'id, data' : 'id, data, poza')
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

  if ('data' in body) {
    return NextResponse.json({ error: 'Pagina e veche. Dă refresh.' }, { status: 409 })
  }
  const changes = { updated_at: new Date().toISOString() }
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

// Aplică doar modificările trimise, peste versiunea curentă (fără să suprascrie ce au salvat alții)
export async function PATCH(request, { params }) {
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
  const ops = cleanOps(body?.ops)
  if (!ops) {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
  }

  const supabase = await createClient()
  for (let attempt = 0; attempt < 6; attempt++) {
    const { data: row, error: readError } = await supabase
      .from(TABLE)
      .select('data, updated_at')
      .eq('id', id)
      .maybeSingle()
    if (readError) {
      return NextResponse.json({ error: 'Eroare la salvare.' }, { status: 500 })
    }
    if (!row) {
      return NextResponse.json({ error: 'Negăsit.' }, { status: 404 })
    }

    const data = structuredClone(row.data || {})
    ops.forEach(op => applyOp(data, op))
    if (!validData(data)) {
      return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
    }

    // Scrie doar dacă nimeni n-a salvat între timp; altfel reia cu versiunea nouă
    const { data: updated, error } = await supabase
      .from(TABLE)
      .update({ data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('updated_at', row.updated_at)
      .select('id')
    if (error) {
      return NextResponse.json({ error: 'Eroare la salvare.' }, { status: 500 })
    }
    if (updated?.length) {
      return NextResponse.json({ ok: true, data })
    }
  }
  return NextResponse.json({ error: 'Prea multe modificări simultane.' }, { status: 409 })
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
