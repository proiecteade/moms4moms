'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uid } from '@/lib/helpers'

export default function RecommendButton({ doctor }) {
  const [count, setCount] = useState(doctor.recommendations_count || 0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setDone(!!localStorage.getItem('rec_' + doctor.id))
  }, [doctor.id])

  async function toggle(e) {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setLoading(true)
    const supabase = createClient()

    if (done) {
      const recId = localStorage.getItem('rec_' + doctor.id)
      if (recId && recId !== '1') {
        const { error } = await supabase.from('recommendations').delete().eq('id', recId)
        if (error) { setLoading(false); return }
      }
      localStorage.removeItem('rec_' + doctor.id)
      setDone(false)
      setCount(c => Math.max(0, c - 1))
    } else {
      const recId = uid()
      const { error } = await supabase.from('recommendations').insert({ id: recId, doctor_id: doctor.id })
      if (!error) {
        localStorage.setItem('rec_' + doctor.id, recId)
        setDone(true)
        setCount(c => c + 1)
      }
    }
    setLoading(false)
  }

  return (
    <div className="recommend-wrap">
      {count > 0 && <div className="recommend-count">{count} {count === 1 ? 'recomandare' : 'recomandări'}</div>}
      <button
        className={`recommend-btn${done ? ' done' : ''}`}
        onClick={toggle}
        disabled={loading}
      >
        {loading ? '…' : done ? '✓ Recomandat' : 'Recomandă'}
      </button>
    </div>
  )
}
