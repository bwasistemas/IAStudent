'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAgents } from '@/contexts/AgentsContext'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Brain, 
  GraduationCap, 
  Users,
  Shield,
  LogOut
} from 'lucide-react'
import Image from 'next/image'

interface Agent {
  id: string
  name: string
  description: string
  icon: string
  color: string
  model: string
  instructions: string
  knowledgeBase: {
    enabled: boolean
    type: 'rag' | 'vector' | 'database'
    endpoint?: string
    collection?: string
    documents?: string[]
  }
  parameters: {
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}



const ICON_OPTIONS = [
  { value: 'brain', label: 'Cérebro', icon: <Brain className="w-4 h-4" /> },
  { value: 'graduation-cap', label: 'Capelo', icon: <GraduationCap className="w-4 h-4" /> },
  { value: 'users', label: 'Usuários', icon: <Users className="w-4 h-4" /> },
  { value: 'shield', label: 'Escudo', icon: <Shield className="w-4 h-4" /> }
]

const COLOR_OPTIONS = [
  { value: 'from-[#CE0058] to-[#B91C5C]', label: 'Magenta AFYA' },
  { value: 'from-[#232323] to-[#475569]', label: 'Cinza Escuro' },
  { value: 'from-[#8E9794] to-[#64748B]', label: 'Cinza Claro' },
  { value: 'from-[#16A34A] to-[#15803D]', label: 'Verde' },
  { value: 'from-[#2563EB] to-[#1D4ED8]', label: 'Azul' },
  { value: 'from-[#DC2626] to-[#B91C1C]', label: 'Vermelho' }
]

export function ConfiguracoesPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { agents, addAgent, updateAgent, deleteAgent } = useAgents()
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState<'agents' | 'users' | 'system'>('agents')

  // Verificar se o usuário é administrador
  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleCreateAgent = () => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: '',
      description: '',
      icon: 'brain',
      color: 'from-[#CE0058] to-[#B91C5C]',
      model: 'gpt-4.1-mini',
      instructions: '',
      knowledgeBase: {
        enabled: false,
        type: 'rag',
        endpoint: '',
        collection: '',
        documents: []
      },
      parameters: {
        temperature: 0.7,
        maxTokens: 1000,
        topP: 0.9,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEditingAgent(newAgent)
    setIsCreating(true)
  }

  const handleEditAgent = (agent: Agent) => {
    // Garantir que o agente tenha todas as propriedades necessárias
    const defaultKnowledgeBase = {
      enabled: false,
      type: 'rag' as const,
      endpoint: '',
      collection: '',
      documents: []
    }
    
    const defaultParameters = {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5
    }
    
    const agentWithDefaults = {
      ...agent,
      knowledgeBase: {
        ...defaultKnowledgeBase,
        ...(agent.knowledgeBase || {})
      },
      parameters: {
        ...defaultParameters,
        ...(agent.parameters || {})
      }
    }
    setEditingAgent(agentWithDefaults)
    setIsCreating(false)
  }

  const handleSaveAgent = () => {
    if (!editingAgent) return

    if (isCreating) {
      addAgent(editingAgent)
    } else {
      updateAgent(editingAgent)
    }

    setEditingAgent(null)
    setIsCreating(false)
  }

