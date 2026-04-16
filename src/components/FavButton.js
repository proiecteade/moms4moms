'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uid } from '@/lib/helpers'
import { useAuth } from './AuthProvider'

export default function FavButton({ doctor }) {
  const { user } = useAuth() || {}
  const [faved, setFaved] = useState(false)
  const [loading, setLoading] = useState(false)

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

  async function toggle(e) {
    e.preventDefault()
    if (loading) return
    if (!user) { window.dispatchEvent(new CustomEvent('openAuth')); return }
    setLoading(true)
    const supabase = createClient()
    if (faved) {
      await supabase.from('favorites').delete().eq('doctor_id', doctor.id).eq('user_id', user.id)
      setFaved(false)
    } else {
      await supabase.from('favorites').insert({ id: uid(), doctor_id: doctor.id, user_id: user.id })
      setFaved(true)
    }
    setLoading(false)
  }

  return (
    <button
      className={`detail-fav-btn${faved ? ' faved' : ''}`}
      onClick={toggle}
      disabled={loading}
      title={faved ? 'Scoate din favorite' : 'Adaugă la favorite'}
    >
      {faved ? '♥' : '♡'}
    </button>
  )
}
