import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/" className="logo">
        <img src="/logo/m4m_logo_farafundal_negru.png" alt="Moms4Moms" className="logo-img" />
        <span className="logo-tagline">recomandă medici</span>
      </Link>
    </nav>
  )
}