  const handleDeleteAgent = (agentId: string) => {
    if (confirm('Tem certeza que deseja excluir este agente?')) {
      deleteAgent(agentId)
    }
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
                <span className="px-2 py-1 bg-[#CE0058] text-white text-xs rounded-full">Admin</span>
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

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('agents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'agents'
                  ? 'border-[#CE0058] text-[#CE0058]'
                  : 'border-transparent text-[#8E9794] hover:text-[#232323]'
              }`}
            >
              Agentes de IA
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-[#CE0058] text-[#CE0058]'
                  : 'border-transparent text-[#8E9794] hover:text-[#232323]'
              }`}
            >
              Usuários
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'system'
                  ? 'border-[#CE0058] text-[#CE0058]'
                  : 'border-transparent text-[#8E9794] hover:text-[#232323]'
              }`}
            >
              Sistema
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'agents' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#232323]">Gerenciar Agentes de IA</h1>
              <button
                onClick={handleCreateAgent}
                className="bg-[#CE0058] text-white px-4 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Agente
              </button>
            </div>

            {/* Lista de Agentes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${agent.color}`}>
                      {agent.icon === 'brain' && <Brain className="w-6 h-6 text-white" />}
                      {agent.icon === 'graduation-cap' && <GraduationCap className="w-6 h-6 text-white" />}
                      {agent.icon === 'users' && <Users className="w-6 h-6 text-white" />}
                      {agent.icon === 'shield' && <Shield className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditAgent(agent)}
                        className="p-2 text-[#8E9794] hover:text-[#CE0058] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAgent(agent.id)}
                        className="p-2 text-[#8E9794] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-[#232323] mb-2">{agent.name}</h3>
                  <p className="text-sm text-[#8E9794] mb-3">{agent.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-[#8E9794]">
                    <span>Modelo: {agent.model}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {agent.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h1 className="text-2xl font-bold text-[#232323] mb-6">Gerenciar Usuários</h1>
            <p className="text-[#8E9794]">Funcionalidade em desenvolvimento...</p>
          </div>
        )}

        {activeTab === 'system' && (
          <div>
            <h1 className="text-2xl font-bold text-[#232323] mb-6">Configurações do Sistema</h1>
            <p className="text-[#8E9794]">Funcionalidade em desenvolvimento...</p>
          </div>
        )}
      </main>

      {/* Modal de Edição/Criação */}
      {editingAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#232323]">
                {isCreating ? 'Criar Novo Agente' : 'Editar Agente'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Garantir que editingAgent tenha as propriedades necessárias */}
              {editingAgent.knowledgeBase && editingAgent.parameters ? (
                <>
                  {/* Nome e Descrição */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">
                        Nome do Agente *
                      </label>
                      <input
                        type="text"
                        value={editingAgent.name}
                        onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                        placeholder="Ex: Coordenador de Aproveitamento"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">
                        Descrição *
                      </label>
                      <input
                        type="text"
                        value={editingAgent.description}
                        onChange={(e) => setEditingAgent({ ...editingAgent, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                        placeholder="Ex: Especialista em validação de disciplinas"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">
                        Ícone
                      </label>
                      <select
                        value={editingAgent.icon}
                        onChange={(e) => setEditingAgent({ ...editingAgent, icon: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                      >
                        {ICON_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">
                        Cor
                      </label>
                      <select
                        value={editingAgent.color}
                        onChange={(e) => setEditingAgent({ ...editingAgent, color: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                      >
                        {COLOR_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">
                        Modelo de IA *
                      </label>
                      <input
                        type="text"
                        value={editingAgent.model}
                        onChange={(e) => setEditingAgent({ ...editingAgent, model: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                        placeholder="Ex: gpt-4.1-mini"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingAgent.isActive}
                          onChange={(e) => setEditingAgent({ ...editingAgent, isActive: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-[#232323]">Agente Ativo</span>
                      </label>
                    </div>
                  </div>

                  {/* Instruções */}
                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-2">
                      Instruções do Agente *
                    </label>
                    <textarea
                      value={editingAgent.instructions}
                      onChange={(e) => setEditingAgent({ ...editingAgent, instructions: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent resize-none"
                      rows={8}
                      placeholder="Digite as instruções completas para o agente..."
                    />
                  </div>

                  {/* Base de Conhecimento */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-[#232323]">
                        Base de Conhecimento
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingAgent.knowledgeBase.enabled}
                          onChange={(e) => setEditingAgent({
                            ...editingAgent,
                            knowledgeBase: {
                              ...editingAgent.knowledgeBase,
                              enabled: e.target.checked
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-[#232323]">Habilitar Base de Conhecimento</span>
                      </label>
                    </div>
                    
                    {editingAgent.knowledgeBase.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-[#232323] mb-2">
                            Tipo de Base
                          </label>
                          <select
                            value={editingAgent.knowledgeBase.type}
                            onChange={(e) => setEditingAgent({
                              ...editingAgent,
                              knowledgeBase: {
                                ...editingAgent.knowledgeBase,
                                type: e.target.value as 'rag' | 'vector' | 'database'
                              }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                          >
                            <option value="rag">RAG (Retrieval-Augmented Generation)</option>
                            <option value="vector">Base Vetorial</option>
                            <option value="database">Base de Dados</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-[#232323] mb-2">
                            Endpoint da API
                          </label>
                          <input
                            type="text"
                            value={editingAgent.knowledgeBase.endpoint || ''}
                            onChange={(e) => setEditingAgent({
                              ...editingAgent,
                              knowledgeBase: {
                                ...editingAgent.knowledgeBase,
                                endpoint: e.target.value
                              }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                            placeholder="Ex: http://localhost:8000"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-[#232323] mb-2">
                            Coleção/Nome da Base
                          </label>
                          <input
                            type="text"
                            value={editingAgent.knowledgeBase.collection || ''}
                            onChange={(e) => setEditingAgent({
                              ...editingAgent,
                              knowledgeBase: {
                                ...editingAgent.knowledgeBase,
                                collection: e.target.value
                              }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                            placeholder="Ex: matrizes_curriculares"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Parâmetros do Modelo */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#232323] mb-4">Parâmetros do Modelo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">
                          Temperature: {editingAgent.parameters.temperature}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={editingAgent.parameters.temperature}
                          onChange={(e) => setEditingAgent({
                            ...editingAgent,
                            parameters: {
                              ...editingAgent.parameters,
                              temperature: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-[#8E9794]">
                          <span>Determinístico (0)</span>
                          <span>Criativo (2)</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">
                          Max Tokens: {editingAgent.parameters.maxTokens}
                        </label>
                        <input
                          type="number"
                          min="100"
                          max="4000"
                          step="100"
                          value={editingAgent.parameters.maxTokens}
                          onChange={(e) => setEditingAgent({
                            ...editingAgent,
                            parameters: {
                              ...editingAgent.parameters,
                              maxTokens: parseInt(e.target.value)
                            }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">
                          Top P: {editingAgent.parameters.topP}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={editingAgent.parameters.topP}
                          onChange={(e) => setEditingAgent({
                            ...editingAgent,
                            parameters: {
                              ...editingAgent.parameters,
                              topP: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">
                          Frequency Penalty: {editingAgent.parameters.frequencyPenalty}
                        </label>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.1"
                          value={editingAgent.parameters.frequencyPenalty}
                          onChange={(e) => setEditingAgent({
                            ...editingAgent,
                            parameters: {
                              ...editingAgent.parameters,
                              frequencyPenalty: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">
                          Presence Penalty: {editingAgent.parameters.presencePenalty}
                        </label>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.1"
                          value={editingAgent.parameters.presencePenalty}
                          onChange={(e) => setEditingAgent({
                            ...editingAgent,
                            parameters: {
                              ...editingAgent.parameters,
                              presencePenalty: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500">Carregando configurações do agente...</p>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingAgent(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-[#8E9794] hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
                              <button
                  onClick={handleSaveAgent}
                  disabled={!editingAgent.name || !editingAgent.description || !editingAgent.instructions.trim()}
                  className="bg-[#CE0058] text-white px-6 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Salvar Agente
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
