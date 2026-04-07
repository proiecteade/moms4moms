export default function Stars({ rating, size = '12px', align = 'right' }) {
  return (
    <div className="stars-display" style={{ justifyContent: align === 'left' ? 'flex-start' : 'flex-end' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star${rating >= i - 0.5 ? ' filled' : ''}`} style={{ fontSize: size }}>★</span>
      ))}
    </div>
  )
}
