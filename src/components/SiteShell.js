'use client'

import { usePathname } from 'next/navigation'
import Nav from './Nav'
import Footer from './Footer'

export default function SiteShell({ children }) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'
  const bare = isLogin || pathname?.startsWith('/horoscop')

  return (
    <>
      {!bare && <Nav />}
      {children}
      {!bare && <Footer />}
    </>
  )
}
