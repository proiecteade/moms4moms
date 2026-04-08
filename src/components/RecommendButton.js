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
    if (done || loading) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('recommendations').insert({
      id: uid(),
      doctor_id: doctor.id,
    })
    setLoading(false)
    if (!error) {
      localStorage.setItem('rec_' + doctor.id, '1')
      setDone(true)
      setCount(c => c + 1)
    }
  }

  return (
    <div className="recommend-wrap">
{count > 0 && <div className="recommend-count">{count} {count === 1 ? 'recomandare' : 'recomandări'}</div>}
      <button
        className={`recommend-btn${done ? ' done' : ''}`}
        onClick={recommend}
        disabled={done || loading}
      >
        {loading ? '…' : done ? '✓ Ai recomandat' : '💚 Recomandă'}
      </button>
    </div>
  )
}
