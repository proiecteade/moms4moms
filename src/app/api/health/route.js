import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const status = { status: 'ok', timestamp: new Date().toISOString() }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { error } = await supabase.from('doctors').select('id').limit(1)
    status.db = error ? 'error' : 'ok'
  } catch {
    status.db = 'error'
  }

  const httpStatus = status.db === 'error' ? 503 : 200
  return Response.json(status, { status: httpStatus })
}
