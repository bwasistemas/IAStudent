'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAgents } from '@/contexts/AgentsContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Brain, 
  GraduationCap, 
  MessageSquare, 
  Send, 
  Upload, 
  FileText, 
  X, 
  Download,
  Shield,
  Eye,
  User,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent' | 'system'
  timestamp: Date
  agentName?: string
  documents?: Document[]
  type?: 'text' | 'typing' | 'tool_call' | 'error'
  isStreaming?: boolean
}

interface Document {
  id: string
  name: string
  type: 'historico' | 'ementa' | 'outro'
  url: string
  uploadedAt: string
  size: string
}

interface Agent {
  id: string
  name: string
  description: string
  icon: string
  color: string
  model: string
  instructions: string
}

interface Analysis {
  id: string
  studentName: string
  type: 'transferencia' | 'portador'
  status: 'aprovado' | 'rejeitado' | 'pendente'
  documents: Document[]
}

// Dados mock para análises
const MOCK_ANALYSES: Analysis[] = [
  {
    id: '1',
    studentName: 'Maria Silva Santos',
    type: 'transferencia',
    status: 'pendente',
    documents: [
      { id: 'doc1', name: 'Historico 2023.pdf', type: 'historico', url: '/documents/historico1.pdf', uploadedAt: '2024-01-14', size: '1.2MB' },
      { id: 'doc2', name: 'Ementa Matematica.pdf', type: 'ementa', url: '/documents/ementa1.pdf', uploadedAt: '2024-01-13', size: '500KB' },
      { id: 'doc3', name: 'Ementa Fisica.pdf', type: 'ementa', url: '/documents/ementa2.pdf', uploadedAt: '2024-01-12', size: '800KB' }
    ]
  }
]

