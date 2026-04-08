'use client'
import { useState, useRef, useEffect } from 'react'
import { normalize } from '@/lib/helpers'

export default function SearchInput({
  suggestions = [],
  value,
  onChange,
  onSearch,
  onSpecSelect,
  placeholder,
  inputClassName = '',
}) {
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const containerRef = useRef(null)

  const nv = normalize(value)
  const filtered = value.trim().length > 0
    ? suggestions.filter(s => normalize(s.label).includes(nv)).slice(0, 9)
    : []

  useEffect(() => {
    function onMouseDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setActiveIdx(-1)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleChange(e) {
    onChange(e.target.value)
    setOpen(true)
    setActiveIdx(-1)
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => (filtered.length ? Math.min(i + 1, filtered.length - 1) : -1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && activeIdx >= 0 && filtered[activeIdx]) {
        pick(filtered[activeIdx])
      } else {
        setOpen(false)
        onSearch(value)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  function pick(s) {
    setOpen(false)
    setActiveIdx(-1)
    if (s.type === 'spec') {
      onChange('')
      onSpecSelect(s.label)
    } else {
      const q = s.label.replace(/^Dr\.\s*/, '')
      onChange(q)
      onSearch(q)
    }
  }

  const specs = filtered.filter(s => s.type === 'spec')
  const doctors = filtered.filter(s => s.type === 'doctor')
  const grouped = [...specs, ...doctors]

  return (
    <div ref={containerRef} className="search-input-wrap">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value.trim() && setOpen(true)}
        placeholder={placeholder}
        className={inputClassName}
        autoComplete="off"
      />
      {open && grouped.length > 0 && (
        <div className="search-dropdown">
          {specs.length > 0 && (
            <div className="search-dropdown-group-label">Specialități</div>
          )}
          {specs.map((s, i) => (
            <div
              key={s.label}
              className={`search-dropdown-item${i === activeIdx ? ' active' : ''}`}
              onMouseDown={e => { e.preventDefault(); pick(s) }}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <span className="suggestion-spec-dot" />
              {s.label}
            </div>
          ))}
          {doctors.length > 0 && (
            <div className="search-dropdown-group-label">Medici</div>
          )}
          {doctors.map((s, i) => {
            const globalIdx = specs.length + i
            return (
              <div
                key={s.label}
                className={`search-dropdown-item${globalIdx === activeIdx ? ' active' : ''}`}
                onMouseDown={e => { e.preventDefault(); pick(s) }}
                onMouseEnter={() => setActiveIdx(globalIdx)}
              >
                {s.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
