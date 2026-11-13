'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { computeChart } from '@/lib/astroCalc'
import { SIGN_BY_SLUG } from '@/lib/horoscop'

const REL = { eu: 'Eu', copil: 'Copil', partener: 'Partener' }
const blank = (relation) => ({ key: Math.random().toString(36).slice(2), relation, name: '', birth_date: '', birth_time: '', noTime: false, place_name: '', lat: null, lon: null, tz: 'Europe/Bucharest' })

function PlaceSearch({ value, onPick }) {
  const [q, setQ] = useState(value || '')
  const [res, setRes] = useState([])
  const [open, setOpen] = useState(false)
  const t = useRef(null)
  useEffect(() => { setQ(value || '') }, [value])
  function search(v) {
    setQ(v); clearTimeout(t.current)
    if (v.trim().length < 2) { setRes([]); return }
    t.current = setTimeout(async () => {
      try {
        const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(v.trim())}&count=7&language=ro&format=json`)
        const j = await r.json()
        setRes(j.results || []); setOpen(true)
      } catch { setRes([]) }
    }, 300)
  }
  return (
    <div className="hzp-place">
      <input value={q} onChange={e => search(e.target.value)} onFocus={() => res.length && setOpen(true)} placeholder="ex. București, Iași, Chișinău" autoComplete="off" />
      {open && res.length > 0 && (
        <ul className="hzp-place-list">
          {res.map(p => (
            <li key={p.id}><button type="button" onClick={() => {
              const label = [p.name, p.admin1, p.country_code !== 'RO' ? p.country : null].filter(Boolean).join(', ')
              onPick({ place_name: label, lat: p.latitude, lon: p.longitude, tz: p.timezone || 'Europe/Bucharest' }); setQ(label); setOpen(false)
            }}>{p.name}<span>{[p.admin1, p.country].filter(Boolean).join(', ')}</span></button></li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ChartBadge({ p }) {
  const c = computeChart({ ...p, birth_time: p.noTime ? null : p.birth_time })
  if (!c.sun_sign) return null
  const s = SIGN_BY_SLUG[c.sun_sign], a = c.asc_sign && SIGN_BY_SLUG[c.asc_sign], m = c.moon_sign && SIGN_BY_SLUG[c.moon_sign]
  return (
    <div className="hzp-badge">
      <span>☉ Zodia: <b>{s.glyph} {s.name}</b></span>
      <span>↑ Ascendent: <b>{a ? `${a.glyph} ${a.name}` : (p.noTime || !p.birth_time ? 'ai nevoie de oră' : 'alege localitatea')}</b></span>
      {m && <span>☽ Luna: <b>{m.glyph} {m.name}</b></span>}
    </div>
  )
}

export default function ProfileEditor({ initial = [], userName = '', onDone }) {
  const router = useRouter()
  const supabase = createClient()
  const [people, setPeople] = useState(() => {
    if (initial.length) return initial.map(p => ({ ...p, key: p.id, birth_time: p.birth_time ? p.birth_time.slice(0, 5) : '', noTime: !p.birth_time }))
    return [{ ...blank('eu'), name: userName }]
  })
  const [removed, setRemoved] = useState([])
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  const upd = (k, patch) => setPeople(ps => ps.map(p => p.key === k ? { ...p, ...patch } : p))

  async function save() {
    setErr('')
    for (const p of people) {
      if (!p.name.trim()) return setErr('Scrie numele fiecărei persoane.')
      if (!p.birth_date) return setErr(`Alege data nașterii pentru ${p.name}.`)
    }
    if (!people.some(p => p.relation === 'eu')) return setErr('Adaugă-te și pe tine („Eu”).')
    setSaving(true)
    try {
      if (removed.length) await supabase.from('horoscope_profiles').delete().in('id', removed)
      for (const [i, p] of people.entries()) {
        const time = p.noTime ? null : (p.birth_time || null)
        const c = computeChart({ birth_date: p.birth_date, birth_time: time, lat: p.lat, lon: p.lon, tz: p.tz })
        const row = { relation: p.relation, name: p.name.trim(), birth_date: p.birth_date, birth_time: time, place_name: p.place_name || null, lat: p.lat, lon: p.lon, tz: p.tz || 'Europe/Bucharest', ...c, sort: i, updated_at: new Date().toISOString() }
        const { error } = p.id
          ? await supabase.from('horoscope_profiles').update(row).eq('id', p.id)
          : await supabase.from('horoscope_profiles').insert(row)
        if (error) throw error
      }
      onDone?.()
      router.push('/horoscop')
      router.refresh()
    } catch (e) {
      setErr('Nu s-a putut salva. Încearcă din nou.')
    }
    setSaving(false)
  }

  return (
    <div className="hzp-editor">
      {people.map((p, i) => (
        <div key={p.key} className="hzp-person">
          <div className="hzp-person-head">
            <select value={p.relation} onChange={e => upd(p.key, { relation: e.target.value })} disabled={p.relation === 'eu' && people.filter(x => x.relation === 'eu').length === 1 && i === 0}>
              {Object.entries(REL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            {i > 0 && <button type="button" className="hzp-remove" onClick={() => { if (p.id) setRemoved(r => [...r, p.id]); setPeople(ps => ps.filter(x => x.key !== p.key)) }}>Șterge</button>}
          </div>
          <div className="hzp-fields">
            <label>Nume<input value={p.name} onChange={e => upd(p.key, { name: e.target.value })} placeholder={p.relation === 'copil' ? 'ex. Matei' : 'ex. Ana'} maxLength={60} /></label>
            <label>Data nașterii<input type="date" value={p.birth_date} onChange={e => upd(p.key, { birth_date: e.target.value })} max={new Date().toISOString().slice(0, 10)} /></label>
            <label>Ora nașterii
              <input type="time" value={p.noTime ? '' : p.birth_time} disabled={p.noTime} onChange={e => upd(p.key, { birth_time: e.target.value })} />
              <span className="hzp-check"><input type="checkbox" checked={p.noTime} onChange={e => upd(p.key, { noTime: e.target.checked })} /> nu știu ora</span>
            </label>
            <label>Localitatea nașterii<PlaceSearch value={p.place_name} onPick={(v) => upd(p.key, v)} /></label>
          </div>
          <ChartBadge p={p} />
        </div>
      ))}
      <div className="hzp-actions">
        <button type="button" className="hz-btn hz-btn-ghost" onClick={() => setPeople(ps => [...ps, blank('copil')])}>+ Copil</button>
        <button type="button" className="hz-btn hz-btn-ghost" onClick={() => setPeople(ps => [...ps, blank('partener')])}>+ Partener</button>
        <button type="button" className="hz-btn" disabled={saving} onClick={save}>{saving ? 'Se salvează…' : 'Salvează și vezi horoscopul ✦'}</button>
      </div>
      {err && <p className="hz-find-err" style={{ textAlign: 'center' }}>{err}</p>}
      {initial.length > 0 && (
        <p className="hzp-privacy"><button type="button" className="hzp-link-btn" onClick={async () => {
          if (!window.confirm('Ștergi toate datele de naștere salvate (ale tale și ale familiei)?')) return
          await supabase.from('horoscope_profiles').delete().in('id', initial.map(p => p.id))
          router.push('/horoscop'); router.refresh()
        }}>Șterge toate datele mele de horoscop</button></p>
      )}
      <p className="hzp-privacy">Datele le vezi doar tu, din contul tău. Le poți modifica sau șterge oricând. Ora și localitatea sunt necesare doar pentru ascendent.</p>
    </div>
  )
}
