import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '3rem 1.5rem',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: 'var(--ink)' }}>Pagina nu a fost găsită</h1>
      <p style={{ fontSize: 15, color: 'var(--ink-light)', marginBottom: 28, maxWidth: 380 }}>
        Se pare că pagina pe care o cauți nu există sau a fost mutată.
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        background: 'var(--teal)',
        color: 'white',
        fontWeight: 700,
        fontSize: 15,
        padding: '10px 24px',
        borderRadius: 10,
        textDecoration: 'none',
      }}>
        Înapoi acasă
      </Link>
    </div>
  )
}
