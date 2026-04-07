import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/" className="logo">
        <span className="logo-wordmark">MOMS<span className="green">4</span>MOMS</span>
        <span className="logo-divider" />
        <span className="logo-tagline">recomandă medici</span>
      </Link>
    </nav>
  )
}
