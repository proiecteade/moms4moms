'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddDoctorModal from './AddDoctorModal'
import SearchInput from './SearchInput'

export default function HeroSearch({ cities, suggestions = [] }) {
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  function search(query = q) {
    const params = new URLSearchParams()
    if ((query || q).trim()) params.set('q', (query || q).trim())
    if (city) params.set('city', city)
    router.push('/medici?' + params.toString())
  }

  function goSpec(spec) {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    params.set('spec', spec)
    router.push('/medici?' + params.toString())
  }

  return (
    <>
      <div className="hero-actions">
        <div className="hero-search">
          <div className="hero-search-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <SearchInput
              suggestions={suggestions}
              value={q}
              onChange={setQ}
              onSearch={search}
              onSpecSelect={goSpec}
              placeholder="Medic sau specialitate…"
            />
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
          <button onClick={() => search()}>Caută</button>
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
