import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
  }

  const { restaurant, review } = body

  if (!restaurant?.name?.trim() || !restaurant?.tip?.trim() || !restaurant?.city?.trim()) {
    return NextResponse.json({ error: 'Câmpuri obligatorii lipsă (nume, tip, localitate).' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error: restError } = await supabase.from('restaurants').insert({
    ...restaurant,
    status: 'pending',
  })

  if (restError) {
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
