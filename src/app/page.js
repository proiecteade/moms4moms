import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DoctorCard from '@/components/DoctorCard'
import RestaurantCard from '@/components/RestaurantCard'
import { KNOWN_CLINIC_URLS } from '@/lib/knownClinics'
import { TIP_LABEL_MAP } from '@/lib/constants'

export default async function HomePage() {
  const supabase = await createClient()

  let doctors = [], recs = [], reviews = []
  let restaurants = [], restRecs = [], restReviews = []
  try {
    const [{ data: d }, { data: r }, { data: rv }, { data: rest }, { data: rr }, { data: rrv }] = await Promise.all([
      supabase.from('doctors').select('*').eq('status', 'approved'),
      supabase.from('recommendations').select('doctor_id').not('doctor_id', 'is', null),
      supabase.from('reviews').select('doctor_id').eq('status', 'approved').not('doctor_id', 'is', null),
      supabase.from('restaurants').select('*').eq('status', 'approved'),
      supabase.from('recommendations').select('restaurant_id').not('restaurant_id', 'is', null),
      supabase.from('reviews').select('restaurant_id').eq('status', 'approved').not('restaurant_id', 'is', null),
    ])
    doctors = d || []
    recs = r || []
    reviews = rv || []
    restaurants = rest || []
    restRecs = rr || []
    restReviews = rrv || []
  } catch {
    // Baza de date indisponibilă
  }

  // Doctor stats & featured
  const reviewCountMap = {}
  reviews.forEach(r => { reviewCountMap[r.doctor_id] = (reviewCountMap[r.doctor_id] || 0) + 1 })
  const recCountMap = {}
  recs.forEach(r => { recCountMap[r.doctor_id] = (recCountMap[r.doctor_id] || 0) + 1 })
  const docs = doctors.map(d => ({
    ...d,
    recommendations_count: recCountMap[d.id] || 0,
    clinic_urls: Object.fromEntries((d.clinics || []).map(c => [c, KNOWN_CLINIC_URLS[c] || null]))
  }))
  const docCities = [...new Set(docs.flatMap(d => (d.city || '').split(',').map(c => c.trim()).filter(Boolean)))]
  const featuredDocs = [...docs]
    .sort((a, b) => {
      const diff = (b.recommendations_count || 0) - (a.recommendations_count || 0)
      if (diff !== 0) return diff
      return (a.last_name || '').localeCompare(b.last_name || '', 'ro')
    })
    .slice(0, 5)

  // Restaurant stats & featured
  const restReviewCountMap = {}
  restReviews.forEach(r => { restReviewCountMap[r.restaurant_id] = (restReviewCountMap[r.restaurant_id] || 0) + 1 })
  const restRecCountMap = {}
  restRecs.forEach(r => { restRecCountMap[r.restaurant_id] = (restRecCountMap[r.restaurant_id] || 0) + 1 })
  const rests = restaurants.map(r => ({
    ...r,
    recommendations_count: restRecCountMap[r.id] || 0,
  }))
  const restCities = [...new Set(rests.flatMap(r => (r.city || '').split(',').map(c => c.trim()).filter(Boolean)))]
  const featuredRests = [...rests]
    .sort((a, b) => (b.recommendations_count || 0) - (a.recommendations_count || 0))
    .slice(0, 5)

  const allCities = [...new Set([...docCities, ...restCities])]

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
          <h1>Recomandări de la mame, <em>pentru mame</em></h1>
        </div>
      </div>

      {/* Category cards hub */}
      <div className="category-hub">
        <Link href="/medici" className="category-card category-card-teal">
          <div className="category-emoji">👩‍⚕️</div>
          <div className="category-title">Medici</div>
          <div className="category-desc">Găsește un medic de încredere</div>
          <div className="category-stat">{docs.length} medici în {docCities.length} localități</div>
          <span className="category-cta">Caută un medic →</span>
        </Link>
        <Link href="/unde-iesim" className="category-card category-card-rose">
          <div className="category-emoji">🍽️</div>
          <div className="category-title">Unde ieșim</div>
          <div className="category-desc">Descoperă restaurante recomandate</div>
          <div className="category-stat">{rests.length} locuri în {restCities.length} localități</div>
          <span className="category-cta">Caută un loc →</span>
        </Link>
      </div>

      <div className="stats-row">
        <Link href="/medici" className="stat-item stat-item-link">
          <div className="stat-num">{docs.length}</div>
          <div className="stat-label">Medici</div>
        </Link>
        <Link href="/unde-iesim" className="stat-item stat-item-link">
          <div className="stat-num">{rests.length}</div>
          <div className="stat-label">Locuri</div>
        </Link>
        <Link href="/localitati" className="stat-item stat-item-link">
          <div className="stat-num">{allCities.length}</div>
          <div className="stat-label">{allCities.length === 1 ? 'Localitate' : 'Localități'}</div>
        </Link>
      </div>

      {featuredDocs.length > 0 && (
        <div className="home-section">
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: '1.25rem' }}>Cei mai recomandați medici</h2>
          <div className="doctors-grid-home">
            {featuredDocs.map(d => (
              <DoctorCard key={d.id} doctor={d} reviewCount={reviewCountMap[d.id] || 0} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/medici" className="nav-btn nav-btn-primary" style={{ fontSize: 15, padding: '10px 28px' }}>
              Vezi toți medicii →
            </Link>
          </div>
        </div>
      )}

      {featuredRests.length > 0 && (
        <div className="home-section">
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: '1.25rem' }}>Cele mai recomandate locuri</h2>
          <div className="doctors-grid-home">
            {featuredRests.map(r => (
              <RestaurantCard key={r.id} restaurant={r} reviewCount={restReviewCountMap[r.id] || 0} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/unde-iesim" className="nav-btn nav-btn-primary" style={{ fontSize: 15, padding: '10px 28px' }}>
              Vezi toate locurile →
            </Link>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-faint)', padding: '6px 1rem', background: 'var(--cream)' }}>
        ℹ️ Recomandările aparțin comunității și nu reprezintă sfaturi medicale profesioniste.
      </div>
    </>
  )
}
