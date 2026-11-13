'use client'
import { useState } from 'react'

export default function ShareButton({ title, text }) {
  const [done, setDone] = useState(false)
  async function share() {
    const url = window.location.href.split('?')[0]
    try {
      if (navigator.share) { await navigator.share({ title, text, url }); return }
      await navigator.clipboard.writeText(url)
      setDone(true); setTimeout(() => setDone(false), 2000)
    } catch {}
  }
  return <button type="button" className="hz-btn hz-btn-ghost" onClick={share}>{done ? 'Link copiat ✓' : 'Trimite unei prietene ↗'}</button>
}
