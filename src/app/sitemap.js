import { createClient } from '@/lib/supabase/server'

const BASE_URL = 'https://moms4moms.ro'

export default async function sitemap() {
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/medici`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/localitati`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/specialitati`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  try {
    const supabase = await createClient()
    const { data: doctors } = await supabase
      .from('doctors')
      .select('slug, id, updated_at')
      .eq('status', 'approved')

    const doctorRoutes = (doctors || []).map(d => ({
      url: `${BASE_URL}/medici/${d.slug || d.id}`,
      lastModified: d.updated_at ? new Date(d.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticRoutes, ...doctorRoutes]
  } catch {
    return staticRoutes
  }
}
