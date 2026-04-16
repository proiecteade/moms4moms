'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthProvider'

export default function DetailFooterChips({ doctor, reviewCount = 0, entityType = 'doctor' }) {
  const { user } = useAuth() || {}
  const [count, setCount] = useState(doctor.recommendations_count || 0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const lsKey = entityType === 'restaurant' ? 'rec_restaurant_' + doctor.id : 'rec_' + doctor.id
  useEffect(() => {
    setDone(!!localStorage.getItem(lsKey))
  }, [doctor.id, lsKey])

  async function recommend(e) {
    e.preventDefault()
    if (loading || done) return
    if (!user) { window.dispatchEvent(new CustomEvent('openAuth')); return }
    setLoading(true)
    const supabase = createClient()
    const recId = uid()
    const idField = entityType === 'restaurant' ? 'restaurant_id' : 'doctor_id'
    const { error } = await supabase.from('recommendations').insert({ id: recId, [idField]: doctor.id, user_id: user.id })
    if (!error) {
      localStorage.setItem(lsKey, recId)
      setDone(true)
      setCount(c => c + 1)
    }
    setLoading(false)
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
    </div>
  )
}
