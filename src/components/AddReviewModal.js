'use client'
import { useState, useEffect, useRef } from 'react'
import { uid, todayISO } from '@/lib/helpers'
import { useToast } from '@/components/Toast'

export default function AddReviewModal({ doctor, onClose }) {
  const toast = useToast()
  const modalRef = useRef(null)
  const titleId = 'add-review-modal-title'

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

  const [reviewer, setReviewer] = useState('')
  const [reviewerEmail, setReviewerEmail] = useState('')
  const [text, setText] = useState('')
  const [sentiment, setSentiment] = useState(null) // 'happy' | 'sad'
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const name = `Dr. ${doctor.first_name}${doctor.last_name ? ' ' + doctor.last_name : ''}`

  async function submit() {
    if (!sentiment) return toast('Alege o reacție mai întâi', 'error')
    setLoading(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctor_id: doctor.id,
        reviewer: reviewer.trim() || 'Anonim',
        user_email: reviewerEmail.trim() || null,
        text: text.trim() || null,
        rating: sentiment === 'happy' ? 5 : 1,
        date: todayISO(),
      }),
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
          <div className="modal-title" id={titleId}>Experiența ta</div>
          <button className="modal-close" onClick={onClose} aria-label="Închide">×</button>
        </div>
        <div className="modal-body">
          {done ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💗</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Mulțumim!</div>
              <div style={{ color: 'var(--ink-light)', fontSize: 14 }}>
                Experiența ta va fi publicată după verificare.
              </div>
              <button className="submit-btn" style={{ marginTop: 20 }} onClick={onClose}>Închide</button>
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--teal)', marginBottom: '1.25rem', padding: '10px 14px', background: 'var(--teal-light)', borderRadius: 10 }}>
                {name}
              </div>
              <div className="form-group">
                <label className="form-label">Cum a fost experiența ta cu acest medic?</label>
                <div className="sentiment-row">
                  <button
                    type="button"
                    className={`sentiment-btn${sentiment === 'happy' ? ' selected happy' : ''}`}
                    onClick={() => setSentiment('happy')}
                  >
                    <span className="sentiment-emoji">😊</span>
                    <span>Pozitivă</span>
                  </button>
                  <button
                    type="button"
                    className={`sentiment-btn${sentiment === 'sad' ? ' selected sad' : ''}`}
                    onClick={() => setSentiment('sad')}
                  >
                    <span className="sentiment-emoji">😔</span>
                    <span>Negativă</span>
                  </button>
                </div>
              </div>
              {sentiment && (
                <>
                  <div className="form-group">
                    <label className="form-label">Detalii (opțional)</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Spune-ne mai multe despre experiența ta…"
                      value={text}
                      onChange={e => setText(e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Numele tău (opțional)</label>
                      <input
                        className="form-input"
                        placeholder="ex: A.M. sau lasă gol pentru anonim"
                        value={reviewer}
                        onChange={e => setReviewer(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email (opțional)</label>
                      <input
                        className="form-input"
                        type="email"
                        placeholder="pentru contact"
                        value={reviewerEmail}
                        onChange={e => setReviewerEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
              <button className="submit-btn" onClick={submit} disabled={loading || !sentiment}>
                {loading ? 'Se trimite…' : 'Trimite'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
