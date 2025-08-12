'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  FileText, 
  GraduationCap, 
  BarChart3, 
  Bell, 
  LogOut, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare,
  Brain,
  Database,
  Download,
  Eye,
  RefreshCw,
  User,
  Settings,
  Search,
  Filter,
  MoreVertical,
  Archive,
  Mail,
  Phone,
  MapPin,
  Building,
  BookOpen,
  Award,
  Target,
  Zap,
  Upload,
  Edit,
  Trash2,
  Share2,
  Star,
  Flag
} from 'lucide-react'
import Image from 'next/image'

// Interfaces expandidas
interface Document {
  id: string
  name: string
  type: 'historico' | 'ementa' | 'certificado' | 'declaracao' | 'outro'
  url: string
  uploadedAt: string
  size: string
  status: 'pendente' | 'analisado' | 'aprovado' | 'rejeitado'
  aiAnalysis?: {
    score: number
    observations: string
    suggestions: string[]
  }
}

interface Student {
  id: string
  name: string
  idps: string
  cpf: string
  email: string
  phone: string
  birthDate: string
  address?: {
    street: string
    city: string
    state: string
    cep: string
  }
}

interface AcademicInfo {
  previousInstitution: string
  previousCourse: string
  completedCredits: number
  totalCredits: number
  cr: number
  graduationDate?: string
  registrationNumber: string
}

interface Analysis {
  id: string
  student: Student
  academic: AcademicInfo
  type: 'transferencia' | 'portador'
  status: 'aprovado' | 'rejeitado' | 'pendente' | 'em_analise' | 'aguardando_documentos'
  priority: 'alta' | 'media' | 'baixa'
  createdAt: string
  updatedAt: string
  assignedTo?: string
  coligada: string
  filial: string
  targetCourse: string
  processNumber: string
  documents: Document[]
  aiAnalysis?: {
    overallScore: number
    compatibility: number
    recommendations: string[]
    risks: string[]
    estimatedProcessingTime: number
  }
  comments: Array<{
    id: string
    author: string
    content: string
    createdAt: string
    type: 'comment' | 'status_change' | 'approval' | 'rejection'
  }>
  timeline: Array<{
    id: string
    action: string
    actor: string
    timestamp: string
    details?: string
  }>
}

