import type { Metadata } from 'next'
import { Noto_Serif, Manrope } from 'next/font/google'
import '@/styles/globals.css'

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif',
})

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'Villa Juan - Ecogranja Tenjo | Coaching Equino, Eventos y Restaurante',
  description: 'Desconectate de la rutina y reconectá con lo que realmente importa en Villa Juan, Tenjo. Coaching equino, eventos corporativos, restaurante al barril y salidas pedagógicas.',
  keywords: 'Villa Juan, Tenjo, Cundinamarca, coaching equino, eventos corporativos, restaurante al barril, salidas pedagógicas, ecogranja, naturaleza, team building',
  authors: [{ name: 'Villa Juan Ecogranja' }],
  creator: 'Villa Juan Ecogranja',
  publisher: 'Villa Juan Ecogranja',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://villa-juan.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Villa Juan - Ecogranja Tenjo | Experiencias Auténticas en la Naturaleza',
    description: 'Un espacio donde el aire de Tenjo se mezcla con el aroma del barril y la sabiduría de los caballos. Más que una visita, es una pausa necesaria.',
    url: 'https://villa-juan.vercel.app',
    siteName: 'Villa Juan Ecogranja',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Villa Juan Ecogranja - Tenjo, Cundinamarca',
      },
    ],
    locale: 'es_CO',
    type: 'website',
    },
    twitter: {
    card: 'summary_large_image',
    title: 'Villa Juan - Ecogranja Tenjo',
    description: 'Experiencias auténticas en la naturaleza. Coaching equino, eventos y gastronomía al barril.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#fef7ff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${notoSerif.variable} ${manrope.variable} antialiased bg-surface text-on_surface font-body`}>
        {children}
      </body>
    </html>
  )
}