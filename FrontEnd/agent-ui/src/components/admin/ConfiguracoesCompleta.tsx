'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Settings,
  Brain,
  Code,
  Users,
  Shield,
  LogOut
} from 'lucide-react'
import Image from 'next/image'
import { ToolsManagement } from './ToolsManagement'
import { ConfiguracoesPage as AgentsManagement } from './ConfiguracoesPage'

export function ConfiguracoesCompleta() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'agents' | 'tools' | 'users' | 'system'>('agents')

  // Verificar se o usuário é administrador
  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-[#232323] mb-2">Acesso Negado</h1>
          <p className="text-[#8E9794] mb-4">Você não tem permissão para acessar esta página.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#CE0058] text-white px-6 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#8E9794]" />
              </button>
              <Image
                src="/Afya.png"
                alt="Logomarca Afya"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg font-bold text-[#232323]">Configurações do Sistema</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#CE0058] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-[#232323]">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-[#CE0058] hover:text-[#B91C5C] transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação por Abas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('agents')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'agents'
                  ? 'border-[#CE0058] text-[#CE0058]'
                  : 'border-transparent text-[#8E9794] hover:text-[#232323] hover:border-gray-300'
              }`}
            >
              <Brain className="w-4 h-4" />
              Agentes IA
            </button>
            
            <button
              onClick={() => setActiveTab('tools')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'tools'
                  ? 'border-[#CE0058] text-[#CE0058]'
                  : 'border-transparent text-[#8E9794] hover:text-[#232323] hover:border-gray-300'
              }`}
            >
              <Code className="w-4 h-4" />
              Ferramentas & APIs
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'border-[#CE0058] text-[#CE0058]'
                  : 'border-transparent text-[#8E9794] hover:text-[#232323] hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4" />
              Usuários
            </button>
            
            <button
              onClick={() => setActiveTab('system')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'system'
                  ? 'border-[#CE0058] text-[#CE0058]'
                  : 'border-transparent text-[#8E9794] hover:text-[#232323] hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4" />
              Sistema
            </button>
          </nav>
        </div>

        {/* Conteúdo das Abas */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[600px]">
          {activeTab === 'agents' && (
            <div className="p-6">
              <AgentsManagement />
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="p-6">
              <ToolsManagement />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#232323] mb-2">Gerenciamento de Usuários</h2>
                <p className="text-[#8E9794]">Gerencie usuários, permissões e grupos de acesso</p>
              </div>
              <div className="text-center py-12 text-[#8E9794]">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Gerenciamento de usuários em desenvolvimento</p>
                <button className="mt-4 bg-[#CE0058] text-white px-4 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors">
                  Implementar em Breve
                </button>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#232323] mb-2">Configurações do Sistema</h2>
                <p className="text-[#8E9794]">Configure parâmetros gerais do sistema e integrações</p>
              </div>
              
              <div className="space-y-6">
                {/* Configurações Gerais */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#232323] mb-4">Configurações Gerais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">Nome da Instituição</label>
                      <input
                        type="text"
                        defaultValue="AFYA - Vila Velha"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">Email de Suporte</label>
                      <input
                        type="email"
                        defaultValue="suporte@afya.edu.br"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">Timezone</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent">
                        <option value="America/Sao_Paulo">America/São_Paulo</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">Idioma Padrão</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent">
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Integrações */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#232323] mb-4">Integrações</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-[#232323]">Sistema TOTVS</h4>
                        <p className="text-sm text-[#8E9794]">Integração com sistema acadêmico TOTVS</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Ativo</span>
                        <button className="text-[#CE0058] hover:text-[#B91C5C]">Configurar</button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-[#232323]">OpenAI API</h4>
                        <p className="text-sm text-[#8E9794]">Integração com modelos de IA da OpenAI</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Ativo</span>
                        <button className="text-[#CE0058] hover:text-[#B91C5C]">Configurar</button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-[#232323]">Email SMTP</h4>
                        <p className="text-sm text-[#8E9794]">Servidor de email para notificações</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Configurar</span>
                        <button className="text-[#CE0058] hover:text-[#B91C5C]">Configurar</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Backup e Segurança */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#232323] mb-4">Backup e Segurança</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">Backup Automático</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent">
                        <option value="daily">Diário</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                        <option value="disabled">Desabilitado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">Retenção de Logs</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent">
                        <option value="30">30 dias</option>
                        <option value="60">60 dias</option>
                        <option value="90">90 dias</option>
                        <option value="365">1 ano</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-4">
                    <button className="bg-[#CE0058] text-white px-4 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors">
                      Fazer Backup Agora
                    </button>
                    <button className="border border-gray-300 text-[#8E9794] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Ver Logs do Sistema
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}