export function PlaygroundPage() {
  const { user, logout } = useAuth()
  const { agents } = useAgents()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [, setCurrentAnalysis] = useState<Analysis | null>(null)
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll automático para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Função para renderizar ícone baseado no nome do ícone
  const renderIcon = (iconName: string, size = 'w-6 h-6') => {
    const iconClass = `${size} text-white`
    switch (iconName) {
      case '👨‍🏫':
        return <User className={iconClass} />
      case '🔍':
        return <Eye className={iconClass} />
      case '🎓':
        return <GraduationCap className={iconClass} />
      default:
        return <Brain className={iconClass} />
    }
  }

  // Verificar status do backend
  const checkBackendStatus = async () => {
    try {
      setBackendStatus('checking')
      const response = await fetch('http://localhost:7777/', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 segundos timeout
      })
      if (response.ok) {
        setBackendStatus('connected')
        setIsConnected(true)
      } else {
        setBackendStatus('error')
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Backend connection failed:', error)
      setBackendStatus('error')
      setIsConnected(false)
    }
  }

  // Verificar backend na inicialização
  useEffect(() => {
    checkBackendStatus()
  }, [])

  // Verificar se há uma análise específica na URL
  useEffect(() => {
    const analysisId = searchParams.get('analysis')
    if (analysisId) {
      const analysis = MOCK_ANALYSES.find(a => a.id === analysisId)
      if (analysis) {
        setCurrentAnalysis(analysis)
        setUploadedDocuments(analysis.documents)
        
        // Mensagem inicial do sistema
        const systemMessage: Message = {
          id: 'system-1',
          content: `Análise iniciada para ${analysis.studentName} (${analysis.type === 'transferencia' ? 'Transferência Externa' : 'Portador de Diploma'}). Documentos disponíveis: ${analysis.documents.length} arquivos anexados.`,
          sender: 'agent',
          timestamp: new Date(),
          agentName: 'Sistema',
          documents: analysis.documents
        }
        setMessages([systemMessage])
      }
    }
  }, [searchParams])

  // Verificar se há um agente selecionado na URL
  useEffect(() => {
    const agentId = searchParams.get('agent')
    if (agentId && agents.length > 0 && !selectedAgent) {
      const agent = agents.find(a => a.id === agentId)
      if (agent) {
        handleAgentSelect(agent)
      }
    }
  }, [searchParams, agents, selectedAgent])


  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent || isLoading) {
      return
    }

    if (!isConnected) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: '⚠️ **Erro de Conexão**\n\nNão foi possível conectar ao backend. Verifique se o servidor Python está rodando em http://localhost:7777',
        sender: 'system',
        timestamp: new Date(),
        type: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    const currentInput = inputMessage
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Adicionar mensagem de typing
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      content: '',
      sender: 'agent',
      timestamp: new Date(),
      agentName: selectedAgent.name,
      type: 'typing'
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      // Fazer requisição real para o backend Agno
      const response = await fetch('http://localhost:7777/playground/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          agent_id: selectedAgent.name,  // Usar nome do agente
          session_id: `session-${selectedAgent.id}-${Date.now()}`,
          stream: false
        })
      })

      // Remover mensagem de typing
      setMessages(prev => prev.filter(m => m.id !== typingMessage.id))

      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`)
      }

      const data = await response.json()
      
      let responseContent = ''
      if (data.content) {
        responseContent = Array.isArray(data.content) ? 
          data.content.map((c: { text?: string; content?: string }) => c.text || c.content || '').join('\n') :
          data.content
      } else if (data.message) {
        responseContent = data.message
      } else {
        responseContent = 'Resposta recebida, mas formato inesperado.'
      }

      const agentMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: 'agent',
        timestamp: new Date(),
        agentName: selectedAgent.name,
        type: 'text'
      }
      
      setMessages(prev => [...prev, agentMessage])
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      // Remover mensagem de typing se ainda estiver lá
      setMessages(prev => prev.filter(m => m.id !== typingMessage.id))
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `😔 **Erro na Comunicação**\n\nNão foi possível obter resposta do agente. Detalhes: ${error instanceof Error ? error.message : 'Erro desconhecido'}\n\n🔍 Verifique se o backend Python está rodando corretamente.`,
        sender: 'system',
        timestamp: new Date(),
        type: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }


  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newDocs: Document[] = Array.from(files).map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        name: file.name,
        type: file.name.toLowerCase().includes('historico') ? 'historico' : 
              file.name.toLowerCase().includes('ementa') ? 'ementa' : 'outro',
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
      }))
      setUploadedDocuments(prev => [...prev, ...newDocs])
    }
  }

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent)
    setMessages([])
    setCurrentAnalysis(null)
    setUploadedDocuments([])
    
    // Adicionar mensagem de boas-vindas mais amigável
    const welcomeMessage: Message = {
      id: 'agent-welcome',
      content: `👋 **Olá! Sou o ${agent.name}**\n\n🎯 **Minha especialidade:** ${agent.description}\n\n🤖 **O que posso fazer:**\n• Analisar documentos acadêmicos\n• Consultar histórico de análises\n• Verificar compatibilidade curricular\n• Orientar sobre procedimentos\n\n💬 **Como posso ajudá-lo hoje?**\nFaça sua pergunta ou faça upload de documentos para análise.`,
      sender: 'agent',
      timestamp: new Date(),
      agentName: agent.name,
      type: 'text'
    }
    
    setMessages([welcomeMessage])
  }

  if (!selectedAgent) {
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
                  <X className="w-5 h-5 text-[#8E9794]" />
                </button>
                <Image
                  src="/Afya.png"
                  alt="Logomarca Afya"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-lg font-bold text-[#232323]">Playground dos Agentes</span>
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
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Seleção de Agente */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#232323] mb-4">
              🤖 Playground de Agentes IA
            </h1>
            <p className="text-lg text-[#8E9794] max-w-3xl mx-auto">
              Interaja com nossos agentes especializados em análise acadêmica. 
              Eles têm acesso ao dataset completo de análises dos alunos e podem consultar 
              histórico acadêmico, feedback da IA e status de integração TOTVS.
            </p>
          </div>

          {/* Informações sobre ferramentas disponíveis */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#232323] mb-4 flex items-center gap-2">
              🛠️ Ferramentas Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-[#232323] mb-2">📊 Consulta ao Dataset</h3>
                <p className="text-[#8E9794]">
                  Os agentes podem consultar o dataset completo de análises dos alunos, incluindo:
                  histórico acadêmico, documentos analisados, feedback da IA e status TOTVS.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#232323] mb-2">🔍 Busca na Web</h3>
                <p className="text-[#8E9794]">
                  Acesso a informações atualizadas na internet para complementar análises
                  e fornecer contexto adicional sobre instituições e cursos.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl`}
                       style={{ backgroundColor: agent.color }}>
                    {renderIcon(agent.icon)}
                  </div>
                  <h3 className="text-lg font-semibold text-[#232323] mb-2">{agent.name}</h3>
                  <p className="text-sm text-[#8E9794] mb-4">{agent.description}</p>
                  <div className="text-xs text-[#8E9794] mb-4 space-y-1">
                    <p><strong>Modelo:</strong> {agent.model}</p>
                    <p><strong>Ferramentas:</strong> Dataset de Análises + Web Search</p>
                    <p><strong>Especialidade:</strong> {agent.name === 'Coordenador' ? 'Coordenação Acadêmica' : 
                                                        agent.name === 'Analisador' ? 'Análise de Documentos' : 
                                                        'Regras e Procedimentos'}</p>
                  </div>
                  <button
                    onClick={() => handleAgentSelect(agent)}
                    className="w-full bg-[#CE0058] text-white px-4 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors"
                  >
                    Selecionar Agente
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
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
                onClick={() => setSelectedAgent(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#8E9794]" />
              </button>
              <Image
                src="/Afya.png"
                alt="Logomarca Afya"
                width={32}
                height={32}
                className="object-contain"
              />
              <div>
                <span className="text-lg font-bold text-[#232323]">Playground dos Agentes</span>
                <p className="text-sm text-[#8E9794]">Conversando com: {selectedAgent.name}</p>
              </div>
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
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Documentos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#232323] mb-4">Documentos</h3>
              
              {/* Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#8E9794] mb-2">
                  Adicionar Documentos
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="block w-full text-sm text-[#8E9794] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#CE0058] file:text-white hover:file:bg-[#B91C5C]"
                />
              </div>

              {/* Lista de documentos */}
              <div className="space-y-3">
                {uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      doc.type === 'historico' ? 'bg-pink-100 text-[#CE0058]' :
                      doc.type === 'ementa' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {doc.type === 'historico' && <FileText className="w-4 h-4" />}
                      {doc.type === 'ementa' && <GraduationCap className="w-4 h-4" />}
                      {doc.type === 'outro' && <Shield className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#232323] truncate">{doc.name}</p>
                      <p className="text-xs text-[#8E9794]">{doc.size}</p>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 text-[#8E9794] hover:text-[#CE0058] transition-colors">
                        <Shield className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-[#8E9794] hover:text-[#CE0058] transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {uploadedDocuments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Nenhum documento anexado</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-[#CE0058] via-[#B91C5C] to-[#A21857] text-white p-6 rounded-t-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      {renderIcon(selectedAgent.icon, 'w-7 h-7')}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        {selectedAgent.name}
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                      </h2>
                      <p className="text-white/80 text-sm">{selectedAgent.model} • {selectedAgent.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          isConnected ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <span className="text-xs text-white/70">
                          {isConnected ? 'Online e pronto' : 'Desconectado'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-xs font-medium">{messages.length} mensagens</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl mb-6">
                      <MessageSquare className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Pronto para começar!</h3>
                    <p className="text-gray-600 max-w-md mx-auto leading-relaxed">Faça uma pergunta sobre análise de documentos acadêmicos ou peça ajuda com aproveitamento de disciplinas.</p>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                      <button 
                        onClick={() => setInputMessage('Como analisar um histórico acadêmico?')}
                        className="bg-pink-50 hover:bg-pink-100 text-[#CE0058] px-4 py-2 rounded-lg text-sm transition-colors border border-pink-200"
                      >
                        💡 Analisar histórico
                      </button>
                      <button 
                        onClick={() => setInputMessage('Quais documentos preciso para transferência?')}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        📄 Documentos necessários
                      </button>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    if (message.type === 'typing') {
                      return (
                        <div key={message.id} className="flex justify-start">
                          <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-[70%] shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-[#CE0058] to-[#B91C5C] rounded-full flex items-center justify-center">
                                {renderIcon(selectedAgent.icon, 'w-4 h-4')}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{selectedAgent.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-[#CE0058] rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-[#CE0058] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-[#CE0058] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                              <span className="text-sm text-gray-500">Digitando...</span>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.sender === 'user' ? 'ml-12' : 'mr-12'}`}>
                          {message.sender !== 'user' && (
                            <div className="flex items-center gap-2 mb-2 ml-1">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                message.type === 'error' ? 'bg-red-100' : 'bg-gradient-to-br from-[#CE0058] to-[#B91C5C]'
                              }`}>
                                {message.type === 'error' ? 
                                  <AlertTriangle className="w-4 h-4 text-red-600" /> :
                                  renderIcon(selectedAgent.icon, 'w-3 h-3')
                                }
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {message.type === 'error' ? 'Sistema' : message.agentName}
                              </span>
                              <div className={`w-2 h-2 rounded-full ${
                                isConnected ? 'bg-green-400' : 'bg-red-400'
                              }`} />
                            </div>
                          )}
                          
                          <div className={`rounded-2xl p-4 shadow-sm ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-br from-[#CE0058] to-[#B91C5C] text-white'
                              : message.type === 'error'
                              ? 'bg-red-50 border border-red-200 text-red-800'
                              : 'bg-white border border-gray-200 text-gray-800'
                          }`}>
                            <div className="text-sm leading-relaxed whitespace-pre-line">
                              {message.content}
                            </div>
                            <div className={`text-xs mt-3 pt-2 border-t ${
                              message.sender === 'user' 
                                ? 'border-white/20 text-white/70'
                                : message.type === 'error'
                                ? 'border-red-200 text-red-600'
                                : 'border-gray-200 text-gray-500'
                            } flex justify-between items-center`}>
                              <span>
                                {message.timestamp.toLocaleTimeString('pt-BR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {message.sender === 'user' && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 bg-white p-6">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent resize-none min-h-[50px] max-h-32"
                        disabled={isLoading || !isConnected}
                        rows={1}
                        style={{ 
                          height: 'auto',
                          minHeight: '50px'
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement
                          target.style.height = 'auto'
                          target.style.height = Math.min(target.scrollHeight, 128) + 'px'
                        }}
                      />
                      {inputMessage && (
                        <button
                          onClick={() => setInputMessage('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {isConnected ? (
                          <><CheckCircle className="w-3 h-3 text-green-500" /> Backend conectado</>
                        ) : (
                          <><AlertTriangle className="w-3 h-3 text-red-500" /> Backend offline</>
                        )}
                      </span>
                      <span>{inputMessage.length}/2000 caracteres</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading || !isConnected}
                    className={`p-4 rounded-2xl transition-all duration-200 ${
                      !inputMessage.trim() || isLoading || !isConnected
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-br from-[#CE0058] to-[#B91C5C] text-white hover:shadow-lg hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
