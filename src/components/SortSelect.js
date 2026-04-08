'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function SortSelect({ current }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function onChange(e) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    router.push(pathname + '?' + params.toString())
  }

  return (
    <select className="sort-select" value={current} onChange={onChange}>
      <option value="recommended">Cele mai multe recomandări</option>
      <option value="reviews">Cele mai multe experiențe</option>
      <option value="name">Alfabetic (A–Z)</option>
    </select>
  )
}
