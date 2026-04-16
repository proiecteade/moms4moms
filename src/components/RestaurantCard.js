'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { avatarColor, uid } from '@/lib/helpers'
import { tipEmoji, TIP_LABEL_MAP } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthProvider'
import { useToast } from './Toast'

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function RestaurantCard({ restaurant, reviewCount = 0 }) {
  const router = useRouter()
  const { user } = useAuth() || {}
  const toast = useToast()
  const bg = avatarColor(restaurant.name)
  const init = (restaurant.name || '').slice(0, 2).toUpperCase()
  const [count, setCount] = useState(restaurant.recommendations_count || 0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    if (!supabase) return
    supabase
      .from('recommendations')
      .select('id')
      .eq('restaurant_id', restaurant.id)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          localStorage.setItem('rec_restaurant_' + restaurant.id, data.id)
          setDone(true)
        } else {
          localStorage.removeItem('rec_restaurant_' + restaurant.id)
          setDone(false)
        }
      })
  }, [restaurant.id, user])

  async function recommend(e) {
    e.preventDefault()
    e.stopPropagation()
    if (loading || done) return
    if (!user) { window.dispatchEvent(new CustomEvent('openAuth')); return }
    setLoading(true)
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('recommendations')
      .select('id')
      .eq('restaurant_id', restaurant.id)
      .eq('user_id', user.id)
      .maybeSingle()
    if (existing) {
      localStorage.setItem('rec_restaurant_' + restaurant.id, existing.id)
      setDone(true)
      setLoading(false)
      return
    }
    const recId = uid()
    const { error } = await supabase.from('recommendations').insert({ id: recId, restaurant_id: restaurant.id, user_id: user.id })
    if (!error) {
      localStorage.setItem('rec_restaurant_' + restaurant.id, recId)
      setDone(true)
      setCount(c => c + 1)
    }
    setLoading(false)
  }

  const profileUrl = `https://moms4moms.ro/unde-iesim/${restaurant.slug || restaurant.id}`
  const displayName = restaurant.name

  function copyLink(e) {
    e.stopPropagation()
    navigator.clipboard.writeText(profileUrl)
    toast('Link copiat!', 'success')
  }

  function shareWhatsApp(e) {
    e.stopPropagation()
    window.open(`https://wa.me/?text=${encodeURIComponent(`Îți recomand ${displayName}: ${profileUrl}`)}`, '_blank')
  }

  const tipLabel = TIP_LABEL_MAP[restaurant.tip] || restaurant.tip

  return (
    <div
      className="doctor-card"
      onClick={() => router.push(`/unde-iesim/${restaurant.slug || restaurant.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && router.push(`/unde-iesim/${restaurant.slug || restaurant.id}`)}
      style={{ cursor: 'pointer' }}
    >
      {restaurant.photo_url
        ? <img src={restaurant.photo_url} className="doctor-avatar" alt={displayName} style={{ objectFit: 'cover', objectPosition: 'center' }} />
        : <div className="doctor-avatar" style={{ background: bg }}>{init}</div>
      }
      <div className="doctor-info">
        <div className="doctor-name-row">
          <div className="doctor-name">{displayName}</div>
          <div className="card-share-btns" onClick={e => e.stopPropagation()}>
            <button className="card-share-btn" onClick={copyLink} title="Copiază link">🔗</button>
            <button className="card-share-btn card-share-btn-wa" onClick={shareWhatsApp} title="Share WhatsApp"><WhatsAppIcon /></button>
          </div>
        </div>
        <div className="doctor-specs">
          <span className="tip-badge">{tipEmoji(restaurant.tip)} {tipLabel}</span>
          {(restaurant.bucatarie || []).map(b => (
            <span key={b} className="cuisine-tag">{b}</span>
          ))}
        </div>
        <div className="doctor-meta">
          {(restaurant.city || '').split(',').map(c => c.trim()).filter(Boolean).map(c => (
            <span key={c} className="meta-pill">📍 {c}</span>
          ))}
          {restaurant.zona && <span className="meta-pill">· {restaurant.zona}</span>}
        </div>
        {restaurant.obs && (
          <div className="tags-row">
            {restaurant.obs.split(',').map(o => o.trim()).filter(Boolean).map((o, i) => (
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
          onClick={e => { e.stopPropagation(); router.push(`/unde-iesim/${restaurant.slug || restaurant.id}#comentarii`) }}
        >
          <span className="footer-chip-count">💬 <strong>{reviewCount}</strong></span>
          <span className="footer-chip-divider" />
          <span className="footer-chip-label">Comentează</span>
        </button>
      </div>
    </div>
  )
}
