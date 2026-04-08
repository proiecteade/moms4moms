'use client'
import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import SearchInput from './SearchInput'

export default function FilterSidebar({ cities, currentCity, currentSpec, currentQ, suggestions = [], specs = [], clinics = [], currentClinic = '' }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState(currentQ || '')
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

  function handleSearch(query) {
    update('q', query)
  }

  function handleSpecSelect(spec) {
    setQ('')
    update('spec', spec)
  }

  function clearAll() {
    setQ('')
    router.push(pathname)
  }

  const hasFilters = currentQ || currentCity || currentSpec || currentClinic

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
          <SearchInput
            suggestions={suggestions}
            value={q}
            onChange={setQ}
            onSearch={handleSearch}
            onSpecSelect={handleSpecSelect}
            placeholder="Nume sau cuvânt cheie…"
            inputClassName="filter-input"
          />
        </div>
        <div className="filter-section">
          <div className="filter-label">Localitate</div>
          <select className="filter-input" value={currentCity} onChange={e => update('city', e.target.value)}>
            <option value="">Toate localitățile</option>
            {cities.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {specs.length > 0 && (
          <div className="filter-section">
            <div className="filter-label">Specialitate</div>
            <select className="filter-input" value={currentSpec} onChange={e => update('spec', e.target.value)}>
              <option value="">Toate specialitățile</option>
              {specs.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}
        {clinics.length > 0 && (
          <div className="filter-section">
            <div className="filter-label">Unitate medicală</div>
            <select className="filter-input" value={currentClinic} onChange={e => update('clinic', e.target.value)}>
              <option value="">Toate unitățile</option>
              {clinics.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        )}
        <button className="clear-btn" onClick={clearAll}>✕ Resetează filtrele</button>
      </div>
    </>
  )
}
