'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function UserHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-[#CE0058] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#232323]">
              {user.name}
            </h2>
            <p className="text-sm text-[#8E9794]">
              {user.role}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-[#CE0058] border border-[#CE0058] rounded-lg hover:bg-[#CE0058] hover:text-white transition-all duration-200 font-medium"
        >
          Sair
        </button>
      </div>
    </div>
  )
}
