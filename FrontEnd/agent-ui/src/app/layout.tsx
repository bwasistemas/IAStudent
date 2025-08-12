import type { Metadata } from 'next'
import { DM_Mono, Geist } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { AgentsProvider } from '@/contexts/AgentsContext'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  weight: '400',
  subsets: ['latin']
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: '400'
})

// Gotham font configuration for AFYA brand
const gothamFont = {
  variable: '--font-gotham',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif']
}

export const metadata: Metadata = {
  title: 'AFYA Agent UI',
  description:
    'A modern chat interface for AI agents built with Next.js, Tailwind CSS, and TypeScript. Featuring AFYA brand identity and professional design.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/gotham"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${dmMono.variable} ${gothamFont.variable} font-gotham antialiased`}>
        <AuthProvider>
          <AgentsProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster />
          </AgentsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
