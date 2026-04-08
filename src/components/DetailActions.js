'use client'
import { useState } from 'react'
import AddReviewModal from './AddReviewModal'
import SuggestModal from './SuggestModal'

export default function DetailActions({ doctor, reviewOnly = false }) {
  const [showReview, setShowReview] = useState(false)
  const [showSuggest, setShowSuggest] = useState(false)

  if (reviewOnly) {
    return (
      <>
        <button className="review-btn" onClick={() => setShowReview(true)}>💬 Scrie experiența ta</button>
        {showReview && <AddReviewModal doctor={doctor} onClose={() => setShowReview(false)} />}
      </>
    )
  }

  return (
    <>
      <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="suggest-btn" onClick={() => setShowSuggest(true)}>✏️ Sugerează o modificare</button>
        <button className="review-btn" onClick={() => setShowReview(true)}>💬 Scrie experiența ta</button>
      </div>
      {showReview && <AddReviewModal doctor={doctor} onClose={() => setShowReview(false)} />}
      {showSuggest && <SuggestModal doctor={doctor} onClose={() => setShowSuggest(false)} />}
    </>
  )
}
