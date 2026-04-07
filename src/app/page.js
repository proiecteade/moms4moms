import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DoctorCard from '@/components/DoctorCard'
import HeroSearch from '@/components/HeroSearch'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: doctors }, { data: reviews }] = await Promise.all([
    supabase.from('doctors').select('*').eq('status', 'approved'),
    supabase.from('reviews').select('*').eq('status', 'approved'),
  ])

  const docs = doctors || []
  const revs = reviews || []

  const cities = [...new Set(docs.map(d => d.city))].sort()
  const allSpecs = [...new Set(docs.flatMap(d => d.specs || []))]

  const statDoctors = docs.length
  const statReviews = revs.length
  const statCities = cities.length
  const statSpecs = allSpecs.length

  const featured = docs
    .map(d => {
      const dr = revs.filter(r => r.doctor_id === d.id)
      const rating = dr.length ? dr.reduce((s, r) => s + r.rating, 0) / dr.length : 0
      return { d, rating, count: dr.length, reviews: dr }
    })
    .filter(x => x.count > 0)
    .sort((a, b) => b.rating - a.rating || b.count - a.count)
    .slice(0, 3)

  const featuredDocs = featured.length > 0
    ? featured
    : docs.slice(0, 3).map(d => ({ d, rating: 0, count: 0, reviews: [] }))

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
          <div className="hero-badge">💗 Recomandări verificate de mame, pentru mame</div>
          <h1>Găsește un medic <em>de încredere</em></h1>
          <HeroSearch cities={cities} />
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-num">{statDoctors}</div>
          <div className="stat-label">Medici listați</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">{statReviews}</div>
          <div className="stat-label">Recenzii</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">{statCities}</div>
          <div className="stat-label">Localități</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">{statSpecs}</div>
          <div className="stat-label">Specialități</div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: '1.25rem' }}>Cei mai bine evaluați</h2>
        <div className="doctors-list">
          {featuredDocs.map(({ d, reviews: dr }) => (
            <DoctorCard key={d.id} doctor={d} reviews={dr} />
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
