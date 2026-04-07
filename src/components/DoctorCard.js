'use client'
import Link from 'next/link'
import { avatarColor, initials } from '@/lib/helpers'
import { useState } from 'react'
import AddReviewModal from './AddReviewModal'
import RecommendButton from './RecommendButton'

export default function DoctorCard({ doctor, reviews = [] }) {
  const [showReview, setShowReview] = useState(false)
  const count = reviews.length
  const bg = avatarColor(doctor.first_name + (doctor.last_name || ''))
  const init = initials(doctor.first_name, doctor.last_name)

  return (
    <>
      <Link href={`/medici/${doctor.id}`} className="doctor-card">
        {doctor.photo_url
          ? <img src={doctor.photo_url} className="doctor-avatar" alt={`Dr. ${doctor.first_name}`} style={{ objectFit: 'cover', objectPosition: 'top' }} />
          : <div className="doctor-avatar" style={{ background: bg }}>{init}</div>
        }
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
                <span key={c} className="clinic-tag">
                  🏥 {c}
                  {doctor.clinic_urls?.[c] && (
                    <a
                      href={doctor.clinic_urls[c]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clinic-link-icon"
                      onClick={e => e.stopPropagation()}
                    >↗</a>
                  )}
                </span>
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
          <RecommendButton doctor={doctor} />
          {count > 0 && (
            <div className="rating-count">{count} recenz{count === 1 ? 'ie' : 'ii'}</div>
          )}
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
