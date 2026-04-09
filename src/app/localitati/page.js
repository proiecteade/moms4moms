import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Localități — Moms4Moms' }

export default async function LocalitatiPage() {
  const supabase = await createClient()
  const { data: doctors } = await supabase.from('doctors').select('city').eq('status', 'approved')

  const cityMap = {}
  ;(doctors || []).forEach(d => {
    ;(d.city || '').split(',').map(c => c.trim()).filter(Boolean).forEach(c => {
      cityMap[c] = (cityMap[c] || 0) + 1
    })
  })
  const cities = Object.entries(cityMap).sort((a, b) => a[0].localeCompare(b[0], 'ro'))

  return (
    <div className="home-section" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <Link href="/" className="back-btn">← Înapoi acasă</Link>
      <h1 style={{ fontWeight: 700, fontSize: 22, margin: '1rem 0 0.4rem' }}>Localități</h1>
      <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginBottom: '1.5rem' }}>
        {cities.length} {cities.length === 1 ? 'localitate' : 'localități'} cu medici recomandați
      </p>
      <div className="browse-grid">
        {cities.map(([city, count]) => (
          <Link key={city} href={`/medici?city=${encodeURIComponent(city)}`} className="browse-card">
            <div className="browse-card-name">📍 {city}</div>
            <div className="browse-card-count">{count} {count === 1 ? 'medic' : 'medici'}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
