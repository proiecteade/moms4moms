export default function Constellation({ sign, size = 120, className = '' }) {
  const id = `g-${sign.slug}`
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`hz-const ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor="#fff" />
          <stop offset="40%" stopColor="#ffe9a8" />
          <stop offset="100%" stopColor="rgba(255,233,168,0)" />
        </radialGradient>
      </defs>
      {sign.lines.map(([a, b], i) => (
        <line key={i} x1={sign.stars[a][0]} y1={sign.stars[a][1]} x2={sign.stars[b][0]} y2={sign.stars[b][1]}
          className="hz-const-line" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
      {sign.stars.map(([x, y], i) => (
        <g key={i} className="hz-const-star" style={{ animationDelay: `${(i % 5) * 0.6}s` }}>
          <circle cx={x} cy={y} r="5" fill={`url(#${id})`} />
          <circle cx={x} cy={y} r="1.3" fill="#fff" />
        </g>
      ))}
    </svg>
  )
}
