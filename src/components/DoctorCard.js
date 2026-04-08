'use client'
import Link from 'next/link'
import { avatarColor, initials, sortClinics } from '@/lib/helpers'
import RecommendButton from './RecommendButton'

export default function DoctorCard({ doctor, reviews = [], isTop = false }) {
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
            {(doctor.city || '').split(',').map(c => c.trim()).filter(Boolean).map(c => (
              <span key={c} className="meta-pill">📍 {c}</span>
            ))}
          </div>
          {doctor.clinics?.length > 0 && (
            <div className="tags-row">
              {sortClinics(doctor.clinics).map(c => (
                doctor.clinic_urls?.[c]
                  ? <a key={c} href={doctor.clinic_urls[c]} target="_blank" rel="noopener noreferrer" className="clinic-tag clinic-tag-link" onClick={e => e.stopPropagation()}>🏥 {c}</a>
                  : <span key={c} className="clinic-tag">🏥 {c}</span>
              ))}
            </div>
          )}
          {doctor.obs && (
            <div className="tags-row">
              {doctor.obs.split(',').map(o => o.trim()).filter(Boolean).map((o, i) => (
                <span key={i} className="obs-tag">ℹ️ {o}</span>
              ))}
            </div>
          )}
        </div>
        <div className="doctor-card-right">
          <RecommendButton doctor={doctor} isTop={isTop} />
          {count > 0 && (
            <div className="rating-count">{count} {count === 1 ? 'experiență' : 'experiențe'}</div>
          )}
        </div>
      </Link>
    </>
  )
}
