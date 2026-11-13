'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signForDate, MONTHS_RO } from '@/lib/horoscop'

export default function FindSign({ query = '' }) {
  const router = useRouter()
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [err, setErr] = useState('')

  function go(e) {
    e.preventDefault()
    const d = Number(day), m = Number(month)
    if (!d || !m || d > new Date(2024, m, 0).getDate()) { setErr('Alege ziua și luna nașterii.'); return }
    const s = signForDate(m, d)
    if (s) router.push(`/horoscop/${s.slug}${query}`)
  }

  return (
    <form className="hz-find" onSubmit={go}>
      <span className="hz-find-label">Nu știi ce zodie ești?</span>
      <div className="hz-find-row">
        <select value={day} onChange={e => { setDay(e.target.value); setErr('') }} aria-label="Ziua">
          <option value="">Ziua</option>
          {Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
        </select>
        <select value={month} onChange={e => { setMonth(e.target.value); setErr('') }} aria-label="Luna">
          <option value="">Luna</option>
          {MONTHS_RO.map((n, i) => <option key={n} value={i + 1}>{n}</option>)}
        </select>
        <button type="submit">Arată-mi ✦</button>
      </div>
      {err && <span className="hz-find-err">{err}</span>}
    </form>
  )
}
