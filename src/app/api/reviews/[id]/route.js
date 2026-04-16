import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(request, { params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 })
  }

  const { data: review } = await supabase
    .from('reviews')
    .select('id, user_id')
    .eq('id', id)
    .maybeSingle()

  if (!review) {
    return NextResponse.json({ error: 'Comentariul nu există.' }, { status: 404 })
  }

  if (review.user_id !== user.id) {
    return NextResponse.json({ error: 'Nu ai permisiunea să ștergi acest comentariu.' }, { status: 403 })
  }

  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: 'Eroare la ștergere.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
