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
  LogOut,
  Settings,
  AlertCircle,
  Database,
  Link,
  Key,
  Check,
  AlertTriangle,
  Globe,
  Code,
  TestTube
} from 'lucide-react'
import Image from 'next/image'
import { ToolsManagement } from './ToolsManagement'

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
    type: 'rag' | 'vector' | 'database' | 'dify'
    endpoint?: string
    collection?: string
    documents?: string[]
    difyConfig?: {
      apiKey: string
      baseUrl: string
      conversationId?: string
    }
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

interface APITool {
  id: string
  name: string
  description: string
  type: 'database' | 'api' | 'webhook'
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  authentication: {
    type: 'none' | 'bearer' | 'api_key' | 'basic'
    token?: string
    apiKey?: string
    username?: string
    password?: string
    headerName?: string
  }
  headers: { [key: string]: string }
  parameters: {
    name: string
    type: 'string' | 'number' | 'boolean'
    required: boolean
    description: string
    defaultValue?: string
  }[]
  responseMapping: {
    dataPath: string
    fields: {
      source: string
      target: string
      type: 'string' | 'number' | 'boolean' | 'array'
    }[]
  }
  isActive: boolean
  lastTested?: string
  testStatus?: 'success' | 'error' | 'pending'
  testMessage?: string
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
  const { agents, addAgent, updateAgent, deleteAgent, resetToDefaultAgents, loading, error } = useAgents()
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState<'agents' | 'tools' | 'users' | 'system'>('agents')
  const [saving, setSaving] = useState(false)
  
