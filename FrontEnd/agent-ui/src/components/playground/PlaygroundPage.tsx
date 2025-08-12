'use client'

import React, { useState, useEffect } from 'react'
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
  Users,
  Shield
} from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
  agentName?: string
  documents?: Document[]
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
  icon: React.ReactNode
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
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null)
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([])

  // Converter os agentes para o formato esperado pelo componente
  const AGENTS = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    icon: agent.icon === 'brain' ? <Brain className="w-6 h-6" /> : 
          agent.icon === 'graduation-cap' ? <GraduationCap className="w-6 h-6" /> :
          agent.icon === 'users' ? <Users className="w-6 h-6" /> :
          <Shield className="w-6 h-6" />,
    color: agent.color,
    model: agent.model,
    instructions: agent.instructions
  }))

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

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simular resposta inteligente do agente baseada no contexto
    setTimeout(() => {
      let response = ''
      
      if (currentAnalysis && uploadedDocuments.length > 0) {
        // Resposta contextualizada com documentos
        response = `Analisando os documentos de ${currentAnalysis.studentName}...
        
📋 **Documentos identificados:**
${uploadedDocuments.map(doc => `• ${doc.name} (${doc.type})`).join('\n')}

🔍 **Análise em andamento:**
${inputMessage.toLowerCase().includes('aproveitamento') ? 
  'Calculando percentual de aproveitamento das disciplinas...' :
  inputMessage.toLowerCase().includes('equivalência') ?
  'Verificando equivalências entre matrizes curriculares...' :
  'Processando informações dos documentos para análise acadêmica...'
}

💡 **Próximos passos:**
1. Validação de autenticidade dos documentos
2. Análise comparativa de ementas
3. Cálculo de equivalências
4. Recomendação de aproveitamento

Como posso ajudá-lo com mais detalhes específicos?`
      } else {
              // Resposta geral do agente
      response = `Olá! Sou o ${selectedAgent.name}. 

${selectedAgent.instructions.split('\n').slice(0, 5).join('\n')}

${inputMessage.toLowerCase().includes('documento') ? 
  'Para analisar documentos, por favor faça o upload dos arquivos necessários.' :
  'Como posso ajudá-lo com a análise de documentos acadêmicos?'
}`
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'agent',
        timestamp: new Date(),
        agentName: selectedAgent.name,
        documents: uploadedDocuments
      }
      setMessages(prev => [...prev, agentMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#232323] mb-4">
              Escolha seu Agente de IA
            </h1>
            <p className="text-lg text-[#8E9794] max-w-2xl mx-auto">
              Selecione um agente especializado para começar a análise inteligente de documentos acadêmicos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AGENTS.map((agent) => (
              <div 
                key={agent.id}
                className={`bg-gradient-to-br ${agent.color} rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{agent.name}</h3>
                    <p className="text-white/80 text-sm">{agent.model}</p>
                  </div>
                </div>
                
                <p className="text-white/90 mb-6 leading-relaxed">
                  {agent.description}
                </p>
                
                <div className="flex items-center gap-2 text-white/80">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Clique para conversar</span>
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
                      doc.type === 'historico' ? 'bg-blue-100 text-blue-600' :
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
              <div className={`bg-gradient-to-r ${selectedAgent.color} text-white p-6 rounded-t-xl`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    {selectedAgent.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                    <p className="text-white/80 text-sm">{selectedAgent.model}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Inicie uma conversa</h3>
                    <p className="text-sm">Faça uma pergunta sobre análise de documentos acadêmicos</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          message.sender === 'user'
                            ? 'bg-[#CE0058] text-white'
                            : 'bg-gray-100 text-[#232323]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {message.sender === 'agent' && (
                            <div className="w-6 h-6 bg-[#CE0058] rounded-full flex items-center justify-center">
                              <Brain className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <span className="text-xs opacity-70">
                            {message.sender === 'user' ? 'Você' : message.agentName}
                          </span>
                        </div>
                        <div className="text-sm leading-relaxed whitespace-pre-line">{message.content}</div>
                        <span className="text-xs opacity-70 mt-2 block">
                          {message.timestamp.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-[#232323] rounded-lg p-4 max-w-[70%]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-[#CE0058] rounded-full flex items-center justify-center">
                          <Brain className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs opacity-70">{selectedAgent.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse">⏳</div>
                        <span className="text-sm">Analisando documentos...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-[#CE0058] text-white px-6 py-3 rounded-lg hover:bg-[#B91C5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ações adicionais */}
            <div className="mt-6 flex justify-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-[#8E9794]">
                <FileText className="w-4 h-4" />
                Exportar Análise
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-[#8E9794]">
                <Users className="w-4 h-4" />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
