'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uid, todayISO, formatDate } from '@/lib/helpers'

export default function CommentsSection({ topLevel, repliesByParentId, doctorId }) {
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replyName, setReplyName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(null)

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

  function cancelReply() {
    setReplyingTo(null)
    setReplyText('')
    setReplyName('')
  }

  if (topLevel.length === 0) {
    return <div className="no-reviews">Fii primul care lasă un comentariu! 💗</div>
  }

  return (
    <>
      {topLevel.map(r => {
        const emoji = r.rating >= 4 ? '😊' : r.rating > 0 && r.rating < 3 ? '😔' : null
        const replies = repliesByParentId[r.id] || []
        return (
          <div key={r.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-name">
                {emoji && <span className="review-sentiment">{emoji}</span>}
                {r.reviewer || 'Anonim'}
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
                  <button className="reply-cancel-btn" onClick={cancelReply}>Anulează</button>
                </div>
              </div>
            ) : (
              <button className="reply-btn" onClick={() => setReplyingTo(r.id)}>↩ Răspunde</button>
            )}
          </div>
        )
      })}
    </>
  )
}
