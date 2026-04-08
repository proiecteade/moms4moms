import './globals.css'
import SiteShell from '@/components/SiteShell'
import { ToastProvider } from '@/components/Toast'

export const metadata = {
  title: 'Moms4Moms — Recomandări Medici',
  description: 'Recomandări de medici verificate de mame, pentru mame. Găsește un medic de încredere în orașul tău.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <ToastProvider>
          <SiteShell>
            {children}
          </SiteShell>
        </ToastProvider>
      </body>
    </html>
  )
}
