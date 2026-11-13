import { createClient } from '@/lib/supabase/server'

// Luna cerută (sau cea mai nouă publicată). Cu preview=true, un admin logat vede și ciornele (RLS decide).
export async function loadMonth({ month, preview } = {}) {
  const supabase = await createClient()
  let q = supabase.from('horoscope_months').select('*')
  if (month) q = q.eq('month', month)
  if (!preview) q = q.eq('status', 'published')
  const { data: rows } = await q.order('month', { ascending: false }).limit(1)
  const m = rows?.[0] || null
  if (!m) return { month: null, entries: [] }
  const { data: entries } = await supabase.from('horoscope_entries').select('*').eq('month', m.month)
  return { month: m, entries: entries || [] }
}

export async function listPublishedMonths() {
  const supabase = await createClient()
  const { data } = await supabase.from('horoscope_months').select('month, title').eq('status', 'published').order('month', { ascending: false })
  return data || []
}
