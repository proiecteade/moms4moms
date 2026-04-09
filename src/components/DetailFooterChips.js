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

  useEffect(() => {
    setDone(!!localStorage.getItem('rec_' + doctor.id))
  }, [doctor.id])

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
