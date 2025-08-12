'use client'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { PlaygroundPage } from '@/components/playground/PlaygroundPage'
import { Suspense } from 'react'

export default function Playground() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="font-gotham-book text-darkGray">Loading...</div>}>
        <PlaygroundPage />
      </Suspense>
    </ProtectedRoute>
  )
}
