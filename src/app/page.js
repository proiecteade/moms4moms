import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DoctorCard from '@/components/DoctorCard'
import HeroSearch from '@/components/HeroSearch'
import { KNOWN_CLINIC_URLS } from '@/lib/knownClinics'

export default async function HomePage() {
  const supabase = await createClient()

  let doctors = [], recs = [], reviews = []
  try {
    const [{ data: d }, { data: r }, { data: rv }] = await Promise.all([
      supabase.from('doctors').select('*').eq('status', 'approved'),
      supabase.from('recommendations').select('doctor_id'),
      supabase.from('reviews').select('doctor_id').eq('status', 'approved'),
    ])
    doctors = d || []
    recs = r || []
    reviews = rv || []
  } catch {
    // Baza de date indisponibilă — redăm pagina cu date goale
  }

  const reviewCountMap = {}
  reviews.forEach(r => { reviewCountMap[r.doctor_id] = (reviewCountMap[r.doctor_id] || 0) + 1 })

  const recCountMap = {}
  recs.forEach(r => { recCountMap[r.doctor_id] = (recCountMap[r.doctor_id] || 0) + 1 })

  const docs = doctors.map(d => ({
    ...d,
    recommendations_count: recCountMap[d.id] || 0,
    clinic_urls: Object.fromEntries((d.clinics || []).map(c => [c, KNOWN_CLINIC_URLS[c] || null]))
  }))

  const cities = [...new Set(docs.flatMap(d => (d.city || '').split(',').map(c => c.trim()).filter(Boolean)))].sort()
  const allSpecs = [...new Set(docs.flatMap(d => d.specs || []))]

  const statDoctors = docs.length
  const statCities = cities.length
  const statSpecs = allSpecs.length

  const featured = [...docs]
    .sort((a, b) => {
      const diff = (b.recommendations_count || 0) - (a.recommendations_count || 0)
      if (diff !== 0) return diff
      return (a.last_name || '').localeCompare(b.last_name || '', 'ro')
    })
    .slice(0, 10)

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
          style={{ objectFit: 'cover', objectPosition: 'center center', width: '100%' }}
        />
        <div className="hero-overlay">
<div className="hero-badge">💗 Recomandări verificate de mamele din comunitate</div>
          <h1>Găsește un medic <em>de încredere</em></h1>
          <HeroSearch cities={cities} specs={allSpecs.sort()} />
        </div>
      </div>

      <div className="stats-row">
        <Link href="/medici" className="stat-item stat-item-link">
          <div className="stat-num">{statDoctors}</div>
          <div className="stat-label">Medici listați</div>
        </Link>
        <Link href="/localitati" className="stat-item stat-item-link">
          <div className="stat-num">{statCities}</div>
          <div className="stat-label">{statCities === 1 ? 'Localitate' : 'Localități'}</div>
        </Link>
        <Link href="/specialitati" className="stat-item stat-item-link">
          <div className="stat-num">{statSpecs}</div>
          <div className="stat-label">Specialități</div>
        </Link>
      </div>

      <div className="home-section">
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: '1.25rem' }}>Cei mai recomandați</h2>
        <div className="doctors-grid-home">
          {featured.map(d => (
            <DoctorCard key={d.id} doctor={d} reviewCount={reviewCountMap[d.id] || 0} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/medici" className="nav-btn nav-btn-primary" style={{ fontSize: 15, padding: '10px 28px' }}>
            Vezi toți medicii →
          </Link>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-faint)', padding: '6px 1rem', background: 'var(--cream)' }}>
        ℹ️ Recomandările aparțin comunității și nu reprezintă sfaturi medicale profesioniste.
      </div>
    </>
  )
}
