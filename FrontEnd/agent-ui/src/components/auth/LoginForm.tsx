'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirecionar automaticamente após login bem-sucedido
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (!success) {
        setError('Email ou senha incorretos')
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Se já estiver autenticado, não mostrar o formulário
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/AfyaCompleto.png"
            alt="Logomarca AFYA"
            width={200}
            height={80}
            className="mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-[#232323] mb-2">
            PLATAFORMA DE AGENTES IA
          </h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#232323] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#8E9794] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent transition-all duration-200"
              placeholder="seu.email@instituicao.edu.br"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#232323] mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#8E9794] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#CE0058] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#B91C5C] focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-[#CE0058] mb-2">
            O MAIOR HUB DE EDUCAÇÃO
          </p>
          <p className="text-xs text-[#8E9794] leading-relaxed">
            E SOLUÇÕES PARA A PRÁTICA MÉDICA DO BRASIL
          </p>
        </div>
      </div>
    </div>
  )
}
