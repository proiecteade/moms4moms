'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uid, todayISO, doctorFullName } from '@/lib/helpers'

export default function SuggestModal({ doctor, onClose }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function submit() {
    if (!text.trim()) return alert('Descrie ce s-a schimbat')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('suggestions').insert({
      id: uid(),
      doctor_id: doctor.id,
      doctor_name: doctorFullName(doctor),
      text: text.trim(),
      date: todayISO(),
    })
    setLoading(false)
    if (error) { alert('Eroare. Încearcă din nou.'); return }
    setDone(true)
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Sugerează o modificare</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {done ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Mulțumim!</div>
              <div style={{ color: 'var(--ink-light)', fontSize: 14 }}>Sugestia a fost trimisă.</div>
              <button className="submit-btn" style={{ marginTop: 20 }} onClick={onClose}>Închide</button>
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--amber)', marginBottom: '1.25rem', padding: '10px 14px', background: 'var(--amber-light)', borderRadius: 10 }}>
                {doctorFullName(doctor)}
              </div>
              <div className="form-group">
                <label className="form-label">Ce s-a schimbat? *</label>
                <textarea
                  className="form-textarea"
                  placeholder="ex: s-a mutat la altă clinică, nu mai merge cu bilet de trimitere, are specialitate nouă…"
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
              </div>
              <button className="submit-btn" onClick={submit} disabled={loading}>
                {loading ? 'Se trimite…' : 'Trimite sugestia'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
