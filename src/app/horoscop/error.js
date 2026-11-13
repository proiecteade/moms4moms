'use client'
import Link from 'next/link'

export default function HoroscopError({ reset }) {
  return (
    <section className="hz-hero">
      <span className="hz-eyebrow">ups</span>
      <h1 className="hz-h1" style={{ fontSize: 'clamp(32px,6vw,56px)' }}>Stelele s-au încurcat puțin</h1>
      <p className="hz-lead">Ceva nu s-a încărcat cum trebuie. Încearcă din nou. Dacă se repetă, verifică datele familiei.</p>
      <div className="hz-hero-actions">
        <button type="button" className="hz-btn" onClick={() => reset()}>Încearcă din nou</button>
        <Link href="/horoscop?familia=1" className="hz-btn hz-btn-ghost">Editează datele familiei</Link>
        <Link href="/horoscop?toate=1" className="hz-btn hz-btn-ghost">Toate zodiile</Link>
      </div>
    </section>
  )
}
