'use client'
import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import SearchInput from './SearchInput'
import { TIP_LABEL_MAP, TIPURI_CU_BUCATARIE } from '@/lib/constants'

export default function RestaurantFilterSidebar({ cities, tips = [], bucatarii = [], currentCity, currentTip, currentBucatarie = '', currentQ, suggestions = [] }) {
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
    // Dacă se schimbă tipul, ștergem bucătăria dacă nu mai e relevantă
    if (key === 'tip' && !TIPURI_CU_BUCATARIE.has(value)) {
      params.delete('bucatarie')
    }
    router.push(pathname + '?' + params.toString())
  }

  function handleSearch(query) {
    update('q', query)
  }

  function clearAll() {
    setQ('')
    router.push(pathname)
  }

  const hasFilters = currentQ || currentCity || currentTip || currentBucatarie
  const showBucatarie = !currentTip || TIPURI_CU_BUCATARIE.has(currentTip)

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
        {tips.length > 0 && (
          <div className="filter-section">
            <div className="filter-label">Tip local</div>
            <select className="filter-input" value={currentTip} onChange={e => update('tip', e.target.value)}>
              <option value="">Toate tipurile</option>
              {tips.map(t => <option key={t} value={t}>{TIP_LABEL_MAP[t] || t}</option>)}
            </select>
          </div>
        )}
        {showBucatarie && bucatarii.length > 0 && (
          <div className="filter-section">
            <div className="filter-label">Bucătărie</div>
            <select className="filter-input" value={currentBucatarie} onChange={e => update('bucatarie', e.target.value)}>
              <option value="">Toate bucătăriile</option>
              {bucatarii.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        )}
        <button className="clear-btn" onClick={clearAll}>✕ Resetează filtrele</button>
      </div>
    </>
  )
}
