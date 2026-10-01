import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const TABLE = 'splitbill_people'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('name')
    .order('name', { ascending: true })
    .limit(500)

  if (error) {
    return NextResponse.json({ error: 'Eroare la încărcare.' }, { status: 500 })
  }
  return NextResponse.json(data.map(r => r.name))
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
  }

  const name = typeof body?.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : ''
  if (!name || name.length > 60) {
    return NextResponse.json({ error: 'Nume invalid.' }, { status: 400 })
  }

  const supabase = await createClient()

  // Avoid case-only duplicates ("ana" vs "Ana")
  const { data: existing } = await supabase
    .from(TABLE)
    .select('name')
    .ilike('name', name.replace(/[%_\\]/g, '\\$&'))
    .limit(1)
  if (existing?.length) {
    return NextResponse.json({ ok: true, name: existing[0].name })
  }

  const { error } = await supabase.from(TABLE).insert({ name })
  if (error && error.code !== '23505') {
    return NextResponse.json({ error: 'Eroare la salvare.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, name })
}
