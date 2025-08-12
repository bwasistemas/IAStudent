'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dados fake para coordenadores
const FAKE_USERS = [
  {
    id: '1',
    name: 'Danilo Pinho',
    email: 'danilo.pinho@pvtsoftware.com.br',
    password: '123123',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Ana Paula Coordenadora',
    email: 'ana.coordenadora@afya.edu.br',
    password: '123123',
    role: 'coordenador'
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('afya_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch {
        localStorage.removeItem('afya_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = FAKE_USERS.find(u => u.email === email && u.password === password)
    
    if (user) {
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
      
      setUser(userData)
      localStorage.setItem('afya_user', JSON.stringify(userData))
      return true
    }
    
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('afya_user')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
