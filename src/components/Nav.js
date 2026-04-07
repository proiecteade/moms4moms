'use client'
import Link from 'next/link'
import { useState } from 'react'
import AddDoctorModal from './AddDoctorModal'

export default function Nav() {
  const [showModal, setShowModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() { setMenuOpen(false) }

  return (
    <>
      <nav>
        <Link href="/" className="logo" onClick={closeMenu}>
          <img src="/logo/m4m_logo_farafundal_negru.png" alt="Moms4Moms" className="logo-img" />
          <span className="logo-tagline">recomandă medici</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-links nav-desktop">
          <Link href="/" className="nav-btn nav-btn-ghost">Acasă</Link>
          <Link href="/medici" className="nav-btn nav-btn-ghost">Medici</Link>
          <button className="nav-btn nav-btn-primary" onClick={() => setShowModal(true)}>
            + Recomandă medic
          </button>
        </div>

        {/* Burger button — mobile only */}
        <button
          className="burger-btn"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Meniu"
        >
          <span className={`burger-icon${menuOpen ? ' open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link href="/" className="mobile-menu-item" onClick={closeMenu}>Acasă</Link>
          <Link href="/medici" className="mobile-menu-item" onClick={closeMenu}>Medici</Link>
          <button className="mobile-menu-item mobile-menu-primary" onClick={() => { setShowModal(true); closeMenu() }}>
            + Recomandă medic
          </button>
        </div>
      )}

      {showModal && <AddDoctorModal onClose={() => setShowModal(false)} />}
    </>
  )
}
