import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// In-memory rate limiter: IP → list of timestamps
const rateLimitMap = new Map()
const WINDOW_MS = 60 * 60 * 1000 // 1 oră
const MAX_REQUESTS = 5

function isRateLimited(ip) {
  const now = Date.now()
  const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < WINDOW_MS)
  if (timestamps.length >= MAX_REQUESTS) return true
  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)
  return false
}

export async function POST(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Prea multe cereri. Încearcă din nou mai târziu.' },
      { status: 429 }
    )
  }

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
