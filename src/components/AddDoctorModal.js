'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SPECIALTIES } from '@/lib/constants'
import { uid, todayISO } from '@/lib/helpers'
import { useToast } from '@/components/Toast'
import { KNOWN_CLINIC_URLS } from '@/lib/knownClinics'
import CityCombobox from './CityCombobox'
import { createClient } from '@/lib/supabase/client'

const CLINIC_NAMES = Object.keys(KNOWN_CLINIC_URLS)

export default function AddDoctorModal({ onClose }) {
  const router = useRouter()
  const toast = useToast()
  const modalRef = useRef(null)
  const titleId = 'add-doctor-modal-title'

  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return
    const focusable = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()
    function onKeyDown(e) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    modal.addEventListener('keydown', onKeyDown)
    return () => modal.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [city, setCity] = useState('')
  const [specs, setSpecs] = useState([])
  const [clinics, setClinics] = useState([''])
  const [clinicUrls, setClinicUrls] = useState({})
  const [obs, setObs] = useState('')
  const [sentiment, setSentiment] = useState(null)
  const [expText, setExpText] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [duplicates, setDuplicates] = useState([])
  const [duplicateDismissed, setDuplicateDismissed] = useState(false)
  const [specQuery, setSpecQuery] = useState('')
  const [specOpen, setSpecOpen] = useState(false)
  const specWrapRef = useRef(null)

  useEffect(() => {
    function handler(e) { if (!specWrapRef.current?.contains(e.target)) setSpecOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function checkDuplicate() {
    if (!firstName.trim() || !lastName.trim()) return
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase
      .from('doctors')
      .select('id, first_name, last_name, specs, city, status, slug')
      .ilike('first_name', firstName.trim())
      .ilike('last_name', lastName.trim())
    setDuplicates(data || [])
    setDuplicateDismissed(false)
  }

  function addSpec(val) {
    if (val && !specs.includes(val)) setSpecs(s => [...s, val])
  }
  function removeSpec(s) { setSpecs(prev => prev.filter(x => x !== s)) }

  function updateClinic(i, val) {
    const oldName = clinics[i]
    setClinics(c => c.map((x, j) => j === i ? val : x))
    setClinicUrls(prev => {
      const next = { ...prev }
      if (oldName && next[oldName] !== undefined) delete next[oldName]
      if (val && KNOWN_CLINIC_URLS[val] !== undefined) {
        next[val] = KNOWN_CLINIC_URLS[val] || ''
      }
      return next
    })
  }

  function updateClinicUrl(clinicName, url) {
    setClinicUrls(prev => ({ ...prev, [clinicName]: url }))
  }

  function addClinic() { setClinics(c => [...c, '']) }

  function removeClinic(i) {
    const name = clinics[i]
    setClinics(c => c.filter((_, j) => j !== i))
    if (name) setClinicUrls(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  async function submit() {
    if (!firstName.trim() || !lastName.trim() || !specs.length || !city.trim()) {
      toast('Completează câmpurile obligatorii (prenume, nume, specialitate, localitate)', 'error')
      return
    }
    setLoading(true)
    const filteredClinics = clinics.filter(Boolean)
    const finalUrls = {}
    filteredClinics.forEach(c => { if (clinicUrls[c]) finalUrls[c] = clinicUrls[c] })
    const doctorId = uid()

    const body = {
      doctor: {
        id: doctorId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        specs,
        city: city.trim(),
        clinics: filteredClinics,
        clinic_urls: finalUrls,
        obs: obs.trim(),
        submitted_at: Date.now(),
      },
    }

    if (sentiment || expText.trim()) {
      body.review = {
        id: uid(),
        doctor_id: doctorId,
        rating: sentiment === 'happy' ? 5 : sentiment === 'sad' ? 1 : 0,
        text: expText.trim(),
        date: todayISO(),
      }
    }

    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast(data.error || 'Eroare. Încearcă din nou.', 'error')
      return
    }
    setDone(true)
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={modalRef}>
        <div className="modal-header">
          <div className="modal-title" id={titleId}>Recomandă un medic</div>
          <button className="modal-close" onClick={onClose} aria-label="Închide">×</button>
        </div>
        <div className="modal-body">
          {done ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💗</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Mulțumim!</div>
              <div style={{ color: 'var(--ink-light)', fontSize: 14 }}>
                Recomandarea va fi verificată de un administrator înainte de publicare.
              </div>
              <button className="submit-btn" style={{ marginTop: 20 }} onClick={onClose}>Închide</button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 13, marginBottom: '1.25rem', padding: '10px 12px', background: 'var(--amber-light)', borderRadius: 8, color: 'var(--amber)', fontWeight: 500 }}>
                ℹ️ Recomandarea va fi verificată de un administrator înainte de publicare.
              </p>
              {duplicates.length > 0 && !duplicateDismissed && (
                <div style={{ marginBottom: '1.25rem', padding: '12px 14px', background: '#fff3cd', borderRadius: 8, border: '1px solid #f5c842' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#7a5a00' }}>
                    ⚠️ Am găsit un medic cu acest nume în platformă:
                  </div>
                  {duplicates.map(d => (
                    <div key={d.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f5c84240' }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        Dr. {d.first_name} {d.last_name}
                      </div>
                      {d.specs?.length > 0 && (
                        <div style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2 }}>{d.specs.join(', ')}</div>
                      )}
                      {d.city && (
                        <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>📍 {d.city}</div>
                      )}
                      {d.status === 'pending' ? (
                        <span style={{ fontSize: 11, background: '#e0e0e0', borderRadius: 4, padding: '2px 6px', marginTop: 4, display: 'inline-block', color: '#666' }}>În curs de verificare</span>
                      ) : (
                        <a href={`/medici/${d.slug || d.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--teal)', textDecoration: 'underline', marginTop: 4, display: 'inline-block' }}>
                          Vezi pagina →
                        </a>
                      )}
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="submit-btn"
                      style={{ fontSize: 13, padding: '6px 12px' }}
                      onClick={() => {
                        const approved = duplicates.find(d => d.status === 'approved')
                        onClose()
                        if (approved) router.push(`/medici/${approved.slug || approved.id}`)
                      }}
                    >
                      E același medic
                    </button>
                    <button
                      type="button"
                      className="reply-cancel-btn"
                      style={{ fontSize: 13 }}
                      onClick={() => setDuplicateDismissed(true)}
                    >
                      Nu, e alt medic cu același nume
                    </button>
                  </div>
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prenume *</label>
                  <input className="form-input" placeholder="ex: Maria" value={firstName} onChange={e => { setFirstName(e.target.value); setDuplicates([]); setDuplicateDismissed(false) }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nume *</label>
                  <input className="form-input" placeholder="ex: Ionescu" value={lastName} onChange={e => { setLastName(e.target.value); setDuplicates([]); setDuplicateDismissed(false) }} onBlur={checkDuplicate} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Specialități * (una sau mai multe)</label>
                <div className="spec-selector">
                  <div className="spec-selected-list">
                    {specs.map(s => (
                      <span key={s} className="spec-selected-item">
                        {s}
                        <button type="button" onClick={() => removeSpec(s)}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="spec-combobox-wrap" ref={specWrapRef}>
                    <input
                      className="spec-combobox-input"
                      placeholder="+ Adaugă specialitate…"
                      value={specQuery}
                      autoComplete="off"
                      onFocus={() => setSpecOpen(true)}
                      onChange={e => { setSpecQuery(e.target.value); setSpecOpen(true) }}
                      onKeyDown={e => e.key === 'Escape' && setSpecOpen(false)}
                    />
                    {specOpen && (() => {
                      const lq = specQuery.toLowerCase()
                      const filtered = SPECIALTIES.filter(s => !specs.includes(s) && s.toLowerCase().includes(lq))
                      return filtered.length > 0 ? (
                        <ul className="spec-dropdown">
                          {filtered.map(s => (
                            <li key={s} className="spec-option" onMouseDown={() => { addSpec(s); setSpecQuery(''); setSpecOpen(false) }}>{s}</li>
                          ))}
                        </ul>
                      ) : null
                    })()}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Localitate *</label>
                <CityCombobox value={city} onChange={setCity} />
              </div>
              <div className="form-group">
                <label className="form-label">Unitate medicală</label>
                <div className="clinics-editor">
                  {clinics.map((c, i) => (
                    <div key={i} className="clinic-row-group">
                      <div className="clinic-row">
                        <input
                          className="form-input"
                          placeholder="ex: Regina Maria"
                          value={c}
                          list={`clinic-list-${i}`}
                          onChange={e => updateClinic(i, e.target.value)}
                        />
                        <datalist id={`clinic-list-${i}`}>
                          {CLINIC_NAMES.map(n => <option key={n} value={n} />)}
                        </datalist>
                        {i > 0 && <button className="btn-remove-clinic" type="button" onClick={() => removeClinic(i)}>×</button>}
                      </div>
                      {c && (
                        <input
                          className="form-input clinic-url-input"
                          placeholder="Website clinică (opțional, ex: https://reginamaria.ro)"
                          value={clinicUrls[c] || ''}
                          onChange={e => updateClinicUrl(c, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn-add-clinic" type="button" onClick={addClinic} style={{ marginTop: 8 }}>+ Adaugă altă unitate</button>
              </div>
              <div className="form-group">
                <label className="form-label">Observații utile (opțional)</label>
                <input className="form-input" placeholder="ex: merge cu bilet de trimitere, vede copii peste 2 ani…" value={obs} onChange={e => setObs(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Cum a fost experiența ta? (opțional)</label>
                <div className="sentiment-row">
                  <button type="button" className={`sentiment-btn${sentiment === 'happy' ? ' selected happy' : ''}`} onClick={() => setSentiment(s => s === 'happy' ? null : 'happy')}>
                    <span className="sentiment-emoji">😊</span>
                    <span>Pozitivă</span>
                  </button>
                  <button type="button" className={`sentiment-btn${sentiment === 'sad' ? ' selected sad' : ''}`} onClick={() => setSentiment(s => s === 'sad' ? null : 'sad')}>
                    <span className="sentiment-emoji">😔</span>
                    <span>Negativă</span>
                  </button>
                </div>
                {sentiment && (
                  <textarea
                    className="form-textarea"
                    style={{ marginTop: 8 }}
                    placeholder="Câteva cuvinte despre experiența ta… (opțional)"
                    value={expText}
                    onChange={e => setExpText(e.target.value)}
                  />
                )}
              </div>
              <button className="submit-btn" onClick={submit} disabled={loading}>
                {loading ? 'Se trimite…' : 'Trimite recomandarea'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
