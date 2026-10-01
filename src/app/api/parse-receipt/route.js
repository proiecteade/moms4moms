import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_BASE64_LENGTH = 7_000_000 // ~5MB image

const PROMPT = `Aceasta este poza unui bon de restaurant din România.
Extrage toate produsele cu cantitatea și prețul pe bucată (în lei).
Ignoră liniile de TVA, subtotal, bacșiș și metodele de plată.
Răspunde DOAR cu JSON valid, fără alt text, în formatul:
{"items":[{"produs":"Carbonara","qty":1,"pret":45.5}],"totalBon":123.5}
Dacă nu găsești totalul, pune "totalBon": null.`

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI indisponibil' }, { status: 503 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă' }, { status: 400 })
  }

  const { imageBase64, mimeType } = body || {}
  if (typeof imageBase64 !== 'string' || !imageBase64 || imageBase64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json({ error: 'Imagine invalidă' }, { status: 400 })
  }
  const mediaType = ALLOWED_TYPES.includes(mimeType) ? mimeType : 'image/jpeg'

  const client = new Anthropic()

  try {
    const response = await client.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      output_config: { effort: 'low' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
    })

    if (response.stop_reason === 'refusal') {
      return NextResponse.json({ items: [], totalBon: null })
    }

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
    const match = text.match(/\{[\s\S]*\}/)
    const parsed = match ? JSON.parse(match[0]) : { items: [] }

    const items = (Array.isArray(parsed.items) ? parsed.items : [])
      .map(i => ({
        produs: String(i.produs || '').slice(0, 120),
        qty: Number(i.qty) || 1,
        pret: Number(i.pret) || 0,
      }))
      .filter(i => i.produs)

    return NextResponse.json({
      items,
      totalBon: Number(parsed.totalBon) || null,
    })
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'Prea multe cereri' }, { status: 429 })
    }
    console.error('parse-receipt error:', error)
    return NextResponse.json({ error: 'Nu am putut citi bonul' }, { status: 500 })
  }
}
