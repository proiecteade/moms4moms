import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
  }

  const { doctor, review } = body

  if (!doctor?.first_name?.trim() || !doctor?.last_name?.trim() || !doctor?.city?.trim() || !doctor?.specs?.length) {
    return NextResponse.json({ error: 'Câmpuri obligatorii lipsă.' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error: docError } = await supabase.from('doctors').insert({
    ...doctor,
    status: 'pending',
  })

  if (docError) {
    return NextResponse.json({ error: 'Eroare la salvare.' }, { status: 500 })
  }

  if (review) {
    await supabase.from('reviews').insert({
      ...review,
      status: 'pending',
    })
  }

  return NextResponse.json({ ok: true })
}
