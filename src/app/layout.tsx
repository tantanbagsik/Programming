import type { Metadata } from 'next'
import { Sora, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Toaster } from 'react-hot-toast'
import ElevenLabsWidget from '@/components/ElevenLabsWidget'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Raypanganiban – Learn Without Limits', template: '%s | Raypanganiban' },
  description: 'Join 500,000+ learners mastering in-demand skills through expert-led courses and AI-personalized learning paths.',
  keywords: ['online learning', 'courses', 'education', 'programming', 'design'],
  openGraph: {
    title: 'Raypanganiban – Learn Without Limits',
    description: 'Expert-led courses with AI-powered learning paths.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="bg-dark text-white font-inter antialiased">
        <Providers>
          <ElevenLabsWidget />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#111118', color: '#fff', border: '1px solid #1E1E2E' },
              success: { iconTheme: { primary: '#7C3AED', secondary: '#fff' } },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
