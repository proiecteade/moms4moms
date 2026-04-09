import './globals.css'
import SiteShell from '@/components/SiteShell'
import { ToastProvider } from '@/components/Toast'
import { AuthProvider } from '@/components/AuthProvider'

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moms4Moms — Recomandări Medici',
    description: 'Recomandări de medici verificate de mame, pentru mame. Găsește un medic de încredere în orașul tău.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <ToastProvider>
          <AuthProvider>
            <SiteShell>
              {children}
            </SiteShell>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
