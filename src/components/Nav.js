'use client'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthProvider'

export default function Nav() {
  const { user, signOut } = useAuth() || {}
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const initials = user?.user_metadata?.full_name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    || user?.email?.[0]?.toUpperCase()
    || '?'

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav>
      <Link href="/" className="logo">
        <span className="logo-wordmark">MOMS<span className="green">4</span>MOMS recomandă <span className="logo-medici">medici</span></span>
      </Link>
      <div className="nav-auth" ref={dropdownRef}>
        {user ? (
          <>
            <button className="user-avatar-btn" onClick={() => setShowDropdown(d => !d)}>
              {initials}
            </button>
            {showDropdown && (
              <div className="user-dropdown">
                <div className="user-dropdown-email">{user.email}</div>
                <button className="user-dropdown-signout" onClick={() => { signOut(); setShowDropdown(false) }}>
                  Ieși din cont
                </button>
              </div>
            )}
          </>
        ) : (
          <button className="nav-btn nav-btn-ghost nav-auth-btn" onClick={() => window.dispatchEvent(new CustomEvent('openAuth'))}>
            Intră în cont
          </button>
        )}
      </div>
    </nav>
  )
}
