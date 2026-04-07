'use client'
import Link from 'next/link'
import { useState } from 'react'
import AddDoctorModal from './AddDoctorModal'

export default function Nav() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <nav>
        <Link href="/" className="logo">
          <div className="logo-wordmark">MOMS<span className="green">4</span>MOMS <span style={{ fontWeight: 400, color: 'var(--ink-light)' }}>recomandă</span></div>
          <div className="logo-divider" />
          <div style={{ background: 'var(--teal)', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, letterSpacing: '0.3px' }}>medici</div>
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-btn nav-btn-ghost">Acasă</Link>
          <Link href="/medici" className="nav-btn nav-btn-ghost">Medici</Link>
          <button className="nav-btn nav-btn-primary" onClick={() => setShowModal(true)}>
            + Recomandă medic
          </button>
          <Link href="/admin" className="nav-btn nav-btn-ghost">Admin</Link>
        </div>
      </nav>
      {showModal && <AddDoctorModal onClose={() => setShowModal(false)} />}
    </>
  )
}
