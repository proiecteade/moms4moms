'use client'
import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function FilterSidebar({ cities, specs, currentCity, currentSpec, currentQ, currentRating, currentSort }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function update(key, value) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(pathname + '?' + params.toString())
  }

  function setSpec(s) {
    const params = new URLSearchParams(searchParams.toString())
    if (currentSpec === s) params.delete('spec')
    else params.set('spec', s)
    params.delete('page')
    router.push(pathname + '?' + params.toString())
  }

  function setRating(r) {
    const params = new URLSearchParams(searchParams.toString())
    if (r) params.set('rating', r)
    else params.delete('rating')
    params.delete('page')
    router.push(pathname + '?' + params.toString())
  }

  function clearAll() {
    router.push(pathname)
  }

  const hasFilters = currentQ || currentCity || currentSpec || currentRating

  return (
    <>
      <button
        className="filters-toggle-btn"
        onClick={() => setOpen(o => !o)}
      >
        {open ? '✕ Închide filtrele' : `🔍 Filtre${hasFilters ? ' ●' : ''}`}
      </button>
    <div className={`filters-sidebar${open ? ' mobile-open' : ''}`}>
      <div className="filter-section">
        <div className="filter-label">Caută</div>
        <input
          className="filter-input"
          type="text"
          placeholder="Nume sau cuvânt cheie…"
          defaultValue={currentQ}
          onKeyDown={e => e.key === 'Enter' && update('q', e.target.value)}
          onBlur={e => update('q', e.target.value)}
        />
      </div>
      <div className="filter-section">
        <div className="filter-label">Localitate</div>
        <select className="filter-input" value={currentCity} onChange={e => update('city', e.target.value)}>
          <option value="">Toate localitățile</option>
          {cities.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="filter-section">
        <div className="filter-label">Specialitate</div>
        <div className="filter-chip-group">
          {specs.map(s => (
            <button
              key={s}
              className={`filter-chip${currentSpec === s ? ' active' : ''}`}
              onClick={() => setSpec(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <div className="filter-label">Rating minim</div>
        <div className="filter-chip-group">
          {[{ label: 'Toate', val: 0 }, { label: '4+ ⭐', val: 4 }, { label: '4.5+ ⭐', val: 4.5 }].map(r => (
            <button
              key={r.val}
              className={`filter-chip${currentRating === r.val ? ' active' : ''}`}
              onClick={() => setRating(r.val)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <button className="clear-btn" onClick={clearAll}>✕ Resetează filtrele</button>
    </div>
    </>
  )
}
