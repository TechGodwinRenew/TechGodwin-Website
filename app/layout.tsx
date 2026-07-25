import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'TechGodwin - IT Knowledge & Training Platform',
  description: 'Share and learn IT infrastructure, cloud architecture, and DevOps practices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-50 to-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
