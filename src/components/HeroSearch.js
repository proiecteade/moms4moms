'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddDoctorModal from './AddDoctorModal'

export default function HeroSearch({ cities, specs = [] }) {
  const [q, setQ] = useState('')
  const [spec, setSpec] = useState('')
  const [city, setCity] = useState('')
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  function search() {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (spec) params.set('spec', spec)
    if (city) params.set('city', city)
    router.push('/medici?' + params.toString())
  }

  function handleKey(e) {
    if (e.key === 'Enter') search()
  }

  return (
    <>
      <div className="hero-actions">
        <div className="hero-search">
          <div className="hero-search-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Nume medic…"
            />
          </div>
          <div className="hero-search-sep" />
          <div className="hero-search-spec">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
              <circle cx="20" cy="10" r="2"/>
            </svg>
            <select value={spec} onChange={e => setSpec(e.target.value)}>
              <option value="">Toate specialitățile</option>
              {specs.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="hero-search-sep" />
          <div className="hero-search-city">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <select value={city} onChange={e => setCity(e.target.value)}>
              <option value="">Toate localitățile</option>
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={search}>Caută</button>
        </div>
        <div className="hero-or">sau</div>
        <button className="hero-recommend-btn" onClick={() => setShowModal(true)}>
          + Adaugă un medic
        </button>
      </div>
      {showModal && <AddDoctorModal onClose={() => setShowModal(false)} />}
    </>
  )
}
