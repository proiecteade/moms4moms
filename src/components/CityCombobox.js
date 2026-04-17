'use client'
import { useState, useRef, useEffect } from 'react'
import { ROMANIAN_ORASE } from '@/lib/romanianOrase'

export default function CityCombobox({ value, onChange, placeholder = 'ex: Cluj-Napoca' }) {
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
    if (!q) return ROMANIAN_ORASE
    const lq = q.toLowerCase()
    const starts = ROMANIAN_ORASE.filter(c => c.toLowerCase().startsWith(lq))
    const contains = ROMANIAN_ORASE.filter(c => !c.toLowerCase().startsWith(lq) && c.toLowerCase().includes(lq))
    return [...starts, ...contains].slice(0, 10)
  }

  // when arrow is open with no query, show all; otherwise filter by query
  const suggestions = open ? getSuggestions(query) : []

  function select(city) {
    setQuery(city)
    onChange(city)
    setOpen(false)
  }

  return (
    <div className="city-combobox-wrap" ref={wrapRef}>
      <input
        className="form-input city-combobox-input"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={e => {
          setQuery(e.target.value)
          onChange(e.target.value)
          setOpen(e.target.value.length > 0)
        }}
        onKeyDown={e => e.key === 'Escape' && setOpen(false)}
      />
      <button
        type="button"
        className="city-combobox-arrow"
        onMouseDown={e => { e.preventDefault(); setOpen(o => !o) }}
        tabIndex={-1}
        aria-label="Arată toate orașele"
      >▾</button>
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
