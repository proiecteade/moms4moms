'use client'
import Link from 'next/link'
import Stars from './Stars'
import { avatarColor, initials, avgRating } from '@/lib/helpers'
import { useState } from 'react'
import AddReviewModal from './AddReviewModal'

export default function DoctorCard({ doctor, reviews = [] }) {
  const [showReview, setShowReview] = useState(false)
  const rating = avgRating(reviews)
  const count = reviews.length
  const bg = avatarColor(doctor.first_name + (doctor.last_name || ''))
  const init = initials(doctor.first_name, doctor.last_name)

  return (
    <>
      <Link href={`/medici/${doctor.id}`} className="doctor-card">
        <div className="doctor-avatar" style={{ background: bg }}>{init}</div>
        <div>
          <div className="doctor-name">
            Dr. {doctor.first_name}{doctor.last_name ? ' ' + doctor.last_name : ''}
          </div>
          <div className="doctor-specs">
            {(doctor.specs || []).map(s => (
              <span key={s} className="spec-badge">{s}</span>
            ))}
          </div>
          <div className="doctor-meta">
            <span className="meta-pill">📍 {doctor.city}</span>
          </div>
          {doctor.clinics?.length > 0 && (
            <div className="tags-row">
              {doctor.clinics.map(c => (
                <span key={c} className="clinic-tag">🏥 {c}</span>
              ))}
            </div>
          )}
          {doctor.obs && (
            <div className="tags-row">
              <span className="obs-tag">ℹ️ {doctor.obs}</span>
            </div>
          )}
        </div>
        <div className="doctor-card-right">
          <Stars rating={rating} />
          <div className="rating-num">{rating ? rating.toFixed(1) : '—'}</div>
          <div className="rating-count">{count} recenz{count === 1 ? 'ie' : 'ii'}</div>
          <button
            className="review-btn"
            onClick={e => { e.preventDefault(); setShowReview(true) }}
          >
            + Recenzie
          </button>
        </div>
      </Link>
      {showReview && (
        <AddReviewModal doctor={doctor} onClose={() => setShowReview(false)} />
      )}
    </>
  )
}
