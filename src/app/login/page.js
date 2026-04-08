'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const email = e.target.email.value
    const password = e.target.password.value
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email sau parolă incorectă.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-title">Moms4Moms</div>
      <div className="admin-login-sub">Introdu email și parola pentru a accesa site-ul.</div>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" placeholder="admin@moms4moms.ro" required />
        </div>
        <div className="form-group">
          <label className="form-label">Parolă</label>
          <input className="form-input" name="password" type="password" placeholder="••••••••" required />
        </div>
        {error && <div style={{ color: 'var(--error, #e53e3e)', fontSize: '13px', marginBottom: '1rem' }}>{error}</div>}
        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? 'Se conectează…' : 'Intră'}
        </button>
      </form>
    </div>
  )
}
