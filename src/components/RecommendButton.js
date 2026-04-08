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

  async function recommend(e) {
    e.preventDefault()
    e.stopPropagation()
    if (loading || done) return
    setLoading(true)
    const supabase = createClient()
    const recId = uid()
    const { error } = await supabase.from('recommendations').insert({ id: recId, doctor_id: doctor.id })
    if (!error) {
      localStorage.setItem('rec_' + doctor.id, recId)
      setDone(true)
      setCount(c => c + 1)
    }
    setLoading(false)
  }

  return (
    <div className="recommend-wrap">
      {count > 0 && <div className="recommend-count">{count} {count === 1 ? 'recomandare' : 'recomandări'}</div>}
      <button
        className={`recommend-btn${done ? ' done' : ''}`}
        onClick={recommend}
        disabled={loading || done}
      >
        {loading ? '…' : done ? '✓ Recomandat' : 'Recomandă'}
      </button>
    </div>
  )
}
