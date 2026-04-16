import { createClient } from '@/lib/supabase/server'
import { normalize } from '@/lib/helpers'
import RestaurantCard from '@/components/RestaurantCard'
import RestaurantFilterSidebar from '@/components/RestaurantFilterSidebar'
import SortSelect from '@/components/SortSelect'
import { Suspense } from 'react'
import Link from 'next/link'
import { TIP_LABEL_MAP } from '@/lib/constants'
import AddRestaurantButton from '@/components/AddRestaurantButton'

export const metadata = { title: 'Unde ieșim — Moms4Moms' }

const PER_PAGE = 24

export default async function UndeIesimPage({ searchParams }) {
  const params = await searchParams
  const q = (params.q || '').toLowerCase()
  const city = params.city || ''
  const tip = params.tip || ''
  const bucatarie = params.bucatarie || ''
  const sort = params.sort || 'recommended'
  const page = Math.max(1, parseInt(params.page || '1'))

  const supabase = await createClient()
  let restaurants = [], reviews = [], recs = []
  try {
    const [{ data: r }, { data: rv }, { data: rc }] = await Promise.all([
      supabase.from('restaurants').select('*').eq('status', 'approved'),
      supabase.from('reviews').select('*').eq('status', 'approved').not('restaurant_id', 'is', null),
      supabase.from('recommendations').select('restaurant_id').not('restaurant_id', 'is', null),
    ])
    restaurants = r || []
    reviews = rv || []
    recs = rc || []
  } catch {
    // Baza de date indisponibilă
  }

  const recCountMap = {}
  recs.forEach(r => { recCountMap[r.restaurant_id] = (recCountMap[r.restaurant_id] || 0) + 1 })

  const items = restaurants.map(r => ({
    ...r,
    recommendations_count: recCountMap[r.id] || 0,
  }))

  const cities = [...new Set(items.flatMap(r => (r.city || '').split(',').map(c => c.trim()).filter(Boolean)))].sort()
  const allTips = [...new Set(items.map(r => r.tip).filter(Boolean))].sort()
  const allBucatarii = [...new Set(items.flatMap(r => r.bucatarie || []))].sort()

  const suggestions = [
    ...allTips.map(t => ({ type: 'tip', label: TIP_LABEL_MAP[t] || t })),
    ...items.map(r => ({ type: 'restaurant', label: r.name })),
  ]

  function getReviews(id) { return reviews.filter(r => r.restaurant_id === id) }

  const nq = normalize(q)
  let filtered = items
  if (q) {
    const queryTokens = nq.split(/\s+/).filter(Boolean)
    filtered = filtered.filter(r => {
      const tokens = [
        ...normalize(r.name).split(/[\s\-]+/),
        ...normalize(r.tip).split(/[\s\/\-]+/),
        ...(r.bucatarie || []).flatMap(b => normalize(b).split(/[\s\/\-]+/)),
        ...normalize(r.city).split(/[\s,\-]+/),
        ...normalize(r.zona || '').split(/[\s,\-]+/),
      ].filter(Boolean)
      return queryTokens.every(qt => tokens.some(t => t.includes(qt)))
    })
  }
  if (city) filtered = filtered.filter(r =>
    (r.city || '').split(',').map(c => c.trim()).includes(city)
  )
  if (tip) filtered = filtered.filter(r => r.tip === tip)
  if (bucatarie) filtered = filtered.filter(r => (r.bucatarie || []).includes(bucatarie))

  filtered.sort((a, b) => {
    if (sort === 'reviews') return getReviews(b.id).length - getReviews(a.id).length
    if (sort === 'name') return (a.name || '').localeCompare(b.name || '', 'ro')
    return (b.recommendations_count || 0) - (a.recommendations_count || 0)
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage = Math.min(page, totalPages || 1)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  return (
    <div className="main-layout">
      <Suspense>
        <RestaurantFilterSidebar
          cities={cities}
          tips={allTips}
          bucatarii={allBucatarii}
          currentCity={city}
          currentTip={tip}
          currentBucatarie={bucatarie}
          currentQ={q}
          suggestions={suggestions}
        />
      </Suspense>
      <div className="doctors-area">
        <div className="results-header">
          <div className="results-count">
            {filtered.length} loc{filtered.length === 1 ? '' : 'uri'} găs{filtered.length === 1 ? 'it' : 'ite'}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Suspense><SortSelect current={sort} /></Suspense>
            <AddRestaurantButton />
          </div>
        </div>
        <div className="doctors-list">
          {paginated.length > 0
            ? paginated.map(r => <RestaurantCard key={r.id} restaurant={r} reviewCount={getReviews(r.id).length} />)
            : (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <div className="empty-label">Nu am găsit locuri pentru filtrele selectate</div>
                <Link href="/unde-iesim" className="empty-reset">Resetează filtrele</Link>
              </div>
            )
          }
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            {safePage > 1 ? (
              <Link href={`?${new URLSearchParams({ ...(q && { q }), ...(city && { city }), ...(tip && { tip }), ...(bucatarie && { bucatarie }), ...(sort !== 'recommended' && { sort }), page: safePage - 1 }).toString()}`} className="page-btn">← Înapoi</Link>
            ) : <span className="page-btn disabled">← Înapoi</span>}
            <span className="page-info">Pagina {safePage} din {totalPages}</span>
            {safePage < totalPages ? (
              <Link href={`?${new URLSearchParams({ ...(q && { q }), ...(city && { city }), ...(tip && { tip }), ...(bucatarie && { bucatarie }), ...(sort !== 'recommended' && { sort }), page: safePage + 1 }).toString()}`} className="page-btn">Înainte →</Link>
            ) : <span className="page-btn disabled">Înainte →</span>}
          </div>
        )}
      </div>
    </div>
  )
}
