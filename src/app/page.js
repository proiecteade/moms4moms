import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DoctorCard from '@/components/DoctorCard'
import HeroSearch from '@/components/HeroSearch'
import { KNOWN_CLINIC_URLS } from '@/lib/knownClinics'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: doctors }, { data: reviews }] = await Promise.all([
    supabase.from('doctors').select('*').eq('status', 'approved'),
    supabase.from('reviews').select('*').eq('status', 'approved'),
  ])

  const docs = (doctors || []).map(d => ({
    ...d,
    clinic_urls: Object.fromEntries((d.clinics || []).map(c => [c, KNOWN_CLINIC_URLS[c] || null]))
  }))
  const revs = reviews || []

  const cities = [...new Set(docs.flatMap(d => (d.city || '').split(',').map(c => c.trim()).filter(Boolean)))].sort()
  const allSpecs = [...new Set(docs.flatMap(d => d.specs || []))]

  const suggestions = [
    ...allSpecs.sort().map(s => ({ type: 'spec', label: s })),
    ...docs.map(d => ({ type: 'doctor', label: `Dr. ${d.first_name}${d.last_name ? ' ' + d.last_name : ''}` })),
  ]

  const statDoctors = docs.length
  const statCities = cities.length
  const statSpecs = allSpecs.length

  const featured = [...docs]
    .sort((a, b) => (b.recommendations_count || 0) - (a.recommendations_count || 0))
    .slice(0, 3)
    .map(d => ({ d, reviews: revs.filter(r => r.doctor_id === d.id) }))

  return (
    <>
      <div className="hero">
        <Image
          src="/header.png"
          alt="Moms4Moms"
          width={1400}
          height={300}
          className="hero-bg"
          priority
          style={{ objectFit: 'cover', objectPosition: 'center center', width: '100%', height: 300 }}
        />
        <div className="hero-overlay">
<div className="hero-badge">💗 Recomandări verificate de mamele din comunitate</div>
          <h1>Găsește un medic <em>de încredere</em></h1>
          <HeroSearch cities={cities} suggestions={suggestions} />
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-num">{statDoctors}</div>
          <div className="stat-label">Medici listați</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">{statCities}</div>
          <div className="stat-label">{statCities === 1 ? 'Localitate' : 'Localități'}</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">{statSpecs}</div>
          <div className="stat-label">Specialități</div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: '1.25rem' }}>Cei mai recomandați</h2>
        <div className="doctors-list">
          {featured.map(({ d, reviews: dr }) => (
            <DoctorCard key={d.id} doctor={d} reviews={dr} isTop={(d.recommendations_count || 0) > 0} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/medici" className="nav-btn nav-btn-primary" style={{ fontSize: 15, padding: '10px 28px' }}>
            Vezi toți medicii →
          </Link>
        </div>
      </div>
    </>
  )
}
