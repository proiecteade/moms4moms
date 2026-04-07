import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/" className="logo">
        <span className="logo-wordmark">MOMS<span className="green">4</span>MOMS recomandă</span>
      </Link>
      <Link href="/medici" className="nav-btn nav-btn-primary">Medici</Link>
    </nav>
  )
}