// Dados mock mais robustos
const MOCK_ANALYSES: Analysis[] = [
  {
    id: "1",
    student: {
      id: "std001",
      name: "Maria Silva Santos",
      idps: "156",
      cpf: "123.456.789-00",
      email: "maria.silva@email.com",
      phone: "(27) 99999-9999",
      birthDate: "1995-03-15",
      address: {
        street: "Rua das Flores, 123",
        city: "Vila Velha",
        state: "ES",
        cep: "29100-000"
      }
    },
    academic: {
      previousInstitution: "Universidade Federal do Espírito Santo",
      previousCourse: "Engenharia Civil",
      completedCredits: 185,
      totalCredits: 220,
      cr: 8.5,
      graduationDate: "2023-12-15",
      registrationNumber: "2019123456"
    },
    type: "transferencia",
    status: "pendente",
    priority: "alta",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:22:00Z",
    assignedTo: "Dr. João Coordenador",
    coligada: "PVT SOFTWARE",
    filial: "Vila Velha ES",
    targetCourse: "Engenharia de Software",
    processNumber: "TE-2024-001",
    documents: [
      {
        id: 'doc1',
        name: 'Historico_Completo_2023.pdf',
        type: 'historico',
        url: '/documents/historico1.pdf',
        uploadedAt: '2024-01-14T10:00:00Z',
        size: '2.1MB',
        status: 'analisado',
        aiAnalysis: {
          score: 92,
          observations: 'Histórico acadêmico completo e regular. Todas as disciplinas de exatas apresentam boa compatibilidade.',
          suggestions: ['Verificar ementa de Cálculo III', 'Validar carga horária de Física Experimental']
        }
      },
      {
        id: 'doc2',
        name: 'Ementas_Disciplinas_Matematica.pdf',
        type: 'ementa',
        url: '/documents/ementa1.pdf',
        uploadedAt: '2024-01-13T15:30:00Z',
        size: '1.5MB',
        status: 'analisado',
        aiAnalysis: {
          score: 88,
          observations: 'Ementas detalhadas com boa compatibilidade curricular. Carga horária adequada.',
          suggestions: ['Solicitar ementa de Álgebra Linear', 'Verificar pré-requisitos']
        }
      },
      {
        id: 'doc3',
        name: 'Certificado_Conclusao.pdf',
        type: 'certificado',
        url: '/documents/cert1.pdf',
        uploadedAt: '2024-01-12T09:15:00Z',
        size: '800KB',
        status: 'aprovado',
        aiAnalysis: {
          score: 98,
          observations: 'Certificado válido e autêntico. Instituição reconhecida pelo MEC.',
          suggestions: []
        }
      }
    ],
    aiAnalysis: {
      overallScore: 89,
      compatibility: 85,
      recommendations: [
        'Estudante com excelente perfil acadêmico',
        'Aproveitamento estimado de 85% das disciplinas',
        'Recomenda-se aprovação com complementação mínima'
      ],
      risks: [
        'Verificar autenticidade dos documentos',
        'Confirmar reconhecimento da instituição origem'
      ],
      estimatedProcessingTime: 5
    },
    comments: [
      {
        id: 'c1',
        author: 'Dr. João Coordenador',
        content: 'Documentação completa. Iniciando análise detalhada.',
        createdAt: '2024-01-15T11:00:00Z',
        type: 'comment'
      },
      {
        id: 'c2',
        author: 'Sistema IA',
        content: 'Análise automática concluída. Score: 89/100',
        createdAt: '2024-01-15T11:30:00Z',
        type: 'status_change'
      }
    ],
    timeline: [
      {
        id: 't1',
        action: 'Processo criado',
        actor: 'Maria Silva Santos',
        timestamp: '2024-01-15T10:30:00Z',
        details: 'Documentos iniciais enviados'
      },
      {
        id: 't2',
        action: 'Análise IA iniciada',
        actor: 'Sistema',
        timestamp: '2024-01-15T11:00:00Z'
      },
      {
        id: 't3',
        action: 'Atribuído ao coordenador',
        actor: 'Sistema',
        timestamp: '2024-01-15T11:30:00Z',
        details: 'Atribuído para Dr. João Coordenador'
      }
    ]
  },
  {
    id: "2",
    student: {
      id: "std002",
      name: "Carlos Roberto Lima",
      idps: "189",
      cpf: "987.654.321-00",
      email: "carlos.lima@email.com",
      phone: "(27) 88888-8888",
      birthDate: "1992-07-22"
    },
    academic: {
      previousInstitution: "Instituto Federal do Espírito Santo",
      previousCourse: "Técnico em Mecatrônica",
      completedCredits: 45,
      totalCredits: 50,
      cr: 9.2,
      registrationNumber: "2018987654"
    },
    type: "portador",
    status: "em_analise",
    priority: "media",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-16T09:45:00Z",
    assignedTo: "Dra. Ana Especialista",
    coligada: "PVT SOFTWARE",
    filial: "Vila Velha ES",
    targetCourse: "Ciência da Computação",
    processNumber: "PD-2024-002",
    documents: [
      {
        id: 'doc4',
        name: 'Diploma_Tecnico.pdf',
        type: 'certificado',
        url: '/documents/diploma1.pdf',
        uploadedAt: '2024-01-14T10:00:00Z',
        size: '1.2MB',
        status: 'analisado',
        aiAnalysis: {
          score: 85,
          observations: 'Diploma técnico válido. Curso relacionado à área de tecnologia.',
          suggestions: ['Verificar matriz curricular', 'Analisar disciplinas específicas']
        }
      }
    ],
    aiAnalysis: {
      overallScore: 82,
      compatibility: 75,
      recommendations: [
        'Portador de diploma técnico em área relacionada',
        'Recomenda-se análise de disciplinas específicas',
        'Possível aproveitamento de disciplinas básicas'
      ],
      risks: [
        'Curso técnico pode ter menor equivalência',
        'Verificar pré-requisitos específicos'
      ],
      estimatedProcessingTime: 7
    },
    comments: [],
    timeline: [
      {
        id: 't4',
        action: 'Processo criado',
        actor: 'Carlos Roberto Lima',
        timestamp: '2024-01-14T14:20:00Z'
      }
    ]
  }
]

