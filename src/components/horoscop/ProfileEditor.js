'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { computeChart } from '@/lib/astroCalc'
import { SIGN_BY_SLUG } from '@/lib/horoscop'

const REL = { eu: 'Eu', copil: 'Copil', partener: 'Partener', altcineva: 'Alt membru (bunică, frate…)' }
const blank = (relation, gender = '') => ({ key: Math.random().toString(36).slice(2), relation, gender, name: '', birth_date: '', birth_time: '', noTime: false, place_name: '', lat: null, lon: null, tz: 'Europe/Bucharest' })

function PlaceSearch({ value, picked, onPick }) {
  const [q, setQ] = useState(value || '')
  const [res, setRes] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const t = useRef(null)
  const box = useRef(null)
  useEffect(() => { setQ(value || '') }, [value])

  // Se închide la atingere în afara listei (Safari nu are blur sigur pe butoane)
  useEffect(() => {
    if (!open) return
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('touchstart', close, { passive: true })
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('touchstart', close) }
  }, [open])

  // Pe telefon, adu lista în zona vizibilă (deasupra tastaturii)
  useEffect(() => {
    if (open && box.current && window.innerWidth < 760) box.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [open])

  function label(p) { return [p.name, p.admin1, p.country_code !== 'RO' ? p.country : null].filter(Boolean).join(', ') }
  function pick(p) {
    onPick({ place_name: label(p), lat: p.latitude, lon: p.longitude, tz: p.timezone || 'Europe/Bucharest' })
    setQ(label(p)); setOpen(false); setRes([])
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur()
  }
  function search(v) {
    setQ(v); clearTimeout(t.current)
    onPick({ place_name: v, lat: null, lon: null, tz: 'Europe/Bucharest' })
    if (v.trim().length < 2) { setRes([]); setOpen(false); return }
    t.current = setTimeout(async () => {
      setLoading(true)
      try {
        const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(v.trim())}&count=7&language=ro&format=json`)
        const j = await r.json()
        setRes(j.results || []); setOpen(true)
      } catch { setRes([]) }
      setLoading(false)
    }, 350)
  }
  return (
    <div className="hzp-place" ref={box}>
      <input value={q} onChange={e => search(e.target.value)} onFocus={() => res.length && setOpen(true)}
        onKeyDown={e => { if (e.key === 'Escape') setOpen(false); if (e.key === 'Enter' && res[0]) { e.preventDefault(); pick(res[0]) } }}
        placeholder="ex. București, Iași, Chișinău" autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="done" />
      {open && (
        <ul className="hzp-place-list" role="listbox">
          {res.length === 0 && <li className="hzp-place-empty">{loading ? 'Caut…' : 'Nu am găsit localitatea. Încearcă altă scriere.'}</li>}
          {res.map(p => (
            <li key={p.id}>
              <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => pick(p)}>
                {p.name}<span>{[p.admin1, p.country].filter(Boolean).join(', ')}</span>
              </button>
            </li>
          ))}
          <li><button type="button" className="hzp-place-close" onMouseDown={e => e.preventDefault()} onClick={() => setOpen(false)}>Închide lista ✕</button></li>
        </ul>
      )}
      {!open && q && !picked && q.trim().length >= 2 && <span className="hzp-place-hint">Alege localitatea din listă ca să calculăm ascendentul.</span>}
    </div>
  )
}

// Data în format zz/ll/aaaa (la fel pe toate telefoanele); intern rămâne AAAA-LL-ZZ
function isoToRo(iso) { if (!iso) return ''; const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}` }
function DateInput({ value, onChange }) {
  const [txt, setTxt] = useState(isoToRo(value))
  const [bad, setBad] = useState(false)
  useEffect(() => { if (value && isoToRo(value) !== txt) setTxt(isoToRo(value)) }, [value])
  function change(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 8)
    let t = digits
    if (digits.length > 4) t = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    else if (digits.length > 2) t = `${digits.slice(0, 2)}/${digits.slice(2)}`
    setTxt(t)
    if (digits.length === 8) {
      const d = +digits.slice(0, 2), m = +digits.slice(2, 4), y = +digits.slice(4)
      const dt = new Date(Date.UTC(y, m - 1, d))
      const ok = y > 1900 && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d && dt <= new Date()
      setBad(!ok)
      onChange(ok ? `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` : '')
    } else { setBad(false); onChange('') }
  }
  return (
    <>
      <input type="text" inputMode="numeric" placeholder="zz/ll/aaaa" value={txt} onChange={e => change(e.target.value)} maxLength={10} autoComplete="bday" />
      {bad && <span className="hz-find-err" style={{ fontSize: 14 }}>Data nu e validă.</span>}
    </>
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
    return [{ ...blank('eu', 'f'), name: userName }]
  })
  const [removed, setRemoved] = useState([])
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)
  const lock = useRef(false) // blochează a doua apăsare pe „Salvează” (dubla salvare dubla persoanele)

  const upd = (k, patch) => setPeople(ps => ps.map(p => p.key === k ? { ...p, ...patch } : p))

  async function save() {
    if (lock.current) return
    setErr('')
    for (const p of people) {
      if (!p.name.trim()) return setErr('Scrie numele fiecărei persoane.')
      if (!p.birth_date) return setErr(`Alege data nașterii pentru ${p.name}.`)
      if (!p.gender) return setErr(`Alege dacă ${p.name} e ${p.relation === 'copil' ? 'fată sau băiat' : 'femeie sau bărbat'}.`)
    }
    if (!people.some(p => p.relation === 'eu')) return setErr('Adaugă-te și pe tine („Eu”).')
    if (people.filter(p => p.relation === 'eu').length > 1) return setErr('Doar o persoană poate fi „Eu”. Pentru ceilalți alege Copil, Partener sau Alt membru.')
    lock.current = true
    setSaving(true)
    try {
      if (removed.length) await supabase.from('horoscope_profiles').delete().in('id', removed)
      for (const [i, p] of people.entries()) {
        const time = p.noTime ? null : (p.birth_time || null)
        const c = computeChart({ birth_date: p.birth_date, birth_time: time, lat: p.lat, lon: p.lon, tz: p.tz })
        const row = { relation: p.relation, gender: p.gender, name: p.name.trim(), birth_date: p.birth_date, birth_time: time, place_name: p.place_name || null, lat: p.lat, lon: p.lon, tz: p.tz || 'Europe/Bucharest', ...c, sort: i, updated_at: new Date().toISOString() }
        if (p.id) {
          const { error } = await supabase.from('horoscope_profiles').update(row).eq('id', p.id)
          if (error) throw error
        } else {
          const { data, error } = await supabase.from('horoscope_profiles').insert(row).select('id').single()
          if (error) throw error
          p.id = data.id
          setPeople(ps => ps.map(x => x.key === p.key ? { ...x, id: data.id } : x))
        }
      }
      onDone?.()
      router.push('/horoscop')
      router.refresh()
      return // butonul rămâne blocat până se schimbă pagina
    } catch (e) {
      setErr('Nu s-a putut salva. Încearcă din nou.')
    }
    lock.current = false
    setSaving(false)
  }

  return (
    <div className="hzp-editor">
      {people.map((p, i) => (
        <div key={p.key} className="hzp-person">
          <div className="hzp-person-head">
            <select value={p.relation} onChange={e => upd(p.key, { relation: e.target.value })} disabled={p.relation === 'eu' && people.filter(x => x.relation === 'eu').length === 1 && i === 0}>
              {Object.entries(REL).filter(([k]) => i === 0 ? k === 'eu' || p.relation !== 'eu' : k !== 'eu').map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="hzp-gender">
              {[['f', p.relation === 'copil' ? 'Fată' : 'Femeie'], ['m', p.relation === 'copil' ? 'Băiat' : 'Bărbat']].map(([v, l]) => (
                <button key={v} type="button" className={p.gender === v ? 'on' : ''} onClick={() => upd(p.key, { gender: v })}>{l}</button>
              ))}
            </div>
            {i > 0 && <button type="button" className="hzp-remove" onClick={() => { if (p.id) setRemoved(r => [...r, p.id]); setPeople(ps => ps.filter(x => x.key !== p.key)) }}>Șterge</button>}
          </div>
          <div className="hzp-fields">
            <label>Nume<input value={p.name} onChange={e => upd(p.key, { name: e.target.value })} placeholder={p.relation === 'copil' ? 'ex. Matei' : 'ex. Ana'} maxLength={60} /></label>
            <label>Data nașterii<DateInput value={p.birth_date} onChange={v => upd(p.key, { birth_date: v })} /></label>
            <label>Ora nașterii
              <input type="time" value={p.noTime ? '' : p.birth_time} disabled={p.noTime} onChange={e => upd(p.key, { birth_time: e.target.value })} />
              <span className="hzp-check"><input type="checkbox" checked={p.noTime} onChange={e => upd(p.key, { noTime: e.target.checked })} /> nu știu ora</span>
            </label>
            <label>Localitatea nașterii<PlaceSearch value={p.place_name} picked={p.lat != null} onPick={(v) => upd(p.key, v)} /></label>
          </div>
          <ChartBadge p={p} />
        </div>
      ))}
      <div className="hzp-actions">
        <button type="button" className="hz-btn hz-btn-ghost" onClick={() => setPeople(ps => [...ps, blank('copil')])}>+ Copil</button>
        <button type="button" className="hz-btn hz-btn-ghost" onClick={() => setPeople(ps => [...ps, blank('partener', ps.find(x => x.relation === 'eu')?.gender === 'm' ? 'f' : 'm')])}>+ Partener</button>
        <button type="button" className="hz-btn hz-btn-ghost" onClick={() => setPeople(ps => [...ps, blank('altcineva')])}>+ Alt membru</button>
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
