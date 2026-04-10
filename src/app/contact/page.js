'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { todayISO } from '@/lib/helpers'

export default function ContactPage() {
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.from('contact_messages').insert({
      id: crypto.randomUUID(),
      subject: subject.trim() || null,
      email: email.trim() || null,
      message: message.trim(),
      date: todayISO(),
    })
    if (error) { setError('A apărut o eroare. Încearcă din nou.'); setLoading(false); return }
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
          <div className="form-group">
            <label className="form-label">Subiect</label>
            <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Despre ce vrei să ne scrii?" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>(pentru răspuns)</span></label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplu.ro" />
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
          {error && <div style={{ color: 'var(--rose)', fontSize: 13, marginTop: 8 }}>{error}</div>}
        </form>
      )}
    </div>
  )
}
