'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uid } from '@/lib/helpers'
import { useAuth } from './AuthProvider'

export default function DetailFooterChips({ doctor, reviewCount = 0 }) {
  const { user } = useAuth() || {}
  const [count, setCount] = useState(doctor.recommendations_count || 0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [faved, setFaved] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  useEffect(() => {
    setDone(!!localStorage.getItem('rec_' + doctor.id))
  }, [doctor.id])

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    if (!supabase) return
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

  async function toggleFav(e) {
    e.preventDefault()
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

  function scrollToComments(e) {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('openComments'))
    setTimeout(() => document.getElementById('comentarii')?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return (
    <div className="card-footer-bar detail-footer-chips">
      <button
        className={`footer-action-chip${done ? ' done' : ''}`}
        onClick={recommend}
        disabled={loading || done}
      >
        <span className="footer-chip-count">👍 <strong>{count}</strong></span>
        <span className="footer-chip-divider" />
        <span className="footer-chip-label">{loading ? '…' : done ? 'Recomandat' : 'Recomandă'}</span>
      </button>
      <button className="footer-action-chip" onClick={scrollToComments}>
        <span className="footer-chip-count">💬 <strong>{reviewCount}</strong></span>
        <span className="footer-chip-divider" />
        <span className="footer-chip-label">Comentează</span>
      </button>
      <button
        className={`footer-action-chip card-fav-btn${faved ? ' faved' : ''}`}
        onClick={toggleFav}
        disabled={favLoading}
        title={faved ? 'Scoate din favorite' : 'Adaugă la favorite'}
      >
        <span className="footer-chip-count">{faved ? '♥' : '♡'}</span>
        <span className="footer-chip-divider" />
        <span className="footer-chip-label">{faved ? 'Salvat' : 'Salvează'}</span>
      </button>
    </div>
  )
}
