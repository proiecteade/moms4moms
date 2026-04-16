'use client'
import { useState, useEffect, useRef } from 'react'
import { TIPURI_RESTAURANT, TIP_VALUE_MAP, BUCATARII, TIPURI_CU_BUCATARIE } from '@/lib/constants'
import { uid, todayISO } from '@/lib/helpers'
import { useToast } from '@/components/Toast'
import { ROMANIAN_CITIES } from '@/lib/romanianCities'
import { createClient } from '@/lib/supabase/client'

export default function AddRestaurantModal({ onClose }) {
  const toast = useToast()
  const modalRef = useRef(null)
  const titleId = 'add-restaurant-modal-title'

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

  const [name, setName] = useState('')
  const [tip, setTip] = useState('')
  const [bucatarie, setBucatarie] = useState([])
  const [city, setCity] = useState('')
  const [zona, setZona] = useState('')
  const [adresa, setAdresa] = useState('')
  const [website, setWebsite] = useState('')
  const [phone, setPhone] = useState('')
  const [obs, setObs] = useState('')
  const [sentiment, setSentiment] = useState(null)
  const [expText, setExpText] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [duplicates, setDuplicates] = useState([])
  const [duplicateDismissed, setDuplicateDismissed] = useState(false)

  const tipValue = TIP_VALUE_MAP[tip] || ''
  const showBucatarie = TIPURI_CU_BUCATARIE.has(tipValue)

  async function checkDuplicate() {
    if (!name.trim()) return
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase
      .from('restaurants')
      .select('id, name, tip, city, status, slug')
      .ilike('name', name.trim())
    setDuplicates(data || [])
    setDuplicateDismissed(false)
  }

  function addBucatarie(val) {
    if (val && !bucatarie.includes(val)) setBucatarie(b => [...b, val])
  }
  function removeBucatarie(b) { setBucatarie(prev => prev.filter(x => x !== b)) }

  async function submit() {
    if (!name.trim() || !tip || !city.trim()) {
      toast('Completează câmpurile obligatorii (nume, tip, localitate)', 'error')
      return
    }
    setLoading(true)
    const restaurantId = uid()

    const body = {
      restaurant: {
        id: restaurantId,
        name: name.trim(),
        tip: tipValue,
        bucatarie: showBucatarie ? bucatarie : [],
        city: city.trim(),
        zona: zona.trim(),
        adresa: adresa.trim(),
        website: website.trim(),
        phone: phone.trim(),
        obs: obs.trim(),
        submitted_at: Date.now(),
      },
    }

    if (sentiment || expText.trim()) {
      body.review = {
        id: uid(),
        restaurant_id: restaurantId,
        rating: sentiment === 'happy' ? 5 : sentiment === 'sad' ? 1 : 0,
        text: expText.trim(),
        date: todayISO(),
      }
    }

    const res = await fetch('/api/restaurants', {
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
          <div className="modal-title" id={titleId}>Recomandă un loc</div>
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
              <p style={{ fontSize: 13, marginBottom: '1.25rem', padding: '10px 12px', background: 'var(--rose-light)', borderRadius: 8, color: 'var(--rose)', fontWeight: 500 }}>
                ℹ️ Recomandarea va fi verificată de un administrator înainte de publicare.
              </p>
              {duplicates.length > 0 && !duplicateDismissed && (
                <div style={{ marginBottom: '1.25rem', padding: '12px 14px', background: '#fff3cd', borderRadius: 8, border: '1px solid #f5c842' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#7a5a00' }}>
                    ⚠️ Am găsit un loc cu acest nume în platformă:
                  </div>
                  {duplicates.map(d => (
                    <div key={d.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f5c84240' }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                      {d.city && <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>📍 {d.city}</div>}
                      {d.status === 'pending' ? (
                        <span style={{ fontSize: 11, background: '#e0e0e0', borderRadius: 4, padding: '2px 6px', marginTop: 4, display: 'inline-block', color: '#666' }}>În curs de verificare</span>
                      ) : (
                        <a href={`/unde-iesim/${d.slug || d.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--rose)', textDecoration: 'underline', marginTop: 4, display: 'inline-block' }}>
                          Vezi pagina →
                        </a>
                      )}
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                    <button type="button" className="submit-btn" style={{ fontSize: 13, padding: '6px 12px' }} onClick={onClose}>
                      E același loc
                    </button>
                    <button type="button" className="reply-cancel-btn" style={{ fontSize: 13 }} onClick={() => setDuplicateDismissed(true)}>
                      Nu, e alt loc cu același nume
                    </button>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Numele locului *</label>
                <input className="form-input" placeholder="ex: La Mama" value={name} onChange={e => { setName(e.target.value); setDuplicates([]); setDuplicateDismissed(false) }} onBlur={checkDuplicate} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tip *</label>
                  <select className="form-input" value={tip} onChange={e => setTip(e.target.value)}>
                    <option value="">Alege tipul…</option>
                    {TIPURI_RESTAURANT.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Localitate *</label>
                  <input className="form-input" placeholder="ex: București" value={city} onChange={e => setCity(e.target.value)} list="romanian-cities-list-r" autoComplete="off" />
                  <datalist id="romanian-cities-list-r">
                    {ROMANIAN_CITIES.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>
              {showBucatarie && (
                <div className="form-group">
                  <label className="form-label">Bucătărie (opțional)</label>
                  <div className="spec-selector">
                    <div className="spec-selected-list">
                      {bucatarie.map(b => (
                        <span key={b} className="spec-selected-item">
                          {b}
                          <button type="button" onClick={() => removeBucatarie(b)}>×</button>
                        </span>
                      ))}
                    </div>
                    <select className="spec-select-input" onChange={e => { addBucatarie(e.target.value); e.target.value = '' }}>
                      <option value="">+ Adaugă bucătărie…</option>
                      {BUCATARII.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Zonă / Cartier (opțional)</label>
                <input className="form-input" placeholder="ex: Centrul Vechi, Floreasca" value={zona} onChange={e => setZona(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Adresă (opțional)</label>
                <input className="form-input" placeholder="ex: Str. Lipscani 45" value={adresa} onChange={e => setAdresa(e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Website (opțional)</label>
                  <input className="form-input" placeholder="ex: www.lamama.ro" value={website} onChange={e => setWebsite(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon (opțional)</label>
                  <input className="form-input" placeholder="ex: 0721 123 456" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Observații utile (opțional)</label>
                <input className="form-input" placeholder="ex: loc de joacă pentru copii, are parcare…" value={obs} onChange={e => setObs(e.target.value)} />
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
