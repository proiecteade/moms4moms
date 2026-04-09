'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { avatarColor, initials, sortClinics, uid } from '@/lib/helpers'
import { specEmoji } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthProvider'

export default function DoctorCard({ doctor, reviewCount = 0 }) {
  const router = useRouter()
  const { user } = useAuth() || {}
  const bg = avatarColor(doctor.first_name + (doctor.last_name || ''))
  const init = initials(doctor.first_name, doctor.last_name)
  const [count, setCount] = useState(doctor.recommendations_count || 0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setDone(!!localStorage.getItem('rec_' + doctor.id))
  }, [doctor.id])

  async function recommend(e) {
    e.preventDefault()
    e.stopPropagation()
    if (loading || done) return
    if (!user) { window.dispatchEvent(new CustomEvent('openAuth')); return }
    setLoading(true)
    const supabase = createClient()
    const recId = uid()
    const { error } = await supabase.from('recommendations').insert({ id: recId, doctor_id: doctor.id, user_id: user.id })
    if (!error) {
      localStorage.setItem('rec_' + doctor.id, recId)
      setDone(true)
      setCount(c => c + 1)
    }
    setLoading(false)
  }

  return (
    <div
      className="doctor-card"
      onClick={() => router.push(`/medici/${doctor.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && router.push(`/medici/${doctor.id}`)}
      style={{ cursor: 'pointer' }}
    >
      {doctor.photo_url
        ? <img src={doctor.photo_url} className="doctor-avatar" alt={`Dr. ${doctor.first_name}`} style={{ objectFit: 'cover', objectPosition: 'top' }} />
        : <div className="doctor-avatar" style={{ background: bg }}>{init}</div>
      }
      <div className="doctor-info">
        <div className="doctor-name">
          Dr. {doctor.first_name}{doctor.last_name ? ' ' + doctor.last_name : ''}
        </div>
        <div className="doctor-specs">
          {(doctor.specs || []).map(s => (
            <span key={s} className="spec-badge">{specEmoji(s)} {s}</span>
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
      <div className="card-footer-bar" onClick={e => e.stopPropagation()}>
        <button
          className={`footer-action-chip${done ? ' done' : ''}`}
          onClick={recommend}
          disabled={loading || done}
        >
          <span className="footer-chip-count">👍 <strong>{count}</strong></span>
          <span className="footer-chip-divider" />
          <span className="footer-chip-label">{loading ? '…' : done ? 'Recomandat' : 'Recomandă'}</span>
        </button>
        <button
          className="footer-action-chip"
          onClick={e => { e.stopPropagation(); router.push(`/medici/${doctor.id}#comentarii`) }}
        >
          <span className="footer-chip-count">💬 <strong>{reviewCount}</strong></span>
          <span className="footer-chip-divider" />
          <span className="footer-chip-label">Comentează</span>
        </button>
      </div>
    </div>
  )
}
