'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

// Buton de cont pentru /horoscop + reîncarcă pagina când te loghezi / deloghezi
export function HzAuthButton() {
  const { user, loading, signOut } = useAuth() || {}
  const router = useRouter()
  const prev = useRef(undefined)
  useEffect(() => {
    if (loading) return
    const id = user?.id || null
    if (prev.current !== undefined && prev.current !== id) router.refresh()
    prev.current = id
  }, [user, loading])
  if (loading) return null
  return user
    ? <button type="button" className="hz-top-link hz-top-btn" onClick={async () => { await signOut(); router.refresh() }}>Ieși din cont</button>
    : <button type="button" className="hz-top-link hz-top-btn" onClick={() => window.dispatchEvent(new CustomEvent('openAuth'))}>Intră în cont</button>
}

export function HzLoginLink({ children }) {
  return <button type="button" className="hzp-link-btn" onClick={() => window.dispatchEvent(new CustomEvent('openAuth'))}>{children}</button>
}
