// Secret Santa — API (moms4moms.ro/secretsanta). Port al api.php.
// Datele stau într-un singur rând JSON în Supabase (secretsanta_store), accesibil doar
// de pe server cu cheia service role. Scrierile folosesc blocare optimistă (coloana version).
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { handle, emptyData, Fail } from './logic'

export const dynamic = 'force-dynamic'

const STORE = 'secretsanta_store'
const BACKUP = 'secretsanta_backups'
const ROW = 'main'
const BACKUPS = 30

const json = (data, status = 200) =>
  NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } })

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

async function load(sb) {
  const { data, error } = await sb.from(STORE).select('data, version').eq('id', ROW).maybeSingle()
  if (error) throw new Fail('Eroare la încărcarea datelor.', 500)
  if (!data) {
    const { error: e2 } = await sb.from(STORE).insert({ id: ROW, data: emptyData(), version: 0 })
    if (e2 && e2.code !== '23505') throw new Fail('Eroare la inițializarea datelor.', 500)
    return load(sb)
  }
  return { d: data.data && typeof data.data === 'object' ? data.data : emptyData(), version: data.version }
}

async function backup(sb, d) {
  await sb.from(BACKUP).insert({ data: d })
  const { data: old } = await sb.from(BACKUP).select('id').order('id', { ascending: false }).range(BACKUPS, BACKUPS)
  if (old && old[0]) await sb.from(BACKUP).delete().lte('id', old[0].id)
}

async function run(a, inp, tok) {
  if (a === 'ping') {
    const sb = db()
    let writable = false
    if (sb) { try { await load(sb); writable = true } catch {} }
    return json({ ok: true, runtime: 'next', writable })
  }
  const sb = db()
  if (!sb) return json({ ok: false, error: 'Serverul nu e configurat încă.' }, 500)

  for (let attempt = 0; attempt < 6; attempt++) {
    const { d, version } = await load(sb)
    const { res, save } = handle(a, inp, tok, d)
    if (!save) return json(res)
    const { data: upd, error } = await sb.from(STORE)
      .update({ data: d, version: version + 1, updated_at: new Date().toISOString() })
      .eq('id', ROW).eq('version', version).select('id')
    if (error) throw new Fail('Eroare la salvare.', 500)
    if (upd && upd.length) {
      if (a !== 'me') { try { await backup(sb, d) } catch {} }
      return json(res)
    }
    await new Promise(r => setTimeout(r, 40 + Math.random() * 120)) // conflict → reîncearcă
  }
  throw new Fail('Serverul e ocupat, încearcă din nou.', 503)
}

async function respond(a, inp, tok) {
  try {
    return await run(a, inp, tok)
  } catch (e) {
    if (e instanceof Fail) return json({ ok: false, error: e.message }, e.code)
    console.error('secretsanta', e)
    return json({ ok: false, error: 'Eroare de server.' }, 500)
  }
}

export async function GET(request) {
  const sp = new URL(request.url).searchParams
  return respond(sp.get('a') || '', {}, sp.get('t') || '')
}

export async function POST(request) {
  const sp = new URL(request.url).searchParams
  let inp = {}
  try { inp = (await request.json()) || {} } catch {}
  if (typeof inp !== 'object' || Array.isArray(inp)) inp = {}
  const tok = String(inp.t ?? sp.get('t') ?? '')
  return respond(sp.get('a') || '', inp, tok)
}
