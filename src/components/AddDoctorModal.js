'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SPECIALTIES } from '@/lib/constants'
import { uid, todayISO } from '@/lib/helpers'
import { useToast } from '@/components/Toast'
import { KNOWN_CLINIC_URLS } from '@/lib/knownClinics'

const CLINIC_NAMES = Object.keys(KNOWN_CLINIC_URLS)

export default function AddDoctorModal({ onClose }) {
  const toast = useToast()
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
    const supabase = createClient()
    const filteredClinics = clinics.filter(Boolean)
    const finalUrls = {}
    filteredClinics.forEach(c => { if (clinicUrls[c]) finalUrls[c] = clinicUrls[c] })
    const note = sentiment ? (expText.trim() ? `${sentiment}: ${expText.trim()}` : sentiment) : ''
    const { error } = await supabase.from('doctors').insert({
      id: uid(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      specs,
      city: city.trim(),
      clinics: filteredClinics,
      clinic_urls: finalUrls,
      obs: obs.trim(),
      note,
      status: 'pending',
      submitted_at: Date.now(),
    })
    setLoading(false)
    if (error) { toast('Eroare. Încearcă din nou.', 'error'); return }
    setDone(true)
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Recomandă un medic</div>
          <button className="modal-close" onClick={onClose}>×</button>
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
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prenume *</label>
                  <input className="form-input" placeholder="ex: Maria" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nume *</label>
                  <input className="form-input" placeholder="ex: Ionescu" value={lastName} onChange={e => setLastName(e.target.value)} />
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
                  <select className="spec-select-input" onChange={e => { addSpec(e.target.value); e.target.value = '' }}>
                    <option value="">+ Adaugă specialitate…</option>
                    {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Localitate *</label>
                <input className="form-input" placeholder="ex: București" value={city} onChange={e => setCity(e.target.value)} />
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
