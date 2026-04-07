'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uid, todayISO } from '@/lib/helpers'

export default function Footer() {
  const [open, setOpen] = useState(false)
  const [star, setStar] = useState(0)
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)

  async function submit() {
    if (!star && !text.trim()) return
    const supabase = createClient()
    await supabase.from('site_feedback').insert({
      id: uid(),
      rating: star || null,
      text: text.trim() || null,
      date: todayISO(),
    })
    setSent(true)
    setTimeout(() => { setOpen(false); setSent(false); setStar(0); setText('') }, 2000)
  }

  return (
    <footer style={{ background: 'white', borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', marginTop: '3rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <img src="/logo/logo2.png" alt="Moms4Moms" style={{ height: 72, width: 'auto', display: 'block', marginBottom: 8 }} />
          <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>© Moms4Moms, 2026</div>
        </div>
        <div>
          {!open ? (
            <button className="footer-feedback-btn" onClick={() => setOpen(true)}>💬 Trimite-ne feedback-ul tău</button>
          ) : sent ? (
            <div style={{ color: 'var(--teal)', fontWeight: 600, fontSize: 14 }}>Mulțumim! 💗</div>
          ) : (
            <div className="footer-feedback-form">
              <div className="footer-feedback-title">Cum ți se pare site-ul?</div>
              <div className="feedback-stars">
                {[1,2,3,4,5].map(n => (
                  <span key={n} className={`fb-star${star >= n ? ' sel' : ''}`} onClick={() => setStar(n)}>★</span>
                ))}
              </div>
              <textarea
                className="footer-feedback-textarea"
                placeholder="Ce îți place? Ce am putea îmbunătăți?"
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="feedback-submit" onClick={submit}>Trimite feedback</button>
                <button className="footer-feedback-cancel" onClick={() => setOpen(false)}>Anulează</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
