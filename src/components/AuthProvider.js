'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AuthModal from './AuthModal'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })

    const openHandler = () => setShowModal(true)
    window.addEventListener('openAuth', openHandler)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('openAuth', openHandler)
    }
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase?.auth.signOut()
  }

  function openAuthModal() { setShowModal(true) }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, openAuthModal }}>
      {children}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