export function AnaliseDocumentosPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  
  // Estados principais
  const [analyses, setAnalyses] = useState<Analysis[]>(MOCK_ANALYSES)
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [priorityFilter, setPriorityFilter] = useState<string>('todas')
  const [typeFilter, setTypeFilter] = useState<string>('todos')
  const [assignedFilter, setAssignedFilter] = useState<string>('todos')
  const [dateFilter, setDateFilter] = useState<string>('todos')
  
  // Estados de interface
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Análises filtradas
  const filteredAnalyses = useMemo(() => {
    return analyses.filter(analysis => {
      // Filtro de busca
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch = 
          analysis.student.name.toLowerCase().includes(searchLower) ||
          analysis.student.idps.includes(searchTerm) ||
          analysis.processNumber.toLowerCase().includes(searchLower) ||
          analysis.student.email.toLowerCase().includes(searchLower)
        
        if (!matchesSearch) return false
      }

      // Filtro de status
      if (statusFilter !== 'todos' && analysis.status !== statusFilter) return false
      
      // Filtro de prioridade
      if (priorityFilter !== 'todas' && analysis.priority !== priorityFilter) return false
      
      // Filtro de tipo
      if (typeFilter !== 'todos' && analysis.type !== typeFilter) return false
      
      // Filtro de responsável
      if (assignedFilter !== 'todos' && analysis.assignedTo !== assignedFilter) return false

      return true
    })
  }, [analyses, searchTerm, statusFilter, priorityFilter, typeFilter, assignedFilter])

  // Estatísticas
  const stats = useMemo(() => {
    const total = analyses.length
    const pendentes = analyses.filter(a => a.status === 'pendente').length
    const emAnalise = analyses.filter(a => a.status === 'em_analise').length
    const aprovados = analyses.filter(a => a.status === 'aprovado').length
    const rejeitados = analyses.filter(a => a.status === 'rejeitado').length
    const altaPrioridade = analyses.filter(a => a.priority === 'alta').length
    
    return { total, pendentes, emAnalise, aprovados, rejeitados, altaPrioridade }
  }, [analyses])

  // Funções utilitárias
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejeitado': return 'bg-red-100 text-red-800 border-red-200'
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'em_analise': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'aguardando_documentos': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-500'
      case 'media': return 'bg-yellow-500'
      case 'baixa': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle className="w-4 h-4" />
      case 'rejeitado': return <XCircle className="w-4 h-4" />
      case 'pendente': return <Clock className="w-4 h-4" />
      case 'em_analise': return <Eye className="w-4 h-4" />
      case 'aguardando_documentos': return <Upload className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  // Função para selecionar análise
  const handleAnalysisSelect = (analysis: Analysis) => {
    setSelectedAnalysis(analysis)
    setViewMode('detail')
  }

  // Função para ações em lote
  const handleBulkAction = (action: string) => {
    console.log(`Ação em lote: ${action} para itens:`, selectedItems)
    // Implementar ações em lote
    setSelectedItems([])
    setShowBulkActions(false)
  }

  if (viewMode === 'detail' && selectedAnalysis) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header da análise detalhada */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setViewMode('list')}
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
                <div>
                  <span className="text-lg font-bold text-[#232323]">Análise Detalhada</span>
                  <p className="text-sm text-[#8E9794]">{selectedAnalysis.processNumber}</p>
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
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo da análise detalhada */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações do estudante */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#232323]">Informações do Estudante</h2>
                  <div className="flex gap-2">
                    <button className="p-2 text-[#8E9794] hover:text-[#CE0058] transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[#8E9794] hover:text-[#CE0058] transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-[#232323] mb-3">Dados Pessoais</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#8E9794]" />
                        <span className="font-medium">{selectedAnalysis.student.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#8E9794]" />
                        <span>{selectedAnalysis.student.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#8E9794]" />
                        <span>{selectedAnalysis.student.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#8E9794]" />
                        <span>IDPS: {selectedAnalysis.student.idps}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#232323] mb-3">Informações Acadêmicas</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-[#8E9794]" />
                        <span>{selectedAnalysis.academic.previousInstitution}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#8E9794]" />
                        <span>{selectedAnalysis.academic.previousCourse}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#8E9794]" />
                        <span>CR: {selectedAnalysis.academic.cr}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#8E9794]" />
                        <span>Créditos: {selectedAnalysis.academic.completedCredits}/{selectedAnalysis.academic.totalCredits}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Análise da IA */}
              {selectedAnalysis.aiAnalysis && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-[#232323] mb-6">Análise da Inteligência Artificial</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#CE0058] mb-2">
                        {selectedAnalysis.aiAnalysis.overallScore}%
                      </div>
                      <div className="text-sm text-[#8E9794]">Score Geral</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {selectedAnalysis.aiAnalysis.compatibility}%
                      </div>
                      <div className="text-sm text-[#8E9794]">Compatibilidade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {selectedAnalysis.aiAnalysis.estimatedProcessingTime}
                      </div>
                      <div className="text-sm text-[#8E9794]">Dias Estimados</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Recomendações
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.aiAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-[#8E9794] flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        Pontos de Atenção
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.aiAnalysis.risks.map((risk, index) => (
                          <li key={index} className="text-sm text-[#8E9794] flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Documentos */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#232323] mb-6">Documentos Anexados</h2>
                
                <div className="space-y-4">
                  {selectedAnalysis.documents.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc.type === 'historico' ? 'bg-blue-100 text-blue-600' :
                            doc.type === 'ementa' ? 'bg-green-100 text-green-600' :
                            doc.type === 'certificado' ? 'bg-purple-100 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-[#232323]">{doc.name}</p>
                            <p className="text-sm text-[#8E9794]">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                            {doc.status.toUpperCase()}
                          </span>
                          <button className="p-2 text-[#8E9794] hover:text-[#CE0058] transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-[#8E9794] hover:text-[#CE0058] transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {doc.aiAnalysis && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#232323]">Análise IA</span>
                            <span className="text-sm font-bold text-[#CE0058]">{doc.aiAnalysis.score}%</span>
                          </div>
                          <p className="text-sm text-[#8E9794] mb-2">{doc.aiAnalysis.observations}</p>
                          {doc.aiAnalysis.suggestions.length > 0 && (
                            <div className="text-xs text-[#8E9794]">
                              <strong>Sugestões:</strong> {doc.aiAnalysis.suggestions.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ações */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-[#232323] mb-4">Ações</h3>
                <div className="space-y-3">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Aprovar
                  </button>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Rejeitar
                  </button>
                  <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Solicitar Documentos
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Adicionar Comentário
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-[#232323] mb-4">Status do Processo</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8E9794]">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedAnalysis.status)}`}>
                      {selectedAnalysis.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8E9794]">Prioridade:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedAnalysis.priority)}`}></div>
                      <span className="text-sm font-medium">{selectedAnalysis.priority.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8E9794]">Responsável:</span>
                    <span className="text-sm font-medium">{selectedAnalysis.assignedTo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8E9794]">Criado em:</span>
                    <span className="text-sm">{new Date(selectedAnalysis.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-[#232323] mb-4">Timeline</h3>
                <div className="space-y-4">
                  {selectedAnalysis.timeline.map((item, index) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-2 h-2 bg-[#CE0058] rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#232323]">{item.action}</p>
                        <p className="text-xs text-[#8E9794]">{item.actor} • {new Date(item.timestamp).toLocaleDateString('pt-BR')}</p>
                        {item.details && (
                          <p className="text-xs text-[#8E9794] mt-1">{item.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
              <span className="text-lg font-bold text-[#232323]">Central de Análise de Documentos</span>
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
                onClick={logout}
                className="text-[#CE0058] hover:text-[#B91C5C] transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Estatísticas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#232323]">{stats.total}</p>
                <p className="text-sm text-[#8E9794]">Total</p>
              </div>
              <Database className="w-8 h-8 text-[#8E9794]" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                <p className="text-sm text-[#8E9794]">Pendentes</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.emAnalise}</p>
                <p className="text-sm text-[#8E9794]">Em Análise</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.aprovados}</p>
                <p className="text-sm text-[#8E9794]">Aprovados</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.rejeitados}</p>
                <p className="text-sm text-[#8E9794]">Rejeitados</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-500">{stats.altaPrioridade}</p>
                <p className="text-sm text-[#8E9794]">Alta Prioridade</p>
              </div>
              <Flag className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#232323]">Filtros e Busca</h2>
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#8E9794]">{selectedItems.length} selecionados</span>
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="px-3 py-1 bg-[#CE0058] text-white rounded-lg text-sm hover:bg-[#B91C5C] transition-colors"
                  >
                    Ações em Lote
                  </button>
                </div>
              )}
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Plus className="w-4 h-4" />
                Nova Análise
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8E9794]" />
                <input
                  type="text"
                  placeholder="Buscar por nome, IDPS, processo ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro de Status */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
              >
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em Análise</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
                <option value="aguardando_documentos">Aguardando Docs</option>
              </select>
            </div>

            {/* Filtro de Prioridade */}
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
              >
                <option value="todas">Todas as Prioridades</option>
                <option value="alta">Alta Prioridade</option>
                <option value="media">Média Prioridade</option>
                <option value="baixa">Baixa Prioridade</option>
              </select>
            </div>
          </div>

          {/* Ações em lote */}
          {showBulkActions && selectedItems.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-sm font-medium text-[#232323] mb-3">Ações em Lote ({selectedItems.length} itens selecionados)</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('aprovar')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Aprovar Todos
                </button>
                <button
                  onClick={() => handleBulkAction('rejeitar')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Rejeitar Todos
                </button>
                <button
                  onClick={() => handleBulkAction('atribuir')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Atribuir
                </button>
                <button
                  onClick={() => handleBulkAction('exportar')}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Exportar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Análises */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(filteredAnalyses.map(a => a.id))
                        } else {
                          setSelectedItems([])
                        }
                      }}
                      checked={selectedItems.length === filteredAnalyses.length && filteredAnalyses.length > 0}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score IA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAnalyses.map((analysis) => (
                  <tr
                    key={analysis.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAnalysisSelect(analysis)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(analysis.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, analysis.id])
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== analysis.id))
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(analysis.priority)}`}></div>
                        <span className="text-sm font-medium text-[#232323]">{analysis.processNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#232323]">{analysis.student.name}</div>
                        <div className="text-sm text-[#8E9794]">IDPS: {analysis.student.idps}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        analysis.type === 'transferencia' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {analysis.type === 'transferencia' ? 'Transferência' : 'Portador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusColor(analysis.status)}`}>
                        {getStatusIcon(analysis.status)}
                        {analysis.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(analysis.priority)}`}></div>
                        <span className="text-sm text-[#8E9794] capitalize">{analysis.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {analysis.aiAnalysis ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#232323]">{analysis.aiAnalysis.overallScore}%</span>
                          <Brain className="w-4 h-4 text-[#CE0058]" />
                        </div>
                      ) : (
                        <span className="text-sm text-[#8E9794]">Pendente</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#8E9794]">{analysis.assignedTo || 'Não atribuído'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#8E9794]" />
                        <span className="text-sm text-[#8E9794]">
                          {new Date(analysis.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAnalysisSelect(analysis)
                          }}
                          className="bg-[#CE0058] hover:bg-[#B91C5C] text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Ver
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/analise?id=${analysis.id}`)
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                        >
                          <GraduationCap className="w-3 h-3" />
                          Disciplinas
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAnalyses.length === 0 && (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma análise encontrada</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou realizar uma nova busca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}