import { createBrowserClient } from '@supabase/ssr'

let client = null

export function createClient() {
  if (typeof window === 'undefined') return null
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url === 'your_supabase_url_here') return null
  try {
    client = createBrowserClient(url, key)
    return client
  } catch {
    return null
  }
}
