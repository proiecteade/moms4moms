'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    })
    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError('Credențiale incorecte.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-title">Moms4Moms</div>
      <div className="admin-login-sub">Introdu user și parola pentru a accesa site-ul.</div>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">User</label>
          <input className="form-input" name="username" type="text" placeholder="admin" required />
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
