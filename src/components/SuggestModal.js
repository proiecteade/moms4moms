'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uid, todayISO, doctorFullName } from '@/lib/helpers'
import { useToast } from '@/components/Toast'

export default function SuggestModal({ doctor, onClose }) {
  const toast = useToast()
  const [text, setText] = useState('')
  const [submitterName, setSubmitterName] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function submit() {
    if (!text.trim()) return toast('Descrie ce s-a schimbat', 'error')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('suggestions').insert({
      id: uid(),
      doctor_id: doctor.id,
      doctor_name: doctorFullName(doctor),
      text: text.trim(),
      date: todayISO(),
      submitter_name: submitterName.trim() || null,
      submitter_email: submitterEmail.trim() || null,
    })
    setLoading(false)
    if (error) { toast('Eroare. Încearcă din nou.', 'error'); return }
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
              <div style={{ color: 'var(--ink-light)', fontSize: 14 }}>Sugestia a fost trimisă și va fi verificată înainte de publicare.</div>
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
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Numele tău (opțional)</label>
                  <input className="form-input" placeholder="ex: Ana M." value={submitterName} onChange={e => setSubmitterName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email (opțional)</label>
                  <input className="form-input" type="email" placeholder="pentru contact" value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} />
                </div>
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
