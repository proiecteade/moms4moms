import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
  }

  const { doctor_id, reviewer, text, rating, date } = body

  if (!doctor_id || !rating) {
    return NextResponse.json({ error: 'Câmpuri obligatorii lipsă.' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase.from('reviews').insert({
    doctor_id,
    reviewer: reviewer || 'Anonim',
    text: text || null,
    rating,
    date,
    status: 'pending',
  })

  if (error) {
    return NextResponse.json({ error: 'Eroare la salvare.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
