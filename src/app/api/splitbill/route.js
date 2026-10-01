import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TABLE, validId, validData } from './validate'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, data, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return NextResponse.json({ error: 'Eroare la încărcare.' }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
  }

  const { id, data } = body || {}
  if (!validId(id) || !validData(data)) {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).insert({ id, data })

  if (error) {
    return NextResponse.json({ error: 'Eroare la salvare.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
