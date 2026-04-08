'use client'

import { usePathname } from 'next/navigation'
import Nav from './Nav'
import Footer from './Footer'

export default function SiteShell({ children }) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'

  return (
    <>
      {!isLogin && <Nav />}
      {children}
      {!isLogin && <Footer />}
    </>
  )
}
