'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uid, todayISO } from '@/lib/helpers'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('contact_messages').insert({
      id: uid(),
      name: name.trim() || null,
      email: email.trim() || null,
      message: message.trim(),
      date: todayISO(),
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="contact-page">
      <h1 className="contact-title">Contactează-ne</h1>
      <p style={{ color: 'var(--ink-light)', fontSize: 15, marginBottom: '2rem' }}>
        Ai o întrebare, o sugestie sau vrei să colaborăm? Scrie-ne și îți răspundem cât mai curând.
      </p>

      {sent ? (
        <div className="contact-success">
          Mulțumim! Te contactăm în curând. 💗
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nume <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>(opțional)</span></label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Numele tău" />
            </div>
            <div className="form-group">
              <label className="form-label">Email <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>(pentru răspuns)</span></label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplu.ro" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mesaj</label>
            <textarea
              className="form-textarea"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Scrie mesajul tău aici…"
              rows={5}
              required
            />
          </div>
          <button className="submit-btn" type="submit" disabled={loading || !message.trim()}>
            {loading ? 'Se trimite…' : 'Trimite mesajul'}
          </button>
        </form>
      )}
    </div>
  )
}
