import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Specialități — Moms4Moms' }

export default async function SpecialitatiPage() {
  const supabase = await createClient()
  const { data: doctors } = await supabase.from('doctors').select('specs').eq('status', 'approved')

  const specMap = {}
  ;(doctors || []).forEach(d => {
    ;(d.specs || []).forEach(s => {
      specMap[s] = (specMap[s] || 0) + 1
    })
  })
  const specs = Object.entries(specMap).sort((a, b) => a[0].localeCompare(b[0], 'ro'))

  return (
    <div className="home-section" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <Link href="/" className="back-btn">← Înapoi acasă</Link>
      <h1 style={{ fontWeight: 700, fontSize: 22, margin: '1rem 0 0.4rem' }}>Specialități</h1>
      <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginBottom: '1.5rem' }}>
        {specs.length} specialități medicale în baza noastră
      </p>
      <div className="browse-grid">
        {specs.map(([spec, count]) => (
          <Link key={spec} href={`/medici?spec=${encodeURIComponent(spec)}`} className="browse-card">
            <div className="browse-card-name">{spec}</div>
            <div className="browse-card-count">{count} {count === 1 ? 'medic' : 'medici'}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
