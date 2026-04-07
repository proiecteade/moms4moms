export default function Footer() {
  return (
    <footer style={{
      background: 'white',
      borderTop: '1px solid var(--border)',
      padding: '2rem 1.5rem',
      marginTop: '3rem',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.5px', color: 'var(--ink)' }}>
            MOMS<span style={{ color: 'var(--green)' }}>4</span>MOMS <span style={{ fontWeight: 400, color: 'var(--ink-light)' }}>recomandă</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-light)', marginTop: 4 }}>
            Recomandări verificate de mame, pentru mame
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-faint)', textAlign: 'right' }}>
          © 2025 · Recomandări verificate de mame, pentru mame
        </div>
      </div>
    </footer>
  )
}
