'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { SIGNS, SECTIONS, monthLabel, LEVEL, KIND_ICON } from '@/lib/horoscop'

const ENTRY_FIELDS = ['teaser', 'general', 'love', 'career', 'health', 'moms', 'lucky_days', 'lucky_color', 'lucky_number', 'tip']
const KINDS = [['retro', 'Retrograd'], ['moon', 'Lună nouă / plină'], ['eclipse', 'Eclipsă'], ['aspect', 'Aspect'], ['ingress', 'Intrare în zodie'], ['shadow', 'Umbră']]

function nextMonth(m) {
  const [y, mm] = m.split('-').map(Number)
  const d = new Date(y, mm, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function HoroscopAdmin() {
  const supabase = createClient()
  const { user, loading } = useAuth() || {}
  const [isAdmin, setIsAdmin] = useState(null)
  const [isSiteAdmin, setIsSiteAdmin] = useState(false)
  const [months, setMonths] = useState([])
  const [cur, setCur] = useState(null)
  const [monthDraft, setMonthDraft] = useState(null)
  const [entries, setEntries] = useState({})
  const [sign, setSign] = useState('berbec')
  const [draft, setDraft] = useState(null)
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  const [admins, setAdmins] = useState([])
  const [newAdmin, setNewAdmin] = useState('')

  const flash = (text, err = false) => { setMsg({ text, err }); setTimeout(() => setMsg(null), 3500) }

  useEffect(() => {
    if (!supabase || !user) { setIsAdmin(user ? null : false); return }
    supabase.rpc('is_horoscope_admin').then(({ data }) => setIsAdmin(!!data))
    setIsSiteAdmin(user?.app_metadata?.role === 'admin')
  }, [user])

  async function loadMonths(select) {
    const { data } = await supabase.from('horoscope_months').select('*').order('month', { ascending: false })
    setMonths(data || [])
    const pick = (data || []).find(m => m.month === (select || cur)) || data?.[0]
    if (pick) openMonth(pick)
  }

  async function openMonth(m) {
    setCur(m.month)
    setMonthDraft({ ...m, watchouts: m.watchouts || [], sourcesText: (m.sources || []).map(s => `${s.name} | ${s.url}`).join('\n') })
    const { data } = await supabase.from('horoscope_entries').select('*').eq('month', m.month)
    const map = Object.fromEntries((data || []).map(e => [e.sign, e]))
    setEntries(map)
    setDraft(map[sign] ? { ...map[sign] } : { month: m.month, sign, status: 'draft' })
  }

  useEffect(() => { if (isAdmin) { loadMonths(); if (isSiteAdmin) loadAdmins() } }, [isAdmin])
  useEffect(() => { if (cur) setDraft(entries[sign] ? { ...entries[sign] } : { month: cur, sign, status: 'draft' }) }, [sign])

  async function loadAdmins() {
    const { data } = await supabase.from('horoscope_admins').select('*').order('added_at')
    setAdmins(data || [])
  }

  async function login(e) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email: e.target.email.value, password: e.target.password.value })
    if (error) flash('Email sau parolă incorectă.', true)
  }

  async function saveEntry(status) {
    setBusy(true)
    const row = { month: cur, sign, status: status || draft.status || 'draft', updated_at: new Date().toISOString(), updated_by: user.email }
    ENTRY_FIELDS.forEach(f => { row[f] = draft[f] ?? null })
    const { data, error } = await supabase.from('horoscope_entries').upsert(row).select().single()
    setBusy(false)
    if (error) return flash('Nu s-a putut salva: ' + error.message, true)
    setEntries(e => ({ ...e, [sign]: data })); setDraft({ ...data })
    flash(status === 'approved' ? `${SIGNS.find(s => s.slug === sign).name}: aprobat ✓` : 'Salvat ✓')
    if (status === 'approved') {
      const idx = SIGNS.findIndex(s => s.slug === sign)
      const nextPending = [...SIGNS.slice(idx + 1), ...SIGNS.slice(0, idx)].find(s => (entries[s.slug]?.status || 'draft') !== 'approved')
      if (nextPending) setSign(nextPending.slug)
    }
  }

  async function saveMonth(extra = {}) {
    setBusy(true)
    const sources = (monthDraft.sourcesText || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const [name, url] = l.split('|').map(x => x.trim()); return url ? { name, url } : { name: l, url: l }
    })
    const row = { month: cur, title: monthDraft.title, intro: monthDraft.intro, watchouts: monthDraft.watchouts, sources, updated_at: new Date().toISOString(), updated_by: user.email, ...extra }
    const { error } = await supabase.from('horoscope_months').update(row).eq('month', cur)
    setBusy(false)
    if (error) return flash('Nu s-a putut salva luna: ' + error.message, true)
    flash(extra.status === 'published' ? 'Luna e publicată! ✨' : extra.status === 'draft' ? 'Publicarea a fost retrasă.' : 'Luna a fost salvată ✓')
    loadMonths(cur)
  }

  async function publish() {
    const missing = SIGNS.filter(s => (entries[s.slug]?.status || 'draft') !== 'approved')
    if (missing.length && !window.confirm(`Mai sunt neaprobate: ${missing.map(s => s.name).join(', ')}.\nPublici oricum?`)) return
    await saveMonth({ status: 'published', published_at: new Date().toISOString() })
  }

  async function createMonth() {
    const m = months[0] ? nextMonth(months[0].month) : new Date().toISOString().slice(0, 7)
    const v = window.prompt('Ce lună adaugi? (format AAAA-LL)', m)
    if (!v || !/^\d{4}-\d{2}$/.test(v)) return
    const { error } = await supabase.from('horoscope_months').insert({ month: v, status: 'draft', updated_by: user.email })
    if (error) return flash('Nu s-a putut crea luna: ' + error.message, true)
    loadMonths(v)
  }

  function setW(i, k, v) { setMonthDraft(d => ({ ...d, watchouts: d.watchouts.map((w, j) => j === i ? { ...w, [k]: v } : w) })) }

  async function addAdmin() {
    const email = newAdmin.trim().toLowerCase()
    if (!email.includes('@')) return flash('Scrie un e-mail valid.', true)
    const { error } = await supabase.from('horoscope_admins').insert({ email })
    if (error) return flash(error.message, true)
    setNewAdmin(''); loadAdmins(); flash('Admin adăugat ✓')
  }
  async function removeAdmin(email) {
    if (!window.confirm(`Scoți ${email} din adminii horoscopului?`)) return
    await supabase.from('horoscope_admins').delete().eq('email', email); loadAdmins()
  }

  const approvedCount = useMemo(() => SIGNS.filter(s => entries[s.slug]?.status === 'approved').length, [entries])

  if (loading || (user && isAdmin === null)) return <div className="hza"><p className="hza-sub">Se încarcă…</p></div>

  if (!user) return (
    <div className="hza" style={{ maxWidth: 420 }}>
      <h1>Admin horoscop</h1>
      <p className="hza-sub">Intră cu contul tău Moms4Moms.</p>
      {msg && <div className={`hza-msg ${msg.err ? 'err' : ''}`}>{msg.text}</div>}
      <form className="hza-box" onSubmit={login}>
        <label>E-mail</label><input name="email" type="email" required autoComplete="email" />
        <label>Parolă</label><input name="password" type="password" required autoComplete="current-password" />
        <div className="hza-row" style={{ marginTop: 14 }}>
          <button className="hza-btn gold" type="submit">Intră</button>
          <button className="hza-btn" type="button" onClick={() => window.dispatchEvent(new CustomEvent('openAuth'))}>Altă metodă (Google, Facebook)</button>
        </div>
      </form>
    </div>
  )

  if (!isAdmin) return (
    <div className="hza" style={{ maxWidth: 520 }}>
      <h1>Admin horoscop</h1>
      <div className="hza-box">Contul <b>{user.email}</b> nu are acces la adminul horoscopului. Roag-o pe Adelina să te adauge.</div>
    </div>
  )

  const curMonth = months.find(m => m.month === cur)

  return (
    <div className="hza">
      <h1>Admin horoscop</h1>
      <p className="hza-sub">Verifică, editează și aprobă fiecare zodie, apoi publică luna. Până la publicare, vizitatorii văd luna precedentă.</p>
      {msg && <div className={`hza-msg ${msg.err ? 'err' : ''}`} style={{ position: 'sticky', top: 8, zIndex: 5 }}>{msg.text}</div>}

      <div className="hza-box hza-row">
        <select value={cur || ''} onChange={e => openMonth(months.find(m => m.month === e.target.value))} style={{ width: 'auto' }}>
          {months.map(m => <option key={m.month} value={m.month}>{monthLabel(m.month)} — {m.status === 'published' ? 'publicată' : 'ciornă'}</option>)}
        </select>
        <button className="hza-btn" onClick={createMonth}>+ Lună nouă</button>
        {curMonth && <>
          <span className={`hza-pill ${curMonth.status}`} style={{ marginLeft: 0 }}>{curMonth.status === 'published' ? 'PUBLICATĂ' : 'CIORNĂ'}</span>
          <div className="hza-progress" title={`${approvedCount}/12 aprobate`}><span style={{ width: `${approvedCount / 12 * 100}%` }} /></div>
          <span>{approvedCount}/12 aprobate</span>
          <Link className="hza-btn" href={`/horoscop?luna=${cur}&preview=1`} target="_blank">Previzualizează ↗</Link>
          {curMonth.status === 'published'
            ? <button className="hza-btn danger" disabled={busy} onClick={() => saveMonth({ status: 'draft' })}>Retrage publicarea</button>
            : <button className="hza-btn gold" disabled={busy} onClick={publish}>Publică luna ✨</button>}
        </>}
      </div>

      {monthDraft && <>
        <div className="hza-box">
          <h3 style={{ color: 'var(--gold)' }}>1. Zodiile</h3>
          <div className="hza-signs" style={{ marginTop: 10 }}>
            {SIGNS.map(s => {
              const st = entries[s.slug]?.status || (entries[s.slug] ? 'draft' : null)
              return (
                <button key={s.slug} className={`hza-sign ${sign === s.slug ? 'on' : ''}`} onClick={() => setSign(s.slug)}>
                  <span className="g">{s.glyph}</span>{s.name}
                  <span className={`hza-pill ${st || 'draft'}`}>{st === 'approved' ? '✓' : st ? 'ciornă' : 'gol'}</span>
                </button>
              )
            })}
          </div>

          {draft && <div style={{ marginTop: 10 }}>
            <label>Teaser (fraza de pe card)</label>
            <input value={draft.teaser || ''} onChange={e => setDraft({ ...draft, teaser: e.target.value })} />
            {SECTIONS.map(sec => (
              <div key={sec.key}>
                <label>{sec.icon} {sec.label}</label>
                <textarea value={draft[sec.key] || ''} onChange={e => setDraft({ ...draft, [sec.key]: e.target.value })} rows={sec.key === 'general' || sec.key === 'moms' ? 4 : 3} />
              </div>
            ))}
            <div className="hza-grid3">
              <div><label>Zile bune</label><input value={draft.lucky_days || ''} onChange={e => setDraft({ ...draft, lucky_days: e.target.value })} /></div>
              <div><label>Culoarea lunii</label><input value={draft.lucky_color || ''} onChange={e => setDraft({ ...draft, lucky_color: e.target.value })} /></div>
              <div><label>Cifra norocoasă</label><input value={draft.lucky_number || ''} onChange={e => setDraft({ ...draft, lucky_number: e.target.value })} /></div>
            </div>
            <label>Sfatul lunii</label>
            <input value={draft.tip || ''} onChange={e => setDraft({ ...draft, tip: e.target.value })} />
            <div className="hza-row" style={{ marginTop: 14 }}>
              <button className="hza-btn" disabled={busy} onClick={() => saveEntry()}>Salvează</button>
              <button className="hza-btn green" disabled={busy} onClick={() => saveEntry('approved')}>Salvează și aprobă ✓</button>
              {draft.status === 'approved' && <button className="hza-btn" disabled={busy} onClick={() => saveEntry('draft')}>Înapoi la ciornă</button>}
              <Link className="hza-btn" href={`/horoscop/${sign}?luna=${cur}&preview=1`} target="_blank">Vezi pagina ↗</Link>
              {draft.updated_by && <span style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Ultima modificare: {draft.updated_by}, {new Date(draft.updated_at).toLocaleString('ro-RO')}</span>}
            </div>
          </div>}
        </div>

        <div className="hza-box">
          <h3 style={{ color: 'var(--gold)' }}>2. Luna în general</h3>
          <label>Titlul lunii</label>
          <input value={monthDraft.title || ''} onChange={e => setMonthDraft({ ...monthDraft, title: e.target.value })} />
          <label>Energia lunii (textul de sus)</label>
          <textarea value={monthDraft.intro || ''} onChange={e => setMonthDraft({ ...monthDraft, intro: e.target.value })} rows={4} />

          <label style={{ marginTop: 18 }}>Atenție pentru toți — perioade</label>
          {monthDraft.watchouts.map((w, i) => (
            <div key={i} className="hza-watch">
              <div className="hza-watch-head">
                <div><label>Titlu</label><input value={w.title || ''} onChange={e => setW(i, 'title', e.target.value)} /></div>
                <div><label>De la</label><input type="date" value={w.start || ''} onChange={e => setW(i, 'start', e.target.value)} /></div>
                <div><label>Până la</label><input type="date" value={w.end || ''} onChange={e => setW(i, 'end', e.target.value)} /></div>
                <div><label>Tip</label><select value={w.kind || 'aspect'} onChange={e => setW(i, 'kind', e.target.value)}>{KINDS.map(([k, n]) => <option key={k} value={k}>{KIND_ICON[k]} {n}</option>)}</select></div>
                <div><label>Ton</label><select value={w.level || 'info'} onChange={e => setW(i, 'level', e.target.value)}>{Object.entries(LEVEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                <button className="hza-btn danger" onClick={() => setMonthDraft(d => ({ ...d, watchouts: d.watchouts.filter((_, j) => j !== i) }))} aria-label="Șterge">✕</button>
              </div>
              <label>Ce înseamnă</label>
              <textarea rows={2} value={w.text || ''} onChange={e => setW(i, 'text', e.target.value)} />
            </div>
          ))}
          <div className="hza-row" style={{ marginTop: 10 }}>
            <button className="hza-btn" onClick={() => setMonthDraft(d => ({ ...d, watchouts: [...d.watchouts, { title: '', start: `${cur}-01`, end: `${cur}-01`, kind: 'aspect', level: 'info', text: '' }] }))}>+ Adaugă perioadă</button>
          </div>

          <label style={{ marginTop: 18 }}>Surse folosite (câte una pe rând: nume | link)</label>
          <textarea rows={4} value={monthDraft.sourcesText || ''} onChange={e => setMonthDraft({ ...monthDraft, sourcesText: e.target.value })} />
          <div className="hza-sources" style={{ marginTop: 6, fontSize: 13 }}>
            {(curMonth?.sources || []).map((s, i) => <div key={i}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗</a></div>)}
          </div>
          <div className="hza-row" style={{ marginTop: 14 }}>
            <button className="hza-btn gold" disabled={busy} onClick={() => saveMonth()}>Salvează luna</button>
          </div>
        </div>
      </>}

      {isSiteAdmin && (
        <div className="hza-box">
          <h3 style={{ color: 'var(--gold)' }}>3. Cine mai are acces</h3>
          <p className="hza-sub" style={{ marginBottom: 8 }}>Persoana trebuie să aibă cont pe moms4moms.ro cu acest e-mail.</p>
          {admins.map(a => (
            <div key={a.email} className="hza-row" style={{ marginBottom: 6 }}><span>{a.email}</span><button className="hza-btn danger" onClick={() => removeAdmin(a.email)}>Scoate</button></div>
          ))}
          <div className="hza-row"><input style={{ maxWidth: 320 }} placeholder="prietena@gmail.com" value={newAdmin} onChange={e => setNewAdmin(e.target.value)} /><button className="hza-btn" onClick={addAdmin}>Adaugă</button></div>
        </div>
      )}
    </div>
  )
}