  // Estados para gerenciamento de tools
  const [tools, setTools] = useState<APITool[]>([
    {
      id: '1',
      name: 'API de Dispensas Acadêmicas',
      description: 'Consulta histórico de dispensas e equivalências já aprovadas',
      type: 'api',
      endpoint: 'https://api.afya.com/v1/dispensas',
      method: 'GET',
      authentication: {
        type: 'bearer',
        token: ''
      },
      headers: {
        'Content-Type': 'application/json'
      },
      parameters: [
        {
          name: 'curso_origem',
          type: 'string',
          required: false,
          description: 'Filtrar por curso de origem'
        },
        {
          name: 'disciplina',
          type: 'string',
          required: false,
          description: 'Nome da disciplina para buscar equivalências'
        }
      ],
      responseMapping: {
        dataPath: 'data.dispensas',
        fields: [
          { source: 'disciplina_origem', target: 'disciplina_origem', type: 'string' },
          { source: 'disciplina_destino', target: 'disciplina_destino', type: 'string' },
          { source: 'percentual_equivalencia', target: 'equivalencia', type: 'number' },
          { source: 'observacoes', target: 'observacoes', type: 'string' }
        ]
      },
      isActive: false,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Base de Matriz Curricular',
      description: 'Consulta matrizes curriculares atualizadas dos cursos AFYA',
      type: 'database',
      endpoint: 'https://db.afya.com/api/matriz-curricular',
      method: 'POST',
      authentication: {
        type: 'api_key',
        apiKey: '',
        headerName: 'X-API-Key'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      parameters: [
        {
          name: 'curso_id',
          type: 'string',
          required: true,
          description: 'ID do curso para consultar matriz'
        },
        {
          name: 'ano_letivo',
          type: 'string',
          required: false,
          description: 'Ano letivo da matriz (padrão: atual)'
        }
      ],
      responseMapping: {
        dataPath: 'matriz.disciplinas',
        fields: [
          { source: 'codigo', target: 'codigo_disciplina', type: 'string' },
          { source: 'nome', target: 'nome_disciplina', type: 'string' },
          { source: 'carga_horaria', target: 'carga_horaria', type: 'number' },
          { source: 'creditos', target: 'creditos', type: 'number' },
          { source: 'periodo', target: 'periodo', type: 'number' }
        ]
      },
      isActive: false,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ])
  const [editingTool, setEditingTool] = useState<APITool | null>(null)
  const [isCreatingTool, setIsCreatingTool] = useState(false)
  const [testingTool, setTestingTool] = useState<string | null>(null)
  const [testingDify, setTestingDify] = useState(false)
  const [difyTestResult, setDifyTestResult] = useState<{success: boolean, message: string} | null>(null)

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
        documents: [],
        difyConfig: {
          apiKey: '',
          baseUrl: '',
          conversationId: ''
        }
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
      documents: [],
      difyConfig: {
        apiKey: '',
        baseUrl: '',
        conversationId: ''
      }
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
      // Garantir que instructions seja sempre uma string
      instructions: typeof agent.instructions === 'string' ? agent.instructions : '',
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

  const handleSaveAgent = async () => {
    if (!editingAgent) return

    // Verificar se todas as propriedades necessárias existem
    if (!editingAgent.name || !editingAgent.description || !editingAgent.instructions) {
      console.error('Propriedades obrigatórias não preenchidas:', editingAgent)
      return
    }

    // Verificar se instructions é uma string
    if (typeof editingAgent.instructions !== 'string') {
      console.error('Instructions deve ser uma string:', editingAgent.instructions)
      return
    }

    // Verificar se instructions não está vazio após trim
    if (!editingAgent.instructions.trim()) {
      console.error('Instructions não pode estar vazio')
      return
    }

    try {
      setSaving(true)
      
      let success: boolean
      if (isCreating) {
        success = await addAgent(editingAgent)
      } else {
        success = await updateAgent(editingAgent)
      }

      if (success) {
        setEditingAgent(null)
        setIsCreating(false)
      }
    } catch (err) {
      console.error('Erro ao salvar agente:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (confirm('Tem certeza que deseja excluir este agente?')) {
      try {
        await deleteAgent(agentId)
      } catch (err) {
        console.error('Erro ao deletar agente:', err)
      }
    }
  }

  const testDifyConnection = async (difyConfig: any) => {
    if (!difyConfig?.apiKey || !difyConfig?.baseUrl) {
      alert('Por favor, preencha a chave de API e URL base do DIFY')
      return
    }

    setTestingDify(true)
    setDifyTestResult(null)

    try {
      const response = await fetch(`${difyConfig.baseUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${difyConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: 'Teste de conexão',
          response_mode: 'streaming',
          conversation_id: difyConfig.conversationId || '',
          user: 'test-user'
        })
      })

      if (response.ok) {
        // Para streaming, apenas verificamos se a conexão foi estabelecida
        setDifyTestResult({
          success: true,
          message: 'Conexão com DIFY estabelecida com sucesso! API está respondendo.'
        })
      } else {
        const errorText = await response.text()
        setDifyTestResult({
          success: false,
          message: `Erro na conexão: ${response.status} - ${errorText}`
        })
      }
    } catch (error) {
      setDifyTestResult({
        success: false,
        message: `Erro na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      })
    } finally {
      setTestingDify(false)
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
                src="/AfyaCompleto.png"
                alt="Logomarca AFYA"
                width={120}
                height={40}
                className="object-contain"
              />
              <span className="text-lg font-bold text-[#232323]">Configurações do Sistema</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={async () => {
                  if (confirm('Tem certeza que deseja resetar todos os agentes para as configurações padrão? Esta ação não pode ser desfeita.')) {
                    try {
                      await resetToDefaultAgents()
                    } catch (err) {
                      console.error('Erro ao resetar agentes:', err)
                    }
                  }
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                title="Resetar agentes para padrões"
              >
                Resetar Agentes
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-[#8E9794] hover:text-[#CE0058] transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'agents', label: 'Agentes de IA', icon: Brain },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'system', label: 'Sistema', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-[#CE0058] text-[#CE0058]'
                    : 'border-transparent text-[#8E9794] hover:text-[#232323] hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'agents' && (
          <div>
            {/* Header da seção */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#232323]">Agentes de IA</h2>
                <p className="text-[#8E9794] mt-1">Gerencie os agentes de inteligência artificial do sistema</p>
              </div>
              <button
                onClick={handleCreateAgent}
                className="bg-[#CE0058] text-white px-4 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Agente
              </button>
            </div>

            {/* Indicadores de estado */}
            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-blue-700">Carregando agentes...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">Erro: {error}</span>
                </div>
              </div>
            )}

            {/* Lista de agentes */}
            {!loading && agents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${agent.color} bg-gradient-to-br`}>
                          {agent.icon === 'brain' && <Brain className="w-6 h-6 text-white" />}
                          {agent.icon === 'graduation-cap' && <GraduationCap className="w-6 h-6 text-white" />}
                          {agent.icon === 'users' && <Users className="w-6 h-6 text-white" />}
                          {agent.icon === 'shield' && <Shield className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#232323]">{agent.name}</h3>
                          <p className="text-sm text-[#8E9794]">{agent.model}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAgent(agent)}
                          className="p-2 text-[#8E9794] hover:text-[#CE0058] transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="p-2 text-[#8E9794] hover:text-red-500 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#8E9794] mb-4 line-clamp-2">{agent.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs text-[#8E9794]">
                          {agent.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <span className="text-xs text-[#8E9794]">
                        {new Date(agent.updatedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && agents.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-[#8E9794] mb-2">Nenhum agente encontrado</h3>
                <p className="text-sm text-[#8E9794]">Clique em "Novo Agente" para criar o primeiro agente do sistema.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-[#8E9794] mb-2">Gestão de Usuários</h3>
            <p className="text-sm text-[#8E9794]">Funcionalidade em desenvolvimento.</p>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-[#8E9794] mb-2">Configurações do Sistema</h3>
            <p className="text-sm text-[#8E9794]">Funcionalidade em desenvolvimento.</p>
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
                                type: e.target.value as 'rag' | 'vector' | 'database' | 'dify'
                              }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                          >
                            <option value="rag">RAG (Retrieval-Augmented Generation)</option>
                            <option value="vector">Base Vetorial</option>
                            <option value="database">Base de Dados</option>
                            <option value="dify">DIFY - Base de Conhecimento</option>
                          </select>
                        </div>
                        
                        {editingAgent.knowledgeBase.type === 'dify' && (
                          <div>
                            <button
                              type="button"
                              onClick={() => setEditingAgent({
                                ...editingAgent,
                                knowledgeBase: {
                                  ...editingAgent.knowledgeBase,
                                  difyConfig: {
                                    apiKey: 'app-AbEffSO5R4mJSj7EYk15jpUE',
                                    baseUrl: 'http://192.168.1.184/v1',
                                    conversationId: ''
                                  }
                                }
                              })}
                              className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
                            >
                              <Key className="w-4 h-4" />
                              Preencher Dados Padrão
                            </button>
                          </div>
                        )}
                        
                        {editingAgent.knowledgeBase.type === 'dify' ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-[#232323] mb-2">
                                URL Base do DIFY
                              </label>
                              <input
                                type="text"
                                value={editingAgent.knowledgeBase.difyConfig?.baseUrl || ''}
                                onChange={(e) => setEditingAgent({
                                  ...editingAgent,
                                  knowledgeBase: {
                                    ...editingAgent.knowledgeBase,
                                    difyConfig: {
                                      apiKey: editingAgent.knowledgeBase.difyConfig?.apiKey || '',
                                      baseUrl: e.target.value,
                                      conversationId: editingAgent.knowledgeBase.difyConfig?.conversationId || ''
                                    }
                                  }
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                                placeholder="Ex: http://192.168.1.184/v1"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-[#232323] mb-2">
                                Chave de API DIFY
                              </label>
                              <input
                                type="password"
                                value={editingAgent.knowledgeBase.difyConfig?.apiKey || ''}
                                onChange={(e) => setEditingAgent({
                                  ...editingAgent,
                                  knowledgeBase: {
                                    ...editingAgent.knowledgeBase,
                                    difyConfig: {
                                      apiKey: e.target.value,
                                      baseUrl: editingAgent.knowledgeBase.difyConfig?.baseUrl || '',
                                      conversationId: editingAgent.knowledgeBase.difyConfig?.conversationId || ''
                                    }
                                  }
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                                placeholder="Ex: app-AbEffSO5R4mJSj7EYk15jpUE"
                              />
                            </div>
                            
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-[#232323] mb-2">
                                ID da Conversa (Opcional)
                              </label>
                              <input
                                type="text"
                                value={editingAgent.knowledgeBase.difyConfig?.conversationId || ''}
                                onChange={(e) => setEditingAgent({
                                  ...editingAgent,
                                  knowledgeBase: {
                                    ...editingAgent.knowledgeBase,
                                    difyConfig: {
                                      apiKey: editingAgent.knowledgeBase.difyConfig?.apiKey || '',
                                      baseUrl: editingAgent.knowledgeBase.difyConfig?.baseUrl || '',
                                      conversationId: e.target.value
                                    }
                                  }
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                                placeholder="Deixe vazio para nova conversa"
                              />
                            </div>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                        
                        {editingAgent.knowledgeBase.enabled && editingAgent.knowledgeBase.type === 'dify' && (
                          <div className="col-span-2 mt-4 space-y-3">
                            <button
                              type="button"
                              onClick={() => testDifyConnection(editingAgent.knowledgeBase.difyConfig)}
                              disabled={testingDify}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                              {testingDify ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <TestTube className="w-4 h-4" />
                              )}
                              {testingDify ? 'Testando...' : 'Testar Conexão DIFY'}
                            </button>
                            
                            {difyTestResult && (
                              <div className={`p-3 rounded-lg ${difyTestResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex items-center gap-2">
                                  {difyTestResult.success ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                  )}
                                  <span className={`text-sm ${difyTestResult.success ? 'text-green-700' : 'text-red-700'}`}>
                                    {difyTestResult.message}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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
                  disabled={!editingAgent.name || !editingAgent.description || !(editingAgent.instructions && typeof editingAgent.instructions === 'string' && editingAgent.instructions.trim()) || saving}
                  className="bg-[#CE0058] text-white px-6 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Save className="w-4 h-4 inline mr-2" />
                  )}
                  {isCreating ? 'Criar Agente' : 'Salvar Agente'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
