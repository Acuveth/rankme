import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://rankme.app' : 'http://localhost:3003'),
  title: 'RankMe - Professional Life Assessment Platform',
  description: 'Comprehensive life assessment platform that benchmarks your performance across financial, health, social, and personal dimensions. Get instant percentile rankings and professional insights.',
  keywords: 'life assessment, personal development, life score, benchmarking, self-improvement, financial health, wellness, professional development',
  openGraph: {
    title: 'RankMe - Professional Life Assessment Platform',
    description: 'Benchmark your life performance across multiple dimensions with professional insights',
    url: '/',
    siteName: 'RankMe',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RankMe - Professional Life Assessment',
    description: 'Benchmark your life performance with professional insights',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}