'use client'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import HomePage from '@/components/dashboard/HomePage'
import { Suspense } from 'react'

export default function Home() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="font-gotham-book text-darkGray">Loading...</div>}>
        <HomePage />
      </Suspense>
    </ProtectedRoute>
  )
}
