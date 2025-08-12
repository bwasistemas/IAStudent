'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Database,
  Link,
  Key,
  Check,
  AlertTriangle,
  Globe,
  Code,
  TestTube,
  Eye,
  EyeOff,
  Copy,
  RefreshCw
} from 'lucide-react'

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

const TOOL_TYPE_OPTIONS = [
  { value: 'api', label: 'API REST', icon: <Globe className="w-4 h-4" /> },
  { value: 'database', label: 'Base de Dados', icon: <Database className="w-4 h-4" /> },
  { value: 'webhook', label: 'Webhook', icon: <Link className="w-4 h-4" /> }
]

const METHOD_OPTIONS = ['GET', 'POST', 'PUT', 'DELETE']

const AUTH_TYPE_OPTIONS = [
  { value: 'none', label: 'Sem Autenticação' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'api_key', label: 'API Key' },
  { value: 'basic', label: 'Basic Auth' }
]

export function ToolsManagement() {
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
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})

  // Funções para gerenciamento de tools
  const handleCreateTool = () => {
    const newTool: APITool = {
      id: Date.now().toString(),
      name: '',
      description: '',
      type: 'api',
      endpoint: '',
      method: 'GET',
      authentication: {
        type: 'none'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      parameters: [],
      responseMapping: {
        dataPath: '',
        fields: []
      },
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEditingTool(newTool)
    setIsCreatingTool(true)
  }

  const handleEditTool = (tool: APITool) => {
    setEditingTool(tool)
    setIsCreatingTool(false)
  }

  const handleSaveTool = () => {
    if (!editingTool || !editingTool.name.trim() || !editingTool.endpoint.trim()) {
      return
    }

    const updatedTool = {
      ...editingTool,
      updatedAt: new Date().toISOString()
    }

    if (isCreatingTool) {
      setTools([...tools, updatedTool])
    } else {
      setTools(tools.map(t => t.id === updatedTool.id ? updatedTool : t))
    }

    setEditingTool(null)
    setIsCreatingTool(false)
  }

  const handleDeleteTool = (toolId: string) => {
    if (confirm('Tem certeza que deseja excluir esta ferramenta?')) {
      setTools(tools.filter(t => t.id !== toolId))
    }
  }

  const handleTestTool = async (tool: APITool) => {
    setTestingTool(tool.id)
    
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Atualizar status do teste
      const updatedTools = tools.map(t => 
        t.id === tool.id 
          ? { 
              ...t, 
              testStatus: 'success' as const,
              testMessage: 'Conexão bem-sucedida! API respondeu corretamente.',
              lastTested: new Date().toISOString()
            }
          : t
      )
      setTools(updatedTools)
    } catch (error) {
      const updatedTools = tools.map(t => 
        t.id === tool.id 
          ? { 
              ...t, 
              testStatus: 'error' as const,
              testMessage: 'Falha na conexão. Verifique URL e autenticação.',
              lastTested: new Date().toISOString()
            }
          : t
      )
      setTools(updatedTools)
    } finally {
      setTestingTool(null)
    }
  }

  const handleToggleToolStatus = (toolId: string) => {
    setTools(tools.map(t => 
      t.id === toolId 
        ? { ...t, isActive: !t.isActive, updatedAt: new Date().toISOString() }
        : t
    ))
  }

  const addParameter = () => {
    if (!editingTool) return
    
    setEditingTool({
      ...editingTool,
      parameters: [...editingTool.parameters, {
        name: '',
        type: 'string',
        required: false,
        description: ''
      }]
    })
  }

  const removeParameter = (index: number) => {
    if (!editingTool) return
    
    setEditingTool({
      ...editingTool,
      parameters: editingTool.parameters.filter((_, i) => i !== index)
    })
  }

  const addMappingField = () => {
    if (!editingTool) return
    
    setEditingTool({
      ...editingTool,
      responseMapping: {
        ...editingTool.responseMapping,
        fields: [...editingTool.responseMapping.fields, {
          source: '',
          target: '',
          type: 'string'
        }]
      }
    })
  }

  const removeMappingField = (index: number) => {
    if (!editingTool) return
    
    setEditingTool({
      ...editingTool,
      responseMapping: {
        ...editingTool.responseMapping,
        fields: editingTool.responseMapping.fields.filter((_, i) => i !== index)
      }
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Globe className="w-4 h-4" />
      case 'database': return <Database className="w-4 h-4" />
      case 'webhook': return <Link className="w-4 h-4" />
      default: return <Code className="w-4 h-4" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#232323]">Gerenciamento de Ferramentas</h2>
          <p className="text-[#8E9794]">Configure APIs e fontes de dados para os agentes</p>
        </div>
        <button
          onClick={handleCreateTool}
          className="bg-[#CE0058] text-white px-4 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Ferramenta
        </button>
      </div>

      {/* Lista de Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <div key={tool.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tool.type === 'api' ? 'bg-blue-100 text-blue-600' :
                  tool.type === 'database' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {getTypeIcon(tool.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-[#232323]">{tool.name}</h3>
                  <p className="text-sm text-[#8E9794]">{tool.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleToolStatus(tool.id)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    tool.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tool.isActive ? 'Ativo' : 'Inativo'}
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-[#8E9794] mb-1">Endpoint</p>
                <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">{tool.endpoint}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-[#8E9794] mb-1">Método</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    tool.method === 'GET' ? 'bg-green-100 text-green-800' :
                    tool.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                    tool.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tool.method}
                  </span>
                </div>
                
                <div>
                  <p className="text-xs text-[#8E9794] mb-1">Autenticação</p>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {tool.authentication.type === 'none' ? 'Nenhuma' : tool.authentication.type.toUpperCase()}
                  </span>
                </div>
              </div>

              {tool.lastTested && (
                <div>
                  <p className="text-xs text-[#8E9794] mb-1">Último Teste</p>
                  <div className={`px-2 py-1 rounded text-xs border flex items-center gap-2 ${getStatusColor(tool.testStatus)}`}>
                    {tool.testStatus === 'success' ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {new Date(tool.lastTested).toLocaleDateString('pt-BR')} - {tool.testMessage}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditTool(tool)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Edit className="w-3 h-3" />
                Editar
              </button>
              <button
                onClick={() => handleTestTool(tool)}
                disabled={testingTool === tool.id}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {testingTool === tool.id ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <TestTube className="w-3 h-3" />
                )}
                {testingTool === tool.id ? 'Testando...' : 'Testar'}
              </button>
              <button
                onClick={() => handleDeleteTool(tool.id)}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      {editingTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#232323]">
                {isCreatingTool ? 'Nova Ferramenta' : 'Editar Ferramenta'}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#232323] mb-2">Nome</label>
                  <input
                    type="text"
                    value={editingTool.name}
                    onChange={(e) => setEditingTool({...editingTool, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                    placeholder="Nome da ferramenta"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#232323] mb-2">Tipo</label>
                  <select
                    value={editingTool.type}
                    onChange={(e) => setEditingTool({...editingTool, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                  >
                    {TOOL_TYPE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#232323] mb-2">Descrição</label>
                <textarea
                  value={editingTool.description}
                  onChange={(e) => setEditingTool({...editingTool, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                  rows={3}
                  placeholder="Descreva o que esta ferramenta faz"
                />
              </div>

              {/* Configuração da API */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#232323] mb-2">Endpoint URL</label>
                  <input
                    type="url"
                    value={editingTool.endpoint}
                    onChange={(e) => setEditingTool({...editingTool, endpoint: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                    placeholder="https://api.exemplo.com/v1/endpoint"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#232323] mb-2">Método HTTP</label>
                  <select
                    value={editingTool.method}
                    onChange={(e) => setEditingTool({...editingTool, method: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                  >
                    {METHOD_OPTIONS.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Autenticação */}
              <div>
                <h4 className="text-lg font-semibold text-[#232323] mb-4">Autenticação</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-2">Tipo de Autenticação</label>
                    <select
                      value={editingTool.authentication.type}
                      onChange={(e) => setEditingTool({
                        ...editingTool,
                        authentication: { ...editingTool.authentication, type: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                    >
                      {AUTH_TYPE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {editingTool.authentication.type === 'bearer' && (
                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">Token</label>
                      <div className="relative">
                        <input
                          type={showPasswords[editingTool.id] ? 'text' : 'password'}
                          value={editingTool.authentication.token || ''}
                          onChange={(e) => setEditingTool({
                            ...editingTool,
                            authentication: { ...editingTool.authentication, token: e.target.value }
                          })}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                          placeholder="Bearer token"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({
                            ...showPasswords,
                            [editingTool.id]: !showPasswords[editingTool.id]
                          })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPasswords[editingTool.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {editingTool.authentication.type === 'api_key' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">API Key</label>
                        <div className="relative">
                          <input
                            type={showPasswords[editingTool.id] ? 'text' : 'password'}
                            value={editingTool.authentication.apiKey || ''}
                            onChange={(e) => setEditingTool({
                              ...editingTool,
                              authentication: { ...editingTool.authentication, apiKey: e.target.value }
                            })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                            placeholder="Sua API key"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({
                              ...showPasswords,
                              [editingTool.id]: !showPasswords[editingTool.id]
                            })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showPasswords[editingTool.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">Nome do Header</label>
                        <input
                          type="text"
                          value={editingTool.authentication.headerName || ''}
                          onChange={(e) => setEditingTool({
                            ...editingTool,
                            authentication: { ...editingTool.authentication, headerName: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                          placeholder="X-API-Key"
                        />
                      </div>
                    </div>
                  )}

                  {editingTool.authentication.type === 'basic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">Usuário</label>
                        <input
                          type="text"
                          value={editingTool.authentication.username || ''}
                          onChange={(e) => setEditingTool({
                            ...editingTool,
                            authentication: { ...editingTool.authentication, username: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                          placeholder="Nome de usuário"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">Senha</label>
                        <div className="relative">
                          <input
                            type={showPasswords[editingTool.id] ? 'text' : 'password'}
                            value={editingTool.authentication.password || ''}
                            onChange={(e) => setEditingTool({
                              ...editingTool,
                              authentication: { ...editingTool.authentication, password: e.target.value }
                            })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                            placeholder="Senha"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({
                              ...showPasswords,
                              [editingTool.id]: !showPasswords[editingTool.id]
                            })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showPasswords[editingTool.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Parâmetros */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-[#232323]">Parâmetros</h4>
                  <button
                    onClick={addParameter}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar
                  </button>
                </div>
                
                <div className="space-y-3">
                  {editingTool.parameters.map((param, index) => (
                    <div key={index} className="grid grid-cols-5 gap-3 items-end">
                      <div>
                        <label className="block text-xs text-[#8E9794] mb-1">Nome</label>
                        <input
                          type="text"
                          value={param.name}
                          onChange={(e) => {
                            const newParams = [...editingTool.parameters]
                            newParams[index] = {...param, name: e.target.value}
                            setEditingTool({...editingTool, parameters: newParams})
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="nome_param"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#8E9794] mb-1">Tipo</label>
                        <select
                          value={param.type}
                          onChange={(e) => {
                            const newParams = [...editingTool.parameters]
                            newParams[index] = {...param, type: e.target.value as any}
                            setEditingTool({...editingTool, parameters: newParams})
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-[#8E9794] mb-1">Descrição</label>
                        <input
                          type="text"
                          value={param.description}
                          onChange={(e) => {
                            const newParams = [...editingTool.parameters]
                            newParams[index] = {...param, description: e.target.value}
                            setEditingTool({...editingTool, parameters: newParams})
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Descrição do parâmetro"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={param.required}
                            onChange={(e) => {
                              const newParams = [...editingTool.parameters]
                              newParams[index] = {...param, required: e.target.checked}
                              setEditingTool({...editingTool, parameters: newParams})
                            }}
                            className="rounded"
                          />
                          Obrigatório
                        </label>
                      </div>
                      <div>
                        <button
                          onClick={() => removeParameter(index)}
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mapeamento de Resposta */}
              <div>
                <h4 className="text-lg font-semibold text-[#232323] mb-4">Mapeamento de Resposta</h4>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#232323] mb-2">Caminho dos Dados</label>
                  <input
                    type="text"
                    value={editingTool.responseMapping.dataPath}
                    onChange={(e) => setEditingTool({
                      ...editingTool,
                      responseMapping: { ...editingTool.responseMapping, dataPath: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                    placeholder="data.results ou response.items"
                  />
                  <p className="text-xs text-[#8E9794] mt-1">Caminho no JSON de resposta onde estão os dados (ex: data.items)</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-[#232323]">Campos</h5>
                  <button
                    onClick={addMappingField}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar Campo
                  </button>
                </div>
                
                <div className="space-y-3">
                  {editingTool.responseMapping.fields.map((field, index) => (
                    <div key={index} className="grid grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-xs text-[#8E9794] mb-1">Campo Origem</label>
                        <input
                          type="text"
                          value={field.source}
                          onChange={(e) => {
                            const newFields = [...editingTool.responseMapping.fields]
                            newFields[index] = {...field, source: e.target.value}
                            setEditingTool({
                              ...editingTool,
                              responseMapping: { ...editingTool.responseMapping, fields: newFields }
                            })
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="nome_campo_api"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#8E9794] mb-1">Campo Destino</label>
                        <input
                          type="text"
                          value={field.target}
                          onChange={(e) => {
                            const newFields = [...editingTool.responseMapping.fields]
                            newFields[index] = {...field, target: e.target.value}
                            setEditingTool({
                              ...editingTool,
                              responseMapping: { ...editingTool.responseMapping, fields: newFields }
                            })
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="nome_campo_agente"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#8E9794] mb-1">Tipo</label>
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const newFields = [...editingTool.responseMapping.fields]
                            newFields[index] = {...field, type: e.target.value as any}
                            setEditingTool({
                              ...editingTool,
                              responseMapping: { ...editingTool.responseMapping, fields: newFields }
                            })
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="array">Array</option>
                        </select>
                      </div>
                      <div>
                        <button
                          onClick={() => removeMappingField(index)}
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingTool(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-[#8E9794] hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTool}
                disabled={!editingTool.name || !editingTool.endpoint}
                className="bg-[#CE0058] text-white px-6 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isCreatingTool ? 'Criar Ferramenta' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}