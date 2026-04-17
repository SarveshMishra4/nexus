import type { ReactNode } from 'react'
import { Rubik } from 'next/font/google'
import './globals.css'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-rubik',
})

export const metadata = {
  title: 'Nexus — The Creator Marketing Platform',
  description:
    'Influencer marketing is changing forever. Welcome to the launch of Nexus — the precision platform for brands, influencers, and agencies who demand real results.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={rubik.variable}>
      <body style={{ fontFamily: 'var(--font-rubik), sans-serif', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}