export default function Loading() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem' }}>
      <div style={{ width: 220, flexShrink: 0 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ height: 16, background: 'var(--border)', borderRadius: 6, marginBottom: 12, width: i % 2 === 0 ? '80%' : '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', alignContent: 'start' }}>
        {Array.from({ length: 9 }).map((_, i) => (
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
