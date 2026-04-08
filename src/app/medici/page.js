import { createClient } from '@/lib/supabase/server'
import { normalize } from '@/lib/helpers'
import DoctorCard from '@/components/DoctorCard'
import FilterSidebar from '@/components/FilterSidebar'
import SortSelect from '@/components/SortSelect'
import SpecChipsBar from '@/components/SpecChipsBar'
import { Suspense } from 'react'
import Link from 'next/link'
import { KNOWN_CLINIC_URLS } from '@/lib/knownClinics'

export const metadata = { title: 'Medici — Moms4Moms' }

const PER_PAGE = 24

export default async function MediciPage({ searchParams }) {
  const params = await searchParams
  const q = (params.q || '').toLowerCase()
  const city = params.city || ''
  const spec = params.spec || ''
  const sort = params.sort || 'recommended'
  const page = Math.max(1, parseInt(params.page || '1'))

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
  const allSpecs = [...new Set(docs.flatMap(d => d.specs || []))].sort()

  const topDocIds = new Set(
    [...docs]
      .sort((a, b) => (b.recommendations_count || 0) - (a.recommendations_count || 0))
      .slice(0, 3)
      .filter(d => (d.recommendations_count || 0) > 0)
      .map(d => d.id)
  )

  function getReviews(id) { return revs.filter(r => r.doctor_id === id) }

  const nq = normalize(q)
  let filtered = docs
  if (q) {
    const queryTokens = nq.split(/\s+/).filter(Boolean)
    filtered = filtered.filter(d => {
      const tokens = [
        ...normalize(d.first_name + ' ' + d.last_name).split(/[\s\-]+/),
        ...(d.specs || []).flatMap(s => normalize(s).split(/[\s\/\-]+/)),
        ...(d.clinics || []).flatMap(c => normalize(c).split(/[\s\-]+/)),
        ...normalize(d.city).split(/[\s,\-]+/),
      ].filter(Boolean)
      return queryTokens.every(qt => tokens.some(t => t.includes(qt)))
    })
  }
  if (city) filtered = filtered.filter(d =>
    (d.city || '').split(',').map(c => c.trim()).includes(city)
  )
  if (spec) filtered = filtered.filter(d => (d.specs || []).includes(spec))

  filtered.sort((a, b) => {
    if (sort === 'reviews') return getReviews(b.id).length - getReviews(a.id).length
    if (sort === 'name') return (a.last_name + a.first_name).localeCompare(b.last_name + b.first_name, 'ro')
    // default: recommended
    return (b.recommendations_count || 0) - (a.recommendations_count || 0)
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage = Math.min(page, totalPages || 1)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  return (
    <div className="main-layout">
      <Suspense>
        <FilterSidebar
          cities={cities}
          currentCity={city}
          currentSpec={spec}
          currentQ={q}
        />
      </Suspense>
      <div className="doctors-area">
        <Suspense>
          <SpecChipsBar specs={allSpecs} currentSpec={spec} />
        </Suspense>
        <div className="results-header">
          <div className="results-count">
            {filtered.length} medic{filtered.length === 1 ? '' : 'i'} găs{filtered.length === 1 ? 'it' : 'iți'}
          </div>
          <Suspense>
            <SortSelect current={sort} />
          </Suspense>
        </div>
        <div className="doctors-list">
          {paginated.length > 0
            ? paginated.map(d => <DoctorCard key={d.id} doctor={d} reviews={getReviews(d.id)} isTop={topDocIds.has(d.id)} />)
            : (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <div className="empty-label">Nu am găsit medici pentru filtrele selectate</div>
                <Link href="/medici" className="empty-reset">Resetează filtrele</Link>
              </div>
            )
          }
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            {safePage > 1 ? (
              <Link href={`?${new URLSearchParams({ ...(q && { q }), ...(city && { city }), ...(spec && { spec }), ...(sort !== 'recommended' && { sort }), page: safePage - 1 }).toString()}`} className="page-btn">← Înapoi</Link>
            ) : <span className="page-btn disabled">← Înapoi</span>}
            <span className="page-info">Pagina {safePage} din {totalPages}</span>
            {safePage < totalPages ? (
              <Link href={`?${new URLSearchParams({ ...(q && { q }), ...(city && { city }), ...(spec && { spec }), ...(sort !== 'recommended' && { sort }), page: safePage + 1 }).toString()}`} className="page-btn">Înainte →</Link>
            ) : <span className="page-btn disabled">Înainte →</span>}
          </div>
        )}
      </div>
    </div>
  )
}
