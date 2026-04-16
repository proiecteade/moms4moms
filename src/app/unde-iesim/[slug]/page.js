import { createClient } from '@/lib/supabase/server'
import { createClient as createDirectClient } from '@supabase/supabase-js'
import Link from 'next/link'
import DetailActions from '@/components/DetailActions'
import DetailFooterChips from '@/components/DetailFooterChips'
import ReviewsSectionClient from '@/components/ReviewsSectionClient'
import SuggestLink from '@/components/SuggestLink'
import { avatarColor } from '@/lib/helpers'
import { tipEmoji, TIP_LABEL_MAP } from '@/lib/constants'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const supabase = createDirectClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('slug, id')
      .eq('status', 'approved')
    return (restaurants || []).map(r => ({ slug: r.slug || r.id }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: rest } = await supabase.from('restaurants').select('*').or(`slug.eq.${slug},id.eq.${slug}`).maybeSingle()
  if (!rest) return { title: 'Unde ieșim — Moms4Moms' }
  const tipLabel = TIP_LABEL_MAP[rest.tip] || rest.tip
  return {
    title: `${rest.name} — Moms4Moms`,
    description: `Recenzii și informații despre ${rest.name}, ${tipLabel}, ${rest.city}`,
    openGraph: {
      title: `${rest.name} — Moms4Moms`,
      description: `Recenzii și informații despre ${rest.name}, ${tipLabel}, ${rest.city}`,
      images: rest.photo_url ? [{ url: rest.photo_url }] : [{ url: '/og-image.png' }],
    },
  }
}

export default async function RestaurantDetailPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: rest } = await supabase.from('restaurants').select('*').or(`slug.eq.${slug},id.eq.${slug}`).maybeSingle()
  if (!rest) notFound()

  const [{ data: reviews }, { count: recCount }] = await Promise.all([
    supabase.from('reviews').select('*').eq('restaurant_id', rest.id).eq('status', 'approved'),
    supabase.from('recommendations').select('*', { count: 'exact', head: true }).eq('restaurant_id', rest.id),
  ])

  const restWithCount = {
    ...rest,
    recommendations_count: recCount || 0,
  }
  const revs = reviews || []
  const topLevel = revs.filter(r => !r.parent_id)
  const repliesByParentId = {}
  revs.filter(r => r.parent_id).forEach(r => {
    if (!repliesByParentId[r.parent_id]) repliesByParentId[r.parent_id] = []
    repliesByParentId[r.parent_id].push(r)
  })
  const count = revs.length
  const bg = avatarColor(rest.name)
  const init = (rest.name || '').slice(0, 2).toUpperCase()
  const tipLabel = TIP_LABEL_MAP[rest.tip] || rest.tip
  const mapsUrl = rest.google_place_id
    ? `https://www.google.com/maps/place/?q=place_id:${rest.google_place_id}`
    : rest.adresa
      ? `https://www.google.com/maps/search/${encodeURIComponent(rest.adresa)}`
      : null

  return (
    <div className="doctor-detail">
      <Link href="/unde-iesim" className="back-btn">← Înapoi la lista de locuri</Link>

      <div className="doctor-card-wrap">
        <div className="detail-hero">
          {rest.photo_url
            ? <img src={rest.photo_url} className="detail-avatar" alt={rest.name} style={{ objectFit: 'cover', objectPosition: 'center' }} />
            : <div className="detail-avatar" style={{ background: bg }}>{init}</div>
          }
          <div className="detail-hero-info">
            <div className="detail-hero-name-row">
              <div className="detail-name">{rest.name}</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              <span className="tip-badge">{tipEmoji(rest.tip)} {tipLabel}</span>
              {(rest.bucatarie || []).map(b => (
                <span key={b} className="cuisine-tag">{b}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="detail-body">
          {rest.obs && (
            <div style={{ padding: '0.5rem 1.75rem', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {rest.obs.split(',').map(o => o.trim()).filter(Boolean).map((o, i) => (
                <span key={i} className="obs-tag" style={{ fontSize: 13 }}>ℹ️ {o}</span>
              ))}
            </div>
          )}

          <div className="detail-location">
            {(rest.city || '').split(',').map(c => c.trim()).filter(Boolean).map(c => (
              <span key={c}>📍 {c}</span>
            ))}
            {rest.zona && <span>· {rest.zona}</span>}
          </div>

          {rest.adresa && (
            <div style={{ padding: '0 1.75rem 0.5rem', fontSize: 14, color: 'var(--ink-light)' }}>
              {mapsUrl
                ? <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rose)', textDecoration: 'none' }}>📍 {rest.adresa}</a>
                : <span>📍 {rest.adresa}</span>
              }
            </div>
          )}

          {rest.phone && (
            <div style={{ padding: '0 1.75rem 0.5rem', fontSize: 14 }}>
              <a href={`tel:${rest.phone}`} style={{ color: 'var(--ink)', textDecoration: 'none' }}>📞 {rest.phone}</a>
            </div>
          )}

          {rest.website && (
            <div style={{ padding: '0 1.75rem 0.5rem', fontSize: 14 }}>
              <a href={rest.website.startsWith('http') ? rest.website : `https://${rest.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rose)', textDecoration: 'none' }}>🌐 Website</a>
            </div>
          )}

          <DetailFooterChips doctor={restWithCount} reviewCount={count} entityType="restaurant" />
        </div>

        <DetailActions entityName={rest.name} />
      </div>
      <SuggestLink entityName={rest.name} entityId={rest.id} />

      <ReviewsSectionClient
        topLevel={topLevel}
        repliesByParentId={repliesByParentId}
        restaurantId={rest.id}
        entityName={rest.name}
      />
    </div>
  )
}
