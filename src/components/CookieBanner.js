'use client'
import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('cookie_consent') === null) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'true')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'false')
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' })
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner">
      <span className="cookie-banner-text">
        Folosim cookies pentru a înțelege cum este utilizat site-ul (Google Analytics). Datele sunt anonime.{' '}
        <a href="/privacy" className="cookie-banner-link">Află mai mult</a>
      </span>
      <div className="cookie-banner-btns">
        <button className="cookie-btn-accept" onClick={accept}>Accept</button>
        <button className="cookie-btn-decline" onClick={decline}>Refuz</button>
      </div>
    </div>
  )
}
