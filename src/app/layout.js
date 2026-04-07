import './globals.css'
import Nav from '@/components/Nav'
import FeedbackWidget from '@/components/FeedbackWidget'
import Footer from '@/components/Footer'
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
          <Nav />
          {children}
          <Footer />
          <FeedbackWidget />
        </ToastProvider>
      </body>
    </html>
  )
}
