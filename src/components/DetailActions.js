'use client'
import { useState } from 'react'
import AddReviewModal from './AddReviewModal'
import SuggestModal from './SuggestModal'
import { useToast } from './Toast'

export default function DetailActions({ doctor }) {
  const [showReview, setShowReview] = useState(false)
  const [showSuggest, setShowSuggest] = useState(false)
  const toast = useToast()
  const name = `Dr. ${doctor.first_name}${doctor.last_name ? ' ' + doctor.last_name : ''}`

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    toast('Link copiat!', 'success')
  }

  function shareWhatsApp() {
    const text = `Îți recomand pe ${name} pe Moms4Moms: ${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <>
      <div className="detail-actions">
        <button className="suggest-btn" onClick={() => setShowSuggest(true)}>✏️ Sugerează o modificare</button>
        <button className="review-btn" onClick={() => setShowReview(true)}>💬 Scrie experiența ta</button>
        <button className="share-btn" onClick={copyLink}>📋 Copiază link</button>
        <button className="share-btn share-btn-wa" onClick={shareWhatsApp}>💬 WhatsApp</button>
      </div>
      {showReview && <AddReviewModal doctor={doctor} onClose={() => setShowReview(false)} />}
      {showSuggest && <SuggestModal doctor={doctor} onClose={() => setShowSuggest(false)} />}
    </>
  )
}
