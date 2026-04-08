'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function SpecChipsBar({ specs, currentSpec }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setSpec(s) {
    const params = new URLSearchParams(searchParams.toString())
    if (currentSpec === s) params.delete('spec')
    else params.set('spec', s)
    params.delete('page')
    router.push(pathname + '?' + params.toString())
  }

  if (!specs.length) return null

  return (
    <div className="spec-chips-bar">
      {specs.map(s => (
        <button
          key={s}
          className={`filter-chip${currentSpec === s ? ' active' : ''}`}
          onClick={() => setSpec(s)}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
