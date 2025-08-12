'use client'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { ConfiguracoesPage } from '@/components/admin/ConfiguracoesPage'
import { Suspense } from 'react'

export default function Configuracoes() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="font-gotham-book text-darkGray">Loading...</div>}>
        <ConfiguracoesPage />
      </Suspense>
    </ProtectedRoute>
  )
}
