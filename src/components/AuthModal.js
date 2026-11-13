'use client'
import { createClient } from '@/lib/supabase/client'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="white" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

export default function AuthModal({ onClose }) {
  const onHoroscop = typeof window !== 'undefined' && window.location.pathname.startsWith('/horoscop')
  // Țin minte unde să ne întoarcem după login, chiar dacă Supabase ne trimite pe pagina principală
  function rememberReturn() {
    try { localStorage.setItem('post_login', JSON.stringify({ to: onHoroscop ? '/horoscop' : window.location.pathname + window.location.search, at: Date.now() })) } catch {}
  }
  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname.startsWith('/horoscop') ? '/horoscop' : window.location.pathname)}`
    : ''

  async function signInWithGoogle() {
    rememberReturn()
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
  }

  async function signInWithFacebook() {
    rememberReturn()
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo, scopes: 'email,public_profile,user_link' },
    })
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <div className="modal-title">Intră în cont</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: 'var(--ink-light)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {onHoroscop
              ? 'Intră în cont ca să vezi horoscopul personalizat pentru tine și familia ta.'
              : 'Ai nevoie de un cont pentru a recomanda medici și a lăsa comentarii.'}
          </p>
          <button className="auth-modal-facebook-btn" onClick={signInWithFacebook}>
            <FacebookIcon />
            Continuă cu Facebook
          </button>
          <div className="auth-modal-divider"><span>sau</span></div>
          <button className="auth-modal-google-btn" onClick={signInWithGoogle}>
            <GoogleIcon />
            Continuă cu Google
          </button>
        </div>
      </div>
    </div>
  )
}
