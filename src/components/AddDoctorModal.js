'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SPECIALTIES } from '@/lib/constants'
import { uid, todayISO } from '@/lib/helpers'

export default function AddDoctorModal({ onClose }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [city, setCity] = useState('')
  const [specs, setSpecs] = useState([])
  const [clinics, setClinics] = useState([''])
  const [obs, setObs] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function addSpec(val) {
    if (val && !specs.includes(val)) setSpecs(s => [...s, val])
  }
  function removeSpec(s) { setSpecs(prev => prev.filter(x => x !== s)) }
  function updateClinic(i, val) { setClinics(c => c.map((x, j) => j === i ? val : x)) }
  function addClinic() { setClinics(c => [...c, '']) }
  function removeClinic(i) { setClinics(c => c.filter((_, j) => j !== i)) }

  async function submit() {
    if (!firstName.trim() || !lastName.trim() || !specs.length || !city.trim()) {
      alert('Completează câmpurile obligatorii (prenume, nume, specialitate, localitate)')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('doctors').insert({
      id: uid(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      specs,
      city: city.trim(),
      clinics: clinics.filter(Boolean),
      obs: obs.trim(),
      note: note.trim(),
      status: 'pending',
      submitted_at: Date.now(),
    })
    setLoading(false)
    if (error) { alert('Eroare. Încearcă din nou.'); return }
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
                <label className="form-label">Spital / Clinică</label>
                <div className="clinics-editor">
                  {clinics.map((c, i) => (
                    <div key={i} className="clinic-row">
                      <input className="form-input" placeholder="ex: Regina Maria" value={c} onChange={e => updateClinic(i, e.target.value)} />
                      {i > 0 && <button className="btn-remove-clinic" type="button" onClick={() => removeClinic(i)}>×</button>}
                    </div>
                  ))}
                </div>
                <button className="btn-add-clinic" type="button" onClick={addClinic} style={{ marginTop: 8 }}>+ Adaugă altă clinică</button>
              </div>
              <div className="form-group">
                <label className="form-label">Observații utile (opțional)</label>
                <input className="form-input" placeholder="ex: merge cu bilet de trimitere, vede copii peste 2 ani…" value={obs} onChange={e => setObs(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">De ce o/îl recomanzi? (opțional)</label>
                <textarea className="form-textarea" placeholder="Scrie câteva cuvinte despre experiența ta…" value={note} onChange={e => setNote(e.target.value)} />
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
