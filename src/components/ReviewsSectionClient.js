'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uid, todayISO, formatDate } from '@/lib/helpers'
import { useToast } from './Toast'
import { useAuth } from './AuthProvider'

export default function ReviewsSectionClient({ topLevel, repliesByParentId, doctorId, doctor }) {
  const { user } = useAuth() || {}
  const hasComments = topLevel.length > 0
  const [open, setOpen] = useState(hasComments)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replyName, setReplyName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(null)

  // inline new-review form state
  const [sentiment, setSentiment] = useState(null)
  const [text, setText] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formDone, setFormDone] = useState(false)
  const formRef = useRef(null)
  const textareaRef = useRef(null)
  const toast = useToast()

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''

  useEffect(() => {
    function handler() {
      setOpen(true)
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        textareaRef.current?.focus()
      }, 80)
    }
    window.addEventListener('openComments', handler)
    return () => window.removeEventListener('openComments', handler)
  }, [])

  useEffect(() => {
    if (window.location.hash === '#comentarii') {
      setOpen(true)
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        textareaRef.current?.focus()
      }, 80)
    }
  }, [])

  async function submitReview() {
    if (!user) { window.dispatchEvent(new CustomEvent('openAuth')); return }
    if (!text.trim() && !sentiment) return toast('Scrie ceva sau alege o reacție', 'error')
    setFormLoading(true)
    const supabase = createClient()
    const reviewerUrl = (!isAnonymous && user?.user_metadata?.fb_profile_url)
      ? user.user_metadata.fb_profile_url
      : null
    const { error } = await supabase.from('reviews').insert({
      id: uid(),
      doctor_id: doctorId,
      reviewer: isAnonymous ? 'Anonim' : (displayName || 'Anonim'),
      text: text.trim() || null,
      rating: sentiment === 'happy' ? 5 : sentiment === 'sad' ? 1 : null,
      date: todayISO(),
      status: 'pending',
      user_id: user.id,
      user_email: user.email,
      is_anonymous: isAnonymous,
      reviewer_url: reviewerUrl,
    })
    setFormLoading(false)
    if (error) { toast('Eroare. Încearcă din nou.', 'error'); return }
    setFormDone(true)
  }

  async function submitReply(parentId) {
    if (!replyText.trim()) return
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from('reviews').insert({
      id: uid(),
      doctor_id: doctorId,
      parent_id: parentId,
      text: replyText.trim(),
      reviewer: replyName.trim() || 'Anonim',
      date: todayISO(),
      status: 'pending',
    })
    setSubmitting(false)
    setReplyingTo(null)
    setReplyText('')
    setReplyName('')
    setSent(parentId)
    setTimeout(() => setSent(null), 4000)
  }

  if (!open) return null

  const name = `Dr. ${doctor.first_name}${doctor.last_name ? ' ' + doctor.last_name : ''}`

  return (
    <div id="comentarii" className="reviews-section">
      <div className="section-title">Comentarii</div>

      {/* Inline form */}
      <div className="inline-review-form" ref={formRef}>
        {formDone ? (
          <div className="inline-review-done">
            <span>💗</span> Mulțumim! Comentariul tău va apărea după verificare.
          </div>
        ) : (
          <>
            <div className="inline-sentiment-row">
              <span className="inline-sentiment-label">Cum a fost experiența ta?</span>
              <button
                type="button"
                className={`inline-sentiment-btn${sentiment === 'happy' ? ' selected happy' : ''}`}
                onClick={() => setSentiment(s => s === 'happy' ? null : 'happy')}
              >😊 Pozitivă</button>
              <button
                type="button"
                className={`inline-sentiment-btn${sentiment === 'sad' ? ' selected sad' : ''}`}
                onClick={() => setSentiment(s => s === 'sad' ? null : 'sad')}
              >😔 Negativă</button>
            </div>
            <textarea
              ref={textareaRef}
              className="form-textarea"
              placeholder="Scrie comentariul tău…"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              style={{ resize: 'none' }}
            />
            <div className="inline-review-row">
              <label className="anonymous-toggle">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                />
                Postează anonim
              </label>
              <button
                className="submit-btn"
                onClick={submitReview}
                disabled={formLoading}
                style={{ whiteSpace: 'nowrap' }}
              >
                {formLoading ? 'Se trimite…' : 'Trimite'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Existing comments */}
      {topLevel.length > 0 && (
        <div className="comments-list">
          {topLevel.map(r => {
            const emoji = r.rating >= 4 ? '😊' : r.rating > 0 && r.rating < 3 ? '😔' : null
            const replies = repliesByParentId[r.id] || []
            return (
              <div key={r.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-name">
                    {emoji && <span className="review-sentiment">{emoji}</span>}
                    {r.reviewer_url && !r.is_anonymous
                      ? <a href={r.reviewer_url} target="_blank" rel="noopener noreferrer" className="reviewer-link">{r.reviewer || 'Anonim'}</a>
                      : (r.reviewer || 'Anonim')
                    }
                  </div>
                  <div className="review-date">{formatDate(r.date)}</div>
                </div>
                {r.text && <div className="review-text">{r.text}</div>}

                {replies.map(reply => (
                  <div key={reply.id} className="reply-card">
                    <div className="review-header">
                      <div className="reviewer-name">↩ {reply.reviewer || 'Anonim'}</div>
                      <div className="review-date">{formatDate(reply.date)}</div>
                    </div>
                    {reply.text && <div className="review-text">{reply.text}</div>}
                  </div>
                ))}

                {sent === r.id ? (
                  <div className="reply-sent">Răspunsul tău va apărea după verificare. Mulțumim! 💗</div>
                ) : replyingTo === r.id ? (
                  <div className="reply-form">
                    <textarea
                      className="form-input"
                      placeholder="Scrie un răspuns..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={3}
                      style={{ resize: 'none' }}
                    />
                    <input
                      className="form-input"
                      placeholder="Numele tău (opțional)"
                      value={replyName}
                      onChange={e => setReplyName(e.target.value)}
                    />
                    <div className="reply-form-actions">
                      <button
                        className="submit-btn"
                        style={{ flex: 1 }}
                        onClick={() => submitReply(r.id)}
                        disabled={submitting || !replyText.trim()}
                      >
                        {submitting ? '…' : 'Trimite răspunsul'}
                      </button>
                      <button className="reply-cancel-btn" onClick={() => { setReplyingTo(null); setReplyText(''); setReplyName('') }}>Anulează</button>
                    </div>
                  </div>
                ) : (
                  <button className="reply-btn" onClick={() => setReplyingTo(r.id)}>↩ Răspunde</button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
