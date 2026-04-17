'use client'
import { useState, useRef, useEffect } from 'react'
import { ROMANIAN_CITIES, MAJOR_CITIES } from '@/lib/romanianCities'

export default function CityCombobox({ value, onChange, placeholder = 'ex: București' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const wrapRef = useRef(null)

  useEffect(() => { setQuery(value || '') }, [value])

  useEffect(() => {
    function handler(e) { if (!wrapRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function getSuggestions(q) {
    if (!q) return MAJOR_CITIES.slice(0, 8)
    const lq = q.toLowerCase()
    const major = MAJOR_CITIES.filter(c => c.toLowerCase().includes(lq))
    const majorSet = new Set(major)
    const others = ROMANIAN_CITIES.filter(c => !majorSet.has(c) && c.toLowerCase().includes(lq))
    return [...major, ...others].slice(0, 8)
  }

  const suggestions = getSuggestions(query)

  function select(city) {
    setQuery(city)
    onChange(city)
    setOpen(false)
  }

  function handleKey(e) {
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="city-combobox-wrap" ref={wrapRef}>
      <input
        className="form-input"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
        onKeyDown={handleKey}
      />
      {open && suggestions.length > 0 && (
        <ul className="city-dropdown">
          {suggestions.map(c => (
            <li key={c} className="city-option" onMouseDown={() => select(c)}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
