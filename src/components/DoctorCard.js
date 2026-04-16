'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { avatarColor, initials, sortClinics, uid } from '@/lib/helpers'
import { specEmoji } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthProvider'
import { useToast } from './Toast'

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function DoctorCard({ doctor, reviewCount = 0 }) {
  const router = useRouter()
  const { user } = useAuth() || {}
  const toast = useToast()
  const bg = avatarColor(doctor.first_name + (doctor.last_name || ''))
  const init = initials(doctor.first_name, doctor.last_name)
  const [count, setCount] = useState(doctor.recommendations_count || 0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [faved, setFaved] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    if (!supabase) return
    supabase
      .from('recommendations')
      .select('id')
      .eq('doctor_id', doctor.id)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          localStorage.setItem('rec_' + doctor.id, data.id)
          setDone(true)
        } else {
          localStorage.removeItem('rec_' + doctor.id)
          setDone(false)
        }
      })
    supabase
      .from('favorites')
      .select('id')
      .eq('doctor_id', doctor.id)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setFaved(!!data))
  }, [doctor.id, user])

  async function recommend(e) {
    e.preventDefault()
    e.stopPropagation()
    if (loading || done) return
    if (!user) { window.dispatchEvent(new CustomEvent('openAuth')); return }
    setLoading(true)
    const supabase = createClient()
    // Verificăm server-side dacă recomandarea există deja
    const { data: existing } = await supabase
      .from('recommendations')
      .select('id')
      .eq('doctor_id', doctor.id)
      .eq('user_id', user.id)
      .maybeSingle()
    if (existing) {
      localStorage.setItem('rec_' + doctor.id, existing.id)
      setDone(true)
      setLoading(false)
      return
    }
    const recId = uid()
    const { error } = await supabase.from('recommendations').insert({ id: recId, doctor_id: doctor.id, user_id: user.id })
    if (!error) {
      localStorage.setItem('rec_' + doctor.id, recId)
      setDone(true)
      setCount(c => c + 1)
    }
    setLoading(false)
  }

  async function toggleFav(e) {
    e.preventDefault()
    e.stopPropagation()
    if (favLoading) return
    if (!user) { window.dispatchEvent(new CustomEvent('openAuth')); return }
    setFavLoading(true)
    const supabase = createClient()
    if (faved) {
      await supabase.from('favorites').delete().eq('doctor_id', doctor.id).eq('user_id', user.id)
      setFaved(false)
    } else {
      await supabase.from('favorites').insert({ id: uid(), doctor_id: doctor.id, user_id: user.id })
      setFaved(true)
    }
    setFavLoading(false)
  }

  const profileUrl = `https://moms4moms.ro/medici/${doctor.slug || doctor.id}`
  const doctorName = `Dr. ${doctor.first_name}${doctor.last_name ? ' ' + doctor.last_name : ''}`

  function copyLink(e) {
    e.stopPropagation()
    navigator.clipboard.writeText(profileUrl)
    toast('Link copiat!', 'success')
  }

  function shareWhatsApp(e) {
    e.stopPropagation()
    window.open(`https://wa.me/?text=${encodeURIComponent(`Îți recomand pe ${doctorName}: ${profileUrl}`)}`, '_blank')
  }

  return (
    <div
      className="doctor-card"
      onClick={() => router.push(`/medici/${doctor.slug || doctor.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && router.push(`/medici/${doctor.slug || doctor.id}`)}
      style={{ cursor: 'pointer' }}
    >
      {doctor.photo_url
        ? <img src={doctor.photo_url} className="doctor-avatar" alt={`Dr. ${doctor.first_name}`} style={{ objectFit: 'cover', objectPosition: 'top' }} />
        : <div className="doctor-avatar" style={{ background: bg }}>{init}</div>
      }
      <div className="doctor-info">
        <div className="doctor-name-row">
          <div className="doctor-name">
            Dr. {doctor.first_name}{doctor.last_name ? ' ' + doctor.last_name : ''}
          </div>
          <div className="card-share-btns" onClick={e => e.stopPropagation()}>
            <button
              className={`card-share-btn card-fav-btn${faved ? ' faved' : ''}`}
              onClick={toggleFav}
              title={faved ? 'Scoate din favorite' : 'Adaugă la favorite'}
              disabled={favLoading}
            >
              {faved ? '♥' : '♡'}
            </button>
            <button className="card-share-btn" onClick={copyLink} title="Copiază link">🔗</button>
            <button className="card-share-btn card-share-btn-wa" onClick={shareWhatsApp} title="Share WhatsApp"><WhatsAppIcon /></button>
          </div>
        </div>
        <div className="doctor-specs">
          {(doctor.specs || []).map(s => (
            <Link key={s} href={`/medici?spec=${encodeURIComponent(s)}`} className="spec-badge" onClick={e => e.stopPropagation()}>
              {specEmoji(s)} {s}
            </Link>
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
          onClick={e => { e.stopPropagation(); router.push(`/medici/${doctor.slug || doctor.id}#comentarii`) }}
        >
          <span className="footer-chip-count">💬 <strong>{reviewCount}</strong></span>
          <span className="footer-chip-divider" />
          <span className="footer-chip-label">Comentează</span>
        </button>
      </div>
    </div>
  )
}
