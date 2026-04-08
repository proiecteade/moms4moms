'use client'
import { useToast } from './Toast'

export default function ShareButtons({ doctor }) {
  const toast = useToast()
  const name = `Dr. ${doctor.first_name}${doctor.last_name ? ' ' + doctor.last_name : ''}`

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    toast('Link copiat!', 'success')
  }

  function shareWhatsApp() {
    const text = `Îți recomand pe ${name} pe Moms4Moms: ${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="share-row">
      <button className="share-btn" onClick={copyLink}>📋 Copiază link</button>
      <button className="share-btn share-btn-wa" onClick={shareWhatsApp}>💬 WhatsApp</button>
    </div>
  )
}
