'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uid, todayISO } from '@/lib/helpers'

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [star, setStar] = useState(0)
  const [text, setText] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function submit() {
    if (!star && !text.trim()) return
    const supabase = createClient()
    await supabase.from('site_feedback').insert({
      id: uid(),
      rating: star || null,
      text: text.trim() || null,
      submitter_email: email.trim() || null,
      date: todayISO(),
    })
    setSent(true)
    setTimeout(() => { setOpen(false); setSent(false); setStar(0); setText('') }, 2000)
  }

  return (
    <div className="feedback-float">
      <button className="feedback-btn" onClick={() => setOpen(o => !o)}>
        💬 Feedback pentru site
      </button>
      {open && (
        <div className="feedback-box open">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '0.5rem 0', color: 'var(--teal)', fontWeight: 600 }}>
              Mulțumim! 💗
            </div>
          ) : (
            <>
              <div className="feedback-box-title">Cum ți se pare site-ul?</div>
              <div className="feedback-stars">
                {[1,2,3,4,5].map(n => (
                  <span key={n} className={`fb-star${star >= n ? ' sel' : ''}`} onClick={() => setStar(n)}>★</span>
                ))}
              </div>
              <textarea
                placeholder="Ce îți place? Ce am putea îmbunătăți?"
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <input
                type="email"
                className="form-input"
                style={{ fontSize: 13, marginBottom: 6 }}
                placeholder="Email (opțional, pentru răspuns)"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button className="feedback-submit" onClick={submit}>Trimite feedback</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
