export default function Loading() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ height: 48, width: 320, background: 'var(--border)', borderRadius: 12, marginBottom: '2rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 16, padding: '1.25rem', border: '1px solid var(--border)' }}>
            <div style={{ height: 20, width: '70%', background: 'var(--border)', borderRadius: 6, marginBottom: 10, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: 14, width: '40%', background: 'var(--border)', borderRadius: 6, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: 14, width: '55%', background: 'var(--border)', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
