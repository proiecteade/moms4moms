import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/" className="logo">
        <span className="logo-wordmark">MOMS<span className="green">4</span>MOMS recomandă <span className="logo-medici">medici</span></span>
      </Link>
    </nav>
  )
}
