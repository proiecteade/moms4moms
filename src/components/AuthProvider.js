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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_IN') {
        const provider = session?.user?.app_metadata?.provider
        const hasToken = !!session?.provider_token
        const alreadyHasUrl = !!session?.user?.user_metadata?.fb_profile_url
        console.log('[Auth] SIGNED_IN provider:', provider, '| has provider_token:', hasToken, '| already has fb_profile_url:', alreadyHasUrl)

        if (provider === 'facebook' && hasToken && !alreadyHasUrl) {
          // First try identity_data (no extra API call needed)
          const fbIdentity = session.user?.identities?.find(i => i.provider === 'facebook')
          const identityLink = fbIdentity?.identity_data?.link
          console.log('[Auth] identity_data.link:', identityLink)

          if (identityLink) {
            supabase.auth.updateUser({ data: { fb_profile_url: identityLink } })
          } else {
            // Fall back to Graph API
            fetch(`https://graph.facebook.com/me?fields=link,id,name&access_token=${session.provider_token}`)
              .then(r => r.json())
              .then(fb => {
                console.log('[Auth] Graph API response:', fb)
                if (fb.link) supabase.auth.updateUser({ data: { fb_profile_url: fb.link } })
              })
              .catch(err => console.error('[Auth] Graph API error:', err))
          }
        }
      }
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
