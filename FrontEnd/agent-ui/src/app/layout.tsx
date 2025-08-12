import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AgentsProvider } from '@/contexts/AgentsContext'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AFYA | Agentes de IA',
  description: 'Plataforma de Agentes de IA Acadêmicos para Aproveitamento de Estudos',
  icons: {
    icon: '/Afya.png',
    shortcut: '/Afya.png',
    apple: '/Afya.png',
  },
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
        <link rel="icon" type="image/png" href="/Afya.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/Afya.png" />
      </head>
      <body className={`${inter.className} font-gotham antialiased`}>
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
