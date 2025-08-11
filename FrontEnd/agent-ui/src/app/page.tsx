'use client'
import Sidebar from '@/components/playground/Sidebar/Sidebar'
import { ChatArea } from '@/components/playground/ChatArea'
import { Suspense } from 'react'

export default function Home() {
  return (
    <Suspense fallback={<div className="font-gotham-book text-darkGray">Loading...</div>}>
      <div className="flex h-screen bg-white">
        <Sidebar />
        <ChatArea />
      </div>
    </Suspense>
  )
}
