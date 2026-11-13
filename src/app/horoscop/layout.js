import Link from 'next/link'
import './horoscop.css'


export const metadata = {
  title: 'Horoscop lunar — Moms4Moms',
  description: 'Horoscopul lunii pentru fiecare zodie, cu sfaturi pentru mămici și perioadele importante ale lunii.',
  openGraph: {
    title: 'Horoscop lunar — Moms4Moms',
    description: 'Horoscopul lunii pentru fiecare zodie, cu sfaturi pentru mămici și perioadele importante ale lunii.',
    url: 'https://moms4moms.ro/horoscop',
  },
}

export default function HoroscopLayout({ children }) {
  return (
    <div className="hz">
      <div className="hz-sky" aria-hidden="true">
        <div className="hz-stars hz-stars-1" />
        <div className="hz-stars hz-stars-2" />
        <div className="hz-stars hz-stars-3" />
        <div className="hz-shooting" />
        <div className="hz-nebula" />
      </div>
      <header className="hz-top">
        <Link href="/horoscop" className="hz-brand">
          <span className="hz-brand-moon">☾</span> Horoscop <span className="hz-brand-sub">by Moms4Moms</span>
        </Link>
        <Link href="/" className="hz-top-link">moms4moms.ro →</Link>
      </header>
      <main className="hz-main">{children}</main>
      <footer className="hz-foot">
        <p>Horoscopul are scop de divertisment și inspirație. Pentru decizii importante, ascultă-ți inima și specialiștii.</p>
        <p><Link href="/">Moms4Moms</Link> · <Link href="/horoscop">Horoscop</Link> · <Link href="/contact">Contact</Link></p>
      </footer>
    </div>
  )
}
