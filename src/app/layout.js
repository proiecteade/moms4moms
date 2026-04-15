import './globals.css'
import Script from 'next/script'
import SiteShell from '@/components/SiteShell'
import { ToastProvider } from '@/components/Toast'
import { AuthProvider } from '@/components/AuthProvider'
import CookieBanner from '@/components/CookieBanner'

export const metadata = {
  metadataBase: new URL('https://moms4moms.ro'),
  title: 'Moms4Moms — Recomandări Medici',
  description: 'Recomandări de medici verificate de mame, pentru mame. Găsește un medic de încredere în orașul tău.',
  openGraph: {
    title: 'Moms4Moms — Recomandări Medici',
    description: 'Recomandări de medici verificate de mame, pentru mame. Găsește un medic de încredere în orașul tău.',
    url: 'https://moms4moms.ro',
    siteName: 'Moms4Moms',
    locale: 'ro_RO',
    type: 'website',
    images: [{ url: '/logo/m4m_logo_fundal_alb_v2.png', width: 1200, height: 630, alt: 'Moms4Moms' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moms4Moms — Recomandări Medici',
    description: 'Recomandări de medici verificate de mame, pentru mame. Găsește un medic de încredere în orașul tău.',
    images: ['/logo/m4m_logo_fundal_alb_v2.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <head>
        <meta property="fb:app_id" content="1619002152734509" />
      </head>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-5QHY2HXTJR" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5QHY2HXTJR');
        `}</Script>
        <ToastProvider>
          <AuthProvider>
            <SiteShell>
              {children}
            </SiteShell>
          </AuthProvider>
        </ToastProvider>
        <CookieBanner />
      </body>
    </html>
  )
}
