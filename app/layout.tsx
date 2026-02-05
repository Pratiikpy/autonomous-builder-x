import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '⚡ LiveForge - Autonomous Solana Builder',
  description: 'Watch AI build Solana agents live. Real-time transparency, on-chain verification, production-ready code. From prompt to deployed program in minutes.',
  keywords: ['Solana', 'AI Agent', 'Autonomous Builder', 'On-Chain Verification', 'LiveForge'],
  authors: [{ name: 'LiveForge Team' }],
  openGraph: {
    title: '⚡ LiveForge - Autonomous Solana Builder',
    description: 'Watch AI build Solana agents live with complete transparency',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
