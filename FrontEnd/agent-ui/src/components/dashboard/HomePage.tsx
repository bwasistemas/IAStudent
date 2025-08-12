'use client'

import React, { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAgents } from '@/contexts/AgentsContext'
import { 
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
  Settings
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Interfaces TypeScript
interface Analysis {
  id: string
  studentName: string
  type: 'transferencia' | 'portador'
  status: 'aprovado' | 'rejeitado' | 'pendente'
  date: string
  coordinator: string
  coligada: string
  filial: string
  nivelEnsino: string
  curso: string
  idps: string
  processoSeletivo: string
  documents: Document[]
  aiAnalysis?: AIAnalysisResult
}

interface Document {
  id: string
  name: string
  type: 'historico' | 'ementa' | 'outro'
  url: string
  uploadedAt: string
  size: string
  aiStatus?: 'analisado' | 'em_analise' | 'pendente' | 'rejeitado'
  aiRecommendation?: string
  aproveitamentoPercent?: number
  aiAnalysisDate?: string
  aiAgent?: string
  totvsIntegration?: {
    status: 'pendente' | 'integrado' | 'erro'
    lastSync?: string
    errorMessage?: string
  }
  studentInfo?: {
    cpf?: string
    email?: string
    phone?: string
    birthDate?: string
  }
  academicInfo?: {
    previousInstitution?: string
    previousCourse?: string
    completedCredits?: number
    totalCredits?: number
    gpa?: number
  }
  disciplines?: Discipline[]
  suggestedMatrix?: SuggestedMatrix
}

interface Discipline {
  code: string
  name: string
  workload: number
  grade?: number
  status: 'aprovado' | 'cursando' | 'reprovado'
  semester?: number
  credits?: number
}

interface SuggestedMatrix {
  suggestedCourse: string
  suggestedInstitution: string
  aproveitamentoDisciplinas: AproveitamentoDisciplina[]
  totalAproveitamento: number
  observacoes?: string
}

interface AproveitamentoDisciplina {
  disciplinaOrigem: Discipline
  disciplinaDestino: {
    code: string
    name: string
    workload: number
    credits: number
    semester: number
  }
  aproveitamento: 'total' | 'parcial' | 'rejeitado'
  percentualCompatibilidade: number
  observacoes?: string
}

interface AIAnalysisResult {
  status: 'em_analise' | 'concluida' | 'pendente'
  recommendation: string
  confidence: number
  suggestedCourse?: string
  aproveitamentoPercent?: number
  analysisDate?: string
}

interface Statistic {
  label: string
  value: string | number
  change: string
  icon: React.ReactNode
  color: string
}


// Dados mock
const MOCK_ANALYSES: Analysis[] = [
  {
    id: '1',
    studentName: 'Maria Silva Santos',
    type: 'transferencia',
    status: 'pendente',
    date: '2024-01-15',
    coordinator: 'Dr. Carlos Mendes',
    coligada: '1. PVT SOFTWARE',
    filial: '1. Vila Velha ES',
    nivelEnsino: 'Graduação',
    curso: 'Engenharia de Software',
    idps: '156',
    processoSeletivo: '2023/2024',
    documents: [
      { 
        id: 'doc1', 
        name: 'Historico 2023.pdf', 
        type: 'historico', 
        url: '/documents/historico1.pdf', 
        uploadedAt: '2024-01-14', 
        size: '1.2MB',
        aiStatus: 'analisado',
        aiRecommendation: 'Aproveitamento de 85% - Disciplinas de Matemática e Física compatíveis. Recomenda-se validação manual para disciplinas específicas.',
        aproveitamentoPercent: 85,
        aiAnalysisDate: '2024-01-15T10:30:00Z',
        aiAgent: 'Agente de Análise Curricular',
        totvsIntegration: {
          status: 'integrado',
          lastSync: '2024-01-15T11:00:00Z'
        },
        studentInfo: {
          cpf: '123.456.789-00',
          email: 'joao.silva@email.com',
          phone: '(27) 99999-9999',
          birthDate: '1995-03-15'
        },
        academicInfo: {
          previousInstitution: 'Universidade Federal do Espírito Santo',
          previousCourse: 'Engenharia Civil',
          completedCredits: 85,
          totalCredits: 100,
          gpa: 8.5
        },
        disciplines: [
          { code: 'MAT001', name: 'Cálculo I', workload: 60, grade: 8.5, status: 'aprovado', semester: 1, credits: 4 },
          { code: 'MAT002', name: 'Cálculo II', workload: 60, grade: 8.0, status: 'aprovado', semester: 2, credits: 4 },
          { code: 'FIS001', name: 'Física I', workload: 60, grade: 7.5, status: 'aprovado', semester: 1, credits: 4 },
          { code: 'FIS002', name: 'Física II', workload: 60, grade: 8.0, status: 'aprovado', semester: 2, credits: 4 },
          { code: 'QUI001', name: 'Química Geral', workload: 45, grade: 7.0, status: 'aprovado', semester: 1, credits: 3 },
          { code: 'MAT003', name: 'Álgebra Linear', workload: 45, grade: 8.5, status: 'aprovado', semester: 3, credits: 3 },
          { code: 'FIS003', name: 'Física III', workload: 60, grade: 7.5, status: 'aprovado', semester: 3, credits: 4 },
          { code: 'MAT004', name: 'Cálculo III', workload: 60, grade: 8.0, status: 'aprovado', semester: 4, credits: 4 }
        ],
        suggestedMatrix: {
          suggestedCourse: 'Engenharia de Software',
          suggestedInstitution: 'AFYA - Vila Velha',
          totalAproveitamento: 85,
          observacoes: 'Excelente aproveitamento em disciplinas de exatas. Recomenda-se validação de disciplinas específicas de programação.',
          aproveitamentoDisciplinas: [
            {
              disciplinaOrigem: { code: 'MAT001', name: 'Cálculo I', workload: 60, grade: 8.5, status: 'aprovado', semester: 1, credits: 4 },
              disciplinaDestino: { code: 'MAT101', name: 'Cálculo I', workload: 60, credits: 4, semester: 1 },
              aproveitamento: 'total',
              percentualCompatibilidade: 95,
              observacoes: 'Disciplina totalmente compatível'
            },
            {
              disciplinaOrigem: { code: 'MAT002', name: 'Cálculo II', workload: 60, grade: 8.0, status: 'aprovado', semester: 2, credits: 4 },
              disciplinaDestino: { code: 'MAT102', name: 'Cálculo II', workload: 60, credits: 4, semester: 2 },
              aproveitamento: 'total',
              percentualCompatibilidade: 90,
              observacoes: 'Disciplina totalmente compatível'
            },
            {
              disciplinaOrigem: { code: 'FIS001', name: 'Física I', workload: 60, grade: 7.5, status: 'aprovado', semester: 1, credits: 4 },
              disciplinaDestino: { code: 'FIS101', name: 'Física I', workload: 60, credits: 4, semester: 1 },
              aproveitamento: 'total',
              percentualCompatibilidade: 88,
              observacoes: 'Disciplina totalmente compatível'
            }
          ]
        }
      },
      { 
        id: 'doc2', 
        name: 'Ementa Matematica.pdf', 
        type: 'ementa', 
        url: '/documents/ementa1.pdf', 
        uploadedAt: '2024-01-13', 
        size: '500KB',
        aiStatus: 'analisado',
        aiRecommendation: 'Conteúdo 90% compatível com Cálculo I e II. Ementa aprovada para aproveitamento de créditos.',
        aproveitamentoPercent: 90,
        aiAnalysisDate: '2024-01-14T14:20:00Z',
        aiAgent: 'Agente de Análise de Ementas',
        totvsIntegration: {
          status: 'integrado',
          lastSync: '2024-01-14T15:00:00Z'
        },
        academicInfo: {
          previousInstitution: 'Instituto Federal do Espírito Santo',
          previousCourse: 'Técnico em Mecatrônica',
          completedCredits: 45,
          totalCredits: 50,
          gpa: 9.2
        }
      },
      { 
        id: 'doc3', 
        name: 'Carta de Recomendacao.pdf', 
        type: 'outro', 
        url: '/documents/carta1.pdf', 
        uploadedAt: '2024-01-12', 
        size: '800KB',
        aiStatus: 'pendente',
        aiRecommendation: 'Documento em análise para validação acadêmica. Aguardando processamento.',
        totvsIntegration: {
          status: 'pendente'
        },
        studentInfo: {
          cpf: '987.654.321-00',
          email: 'maria.santos@email.com',
          phone: '(27) 88888-8888',
          birthDate: '1998-07-22'
        }
      }
    ]
  },
  {
    id: '2',
    studentName: 'João Pedro Costa',
    type: 'portador',
    status: 'aprovado',
    date: '2024-01-14',
    coordinator: 'Dra. Ana Paula',
    coligada: '1. PVT SOFTWARE',
    filial: '1. Vila Velha ES',
    nivelEnsino: 'Graduação',
    curso: 'Ciência da Computação',
    idps: '189',
    processoSeletivo: '2023/2024',
    documents: [
      { 
        id: 'doc4', 
        name: 'Historico 2022.pdf', 
        type: 'historico', 
        url: '/documents/historico2.pdf', 
        uploadedAt: '2024-01-13', 
        size: '1.5MB',
        aiStatus: 'analisado',
        aiRecommendation: 'Aproveitamento de 92% - Excelente compatibilidade curricular. Todas as disciplinas foram validadas automaticamente.',
        aproveitamentoPercent: 92,
        aiAnalysisDate: '2024-01-14T09:15:00Z',
        aiAgent: 'Agente de Análise Curricular',
        totvsIntegration: {
          status: 'integrado',
          lastSync: '2024-01-14T10:00:00Z'
        },
        studentInfo: {
          cpf: '111.222.333-44',
          email: 'pedro.oliveira@email.com',
          phone: '(27) 77777-7777',
          birthDate: '1996-11-08'
        },
        academicInfo: {
          previousInstitution: 'Universidade de São Paulo',
          previousCourse: 'Ciência da Computação',
          completedCredits: 92,
          totalCredits: 100,
          gpa: 9.8
        }
      },
      { 
        id: 'doc5', 
        name: 'Ementa Fisica.pdf', 
        type: 'ementa', 
        url: '/documents/ementa2.pdf', 
        uploadedAt: '2024-01-12', 
        size: '600KB',
        aiStatus: 'analisado',
        aiRecommendation: 'Conteúdo 88% compatível com Física I e II. Aprovado com ressalvas para laboratórios.',
        aproveitamentoPercent: 88,
        aiAnalysisDate: '2024-01-13T16:45:00Z',
        aiAgent: 'Agente de Análise de Ementas',
        totvsIntegration: {
          status: 'integrado',
          lastSync: '2024-01-13T17:30:00Z'
        },
        academicInfo: {
          previousInstitution: 'Universidade Federal de Minas Gerais',
          previousCourse: 'Engenharia Mecânica',
          completedCredits: 78,
          totalCredits: 90,
          gpa: 8.7
        }
      },
      { 
        id: 'doc6', 
        name: 'Carta de Recomendacao.pdf', 
        type: 'outro', 
        url: '/documents/carta2.pdf', 
        uploadedAt: '2024-01-11', 
        size: '900KB',
        aiStatus: 'analisado',
        aiRecommendation: 'Recomendação validada e aprovada. Professor com credenciais acadêmicas confirmadas.',
        totvsIntegration: {
          status: 'integrado',
          lastSync: '2024-01-12T08:00:00Z'
        },
        studentInfo: {
          cpf: '555.666.777-88',
          email: 'ana.costa@email.com',
          phone: '(27) 66666-6666',
          birthDate: '1997-04-12'
        }
      }
    ]
  },
  {
    id: '3',
    studentName: 'Fernanda Oliveira',
    type: 'transferencia',
    status: 'rejeitado',
    date: '2024-01-13',
    coordinator: 'Dr. Roberto Lima',
    coligada: '1. PVT SOFTWARE',
    filial: '1. Vila Velha ES',
    nivelEnsino: 'Graduação',
    curso: 'Engenharia Civil',
    idps: '134',
    processoSeletivo: '2023/2024',
    documents: [
      { 
        id: 'doc7', 
        name: 'Historico 2021.pdf', 
        type: 'historico', 
        url: '/documents/historico3.pdf', 
        uploadedAt: '2024-01-12', 
        size: '1.8MB',
        aiStatus: 'rejeitado',
        aiRecommendation: 'Aproveitamento de 45% - Baixa compatibilidade curricular. Necessita revisão manual e possível complementação.',
        aproveitamentoPercent: 45,
        aiAnalysisDate: '2024-01-13T11:20:00Z',
        aiAgent: 'Agente de Análise Curricular',
        totvsIntegration: {
          status: 'erro',
          lastSync: '2024-01-13T12:00:00Z',
          errorMessage: 'Documento rejeitado pela IA - Baixa compatibilidade'
        },
        studentInfo: {
          cpf: '999.888.777-66',
          email: 'carlos.ferreira@email.com',
          phone: '(27) 55555-5555',
          birthDate: '1994-09-25'
        },
        academicInfo: {
          previousInstitution: 'Universidade Estadual do Rio de Janeiro',
          previousCourse: 'Administração',
          completedCredits: 45,
          totalCredits: 100,
          gpa: 6.8
        }
      },
      { 
        id: 'doc8', 
        name: 'Ementa Quimica.pdf', 
        type: 'ementa', 
        url: '/documents/ementa3.pdf', 
        uploadedAt: '2024-01-11', 
        size: '700KB',
        aiStatus: 'analisado',
        aiRecommendation: 'Conteúdo 35% compatível - Necessita complementação. Ementa muito específica para curso técnico.',
        aproveitamentoPercent: 35,
        aiAnalysisDate: '2024-01-12T13:10:00Z',
        aiAgent: 'Agente de Análise de Ementas',
        totvsIntegration: {
          status: 'integrado',
          lastSync: '2024-01-12T14:00:00Z'
        },
        academicInfo: {
          previousInstitution: 'Centro Federal de Educação Tecnológica',
          previousCourse: 'Técnico em Química',
          completedCredits: 35,
          totalCredits: 40,
          gpa: 7.5
        }
      },
      { 
        id: 'doc9', 
        name: 'Carta de Recomendacao.pdf', 
        type: 'outro', 
        url: '/documents/carta3.pdf', 
        uploadedAt: '2024-01-10', 
        size: '1MB',
        aiStatus: 'analisado',
        aiRecommendation: 'Recomendação validada mas com ressalvas. Professor com experiência relevante mas em área diferente.',
        totvsIntegration: {
          status: 'integrado',
          lastSync: '2024-01-11T09:00:00Z'
        },
        studentInfo: {
          cpf: '444.333.222-11',
          email: 'julia.martins@email.com',
          phone: '(27) 44444-4444',
          birthDate: '1999-01-30'
        }
      }
    ]
  },
  {
    id: '4',
    studentName: 'Lucas Mendes',
    type: 'portador',
    status: 'pendente',
    date: '2024-01-12',
    coordinator: 'Dra. Claudia Santos',
    coligada: '1. PVT SOFTWARE',
    filial: '1. Vila Velha ES',
    nivelEnsino: 'Graduação',
    curso: 'Arquitetura',
    idps: '167',
    processoSeletivo: '2023/2024',
    documents: [
      { 
        id: 'doc10', 
        name: 'Historico 2020.pdf', 
        type: 'historico', 
        url: '/documents/historico4.pdf', 
        uploadedAt: '2024-01-11', 
        size: '2MB',
        aiStatus: 'em_analise',
        aiRecommendation: 'Análise em andamento - Aguarde resultado. Processando histórico extenso.',
        totvsIntegration: {
          status: 'pendente'
        },
        studentInfo: {
          cpf: '333.222.111-00',
          email: 'roberto.almeida@email.com',
          phone: '(27) 33333-3333',
          birthDate: '1993-12-05'
        },
        academicInfo: {
          previousInstitution: 'Universidade Federal do Rio Grande do Sul',
          previousCourse: 'Engenharia Elétrica',
          completedCredits: 95,
          totalCredits: 100,
          gpa: 8.9
        }
      },
      { 
        id: 'doc11', 
        name: 'Ementa Biologia.pdf', 
        type: 'ementa', 
        url: '/documents/ementa4.pdf', 
        uploadedAt: '2024-01-10', 
        size: '800KB',
        aiStatus: 'em_analise',
        aiRecommendation: 'Processando conteúdo programático. Análise de compatibilidade em andamento.',
        totvsIntegration: {
          status: 'pendente'
        },
        academicInfo: {
          previousInstitution: 'Universidade Federal de Santa Catarina',
          previousCourse: 'Ciências Biológicas',
          completedCredits: 88,
          totalCredits: 95,
          gpa: 8.2
        }
      },
      { 
        id: 'doc12', 
        name: 'Carta de Recomendacao.pdf', 
        type: 'outro', 
        url: '/documents/carta4.pdf', 
        uploadedAt: '2024-01-09', 
        size: '1.1MB',
        aiStatus: 'pendente',
        aiRecommendation: 'Aguardando análise inicial. Documento recebido e em fila para processamento.',
        totvsIntegration: {
          status: 'pendente'
        },
        studentInfo: {
          cpf: '222.111.000-99',
          email: 'fernanda.lima@email.com',
          phone: '(27) 22222-2222',
          birthDate: '1996-06-18'
        }
      }
    ]
  },
  {
    id: '5',
    studentName: 'Amanda Ferreira',
    type: 'transferencia',
    status: 'aprovado',
    date: '2024-01-11',
    coordinator: 'Dr. Eduardo Costa',
    coligada: '1. PVT SOFTWARE',
    filial: '1. Vila Velha ES',
    nivelEnsino: 'Graduação',
    curso: 'Engenharia de Produção',
    idps: '145',
    processoSeletivo: '2023/2024',
    documents: [
      { 
        id: 'doc13', 
        name: 'Historico 2019.pdf', 
        type: 'historico', 
        url: '/documents/historico5.pdf', 
        uploadedAt: '2024-01-10', 
        size: '2.2MB',
        aiStatus: 'analisado',
        aiRecommendation: 'Aproveitamento de 78% - Boa compatibilidade. Algumas disciplinas requerem validação manual.',
        aproveitamentoPercent: 78,
        aiAnalysisDate: '2024-01-11T15:30:00Z',
        aiAgent: 'Agente de Análise Curricular',
        totvsIntegration: {
          status: 'integrado',
          lastSync: '2024-01-11T16:00:00Z'
        },
        studentInfo: {
          cpf: '111.000.999-88',
          email: 'lucas.rodrigues@email.com',
          phone: '(27) 11111-1111',
          birthDate: '1997-08-14'
        },
        academicInfo: {
          previousInstitution: 'Universidade Federal de Pernambuco',
          previousCourse: 'Arquitetura e Urbanismo',
          completedCredits: 78,
          totalCredits: 100,
          gpa: 7.8
        }
      },
      { 
        id: 'doc14', 
        name: 'Ementa Filosofia.pdf', 
        type: 'ementa', 
        url: '/documents/ementa5.pdf', 
        uploadedAt: '2024-01-09', 
        size: '900KB',
        aiStatus: 'analisado',
        aiRecommendation: 'Conteúdo 82% compatível com disciplinas de humanidades',
        aproveitamentoPercent: 82
      },
      { 
        id: 'doc15', 
        name: 'Carta de Recomendacao.pdf', 
        type: 'outro', 
        url: '/documents/carta5.pdf', 
        uploadedAt: '2024-01-08', 
        size: '1.2MB',
        aiStatus: 'analisado',
        aiRecommendation: 'Recomendação aprovada sem ressalvas'
      }
    ]
  }
]

const MOCK_STATISTICS: Statistic[] = [
  {
    label: 'Análises Pendentes',
    value: 12,
    change: '+2 hoje',
    icon: <Clock className="w-5 h-5" />,
    color: 'bg-yellow-500'
  },
  {
    label: 'Aprovações',
    value: 28,
    change: '+5 esta semana',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'bg-green-500'
  },
  {
    label: 'Coligadas Ativas',
    value: 1,
    change: 'PVT SOFTWARE',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-blue-500'
  },
  {
    label: 'Filiais',
    value: 1,
    change: 'Vila Velha/ES',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-purple-500'
  }
]


// Componente de status badge
const StatusBadge = ({ status }: { status: Analysis['status'] }) => {
  const config = {
    aprovado: { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="w-4 h-4" /> },
    rejeitado: { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-4 h-4" /> },
    pendente: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <AlertCircle className="w-4 h-4" /> }
  }

  const { color, icon } = config[status]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${color}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Componente de estatística
const StatCard = ({ stat }: { stat: Statistic }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${stat.color} text-white`}>
        {stat.icon}
      </div>
      <span className="text-sm text-gray-500">{stat.change}</span>
    </div>
    <h3 className="text-2xl font-bold text-[#232323] mb-1">{stat.value}</h3>
    <p className="text-sm text-[#8E9794]">{stat.label}</p>
  </div>
)


// Componente de badge de documento (não utilizado atualmente)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DocumentBadge = ({ document }: { document: Document }) => {
  const [showModal, setShowModal] = useState(false)

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'analisado': return 'bg-green-100 text-green-800 border-green-200'
      case 'em_analise': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pendente': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'rejeitado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'analisado': return <CheckCircle className="w-3 h-3" />
      case 'em_analise': return <Clock className="w-3 h-3" />
      case 'pendente': return <AlertCircle className="w-3 h-3" />
      case 'rejeitado': return <XCircle className="w-3 h-3" />
      default: return <FileText className="w-3 h-3" />
    }
  }

  const getTotvsStatusColor = (status?: string) => {
    switch (status) {
      case 'integrado': return 'bg-green-100 text-green-800 border-green-200'
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'erro': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTotvsStatusIcon = (status?: string) => {
    switch (status) {
      case 'integrado': return <CheckCircle className="w-4 h-4" />
      case 'pendente': return <Clock className="w-4 h-4" />
      case 'erro': return <XCircle className="w-4 h-4" />
      default: return <Database className="w-4 h-4" />
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border cursor-pointer hover:scale-105 transition-all ${
          document.type === 'historico' 
            ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
            : document.type === 'ementa'
            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-300'
        }`}
        title="Clique para ver análise completa da IA"
      >
        {document.type === 'historico' && <FileText className="w-3 h-3" />}
        {document.type === 'ementa' && <GraduationCap className="w-3 h-3" />}
        {document.name.split('.')[0].substring(0, 15)}...
        {document.aiStatus && (
          <div className={`ml-1 p-0.5 rounded-full ${getStatusColor(document.aiStatus)}`}>
            {getStatusIcon(document.aiStatus)}
          </div>
        )}
      </button>

      {/* Modal completo do documento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    document.type === 'historico' ? 'bg-blue-100 text-blue-600' :
                    document.type === 'ementa' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {document.type === 'historico' && <FileText className="w-6 h-6" />}
                    {document.type === 'ementa' && <GraduationCap className="w-6 h-6" />}
                    {document.type === 'outro' && <FileText className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#232323]">{document.name}</h3>
                    <p className="text-sm text-[#8E9794]">
                      {document.type === 'historico' ? 'Histórico Escolar' : 
                       document.type === 'ementa' ? 'Ementa de Disciplina' : 'Documento Complementar'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Informações Básicas do Documento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Informações do Documento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8E9794]">Tamanho:</span>
                      <span className="font-medium">{document.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E9794]">Enviado em:</span>
                      <span className="font-medium">{formatDate(document.uploadedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E9794]">Tipo:</span>
                      <span className="font-medium capitalize">{document.type}</span>
                    </div>
                  </div>
                </div>

                {/* Status da IA */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Status da Análise IA
                  </h4>
                  <div className="space-y-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(document.aiStatus)}`}>
                      {getStatusIcon(document.aiStatus)}
                      <span className="text-sm font-medium">
                        {document.aiStatus === 'analisado' ? 'Analisado' : 
                         document.aiStatus === 'em_analise' ? 'Em Análise' : 
                         document.aiStatus === 'pendente' ? 'Pendente' : 'Rejeitado'}
                      </span>
                    </div>
                    {document.aiAnalysisDate && (
                      <p className="text-xs text-[#8E9794]">
                        Analisado em: {formatDate(document.aiAnalysisDate)}
                      </p>
                    )}
                    {document.aiAgent && (
                      <p className="text-xs text-[#8E9794]">
                        Agente: {document.aiAgent}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recomendação da IA */}
              {document.aiRecommendation && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    Parecer da IA
                  </h4>
                  <p className="text-sm text-[#232323] leading-relaxed">
                    {document.aiRecommendation}
                  </p>
                </div>
              )}

              {/* Percentual de Aproveitamento */}
              {document.aproveitamentoPercent && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Percentual de Aproveitamento
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            document.aproveitamentoPercent >= 80 ? 'bg-green-500' :
                            document.aproveitamentoPercent >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${document.aproveitamentoPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-[#232323] min-w-[3rem]">
                        {document.aproveitamentoPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-[#8E9794]">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Informações do Estudante */}
              {document.studentInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Dados do Estudante
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {document.studentInfo.cpf && (
                      <div className="flex justify-between">
                        <span className="text-[#8E9794]">CPF:</span>
                        <span className="font-medium font-mono">{document.studentInfo.cpf}</span>
                      </div>
                    )}
                    {document.studentInfo.email && (
                      <div className="flex justify-between">
                        <span className="text-[#8E9794]">E-mail:</span>
                        <span className="font-medium">{document.studentInfo.email}</span>
                      </div>
                    )}
                    {document.studentInfo.phone && (
                      <div className="flex justify-between">
                        <span className="text-[#8E9794]">Telefone:</span>
                        <span className="font-medium">{document.studentInfo.phone}</span>
                      </div>
                    )}
                    {document.studentInfo.birthDate && (
                      <div className="flex justify-between">
                        <span className="text-[#8E9794]">Data de Nascimento:</span>
                        <span className="font-medium">{new Date(document.studentInfo.birthDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Informações Acadêmicas */}
              {document.academicInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Informações Acadêmicas
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {document.academicInfo.previousInstitution && (
                      <div className="flex justify-between">
                        <span className="text-[#8E9794]">Instituição Anterior:</span>
                        <span className="font-medium">{document.academicInfo.previousInstitution}</span>
                      </div>
                    )}
                    {document.academicInfo.previousCourse && (
                      <div className="flex justify-between">
                        <span className="text-[#8E9794]">Curso Anterior:</span>
                        <span className="font-medium">{document.academicInfo.previousCourse}</span>
                      </div>
                    )}
                    {document.academicInfo.completedCredits && (
                      <div className="flex justify-between">
                        <span className="text-[#8E9794]">Créditos Concluídos:</span>
                        <span className="font-medium">{document.academicInfo.completedCredits}</span>
                      </div>
                    )}
                    {document.academicInfo.totalCredits && (
                      <div className="flex justify-between">
                        <span className="text-[#8E9794]">Total de Créditos:</span>
                        <span className="font-medium">{document.academicInfo.totalCredits}</span>
                      </div>
                    )}
                    {document.academicInfo.gpa && (
                      <div className="flex justify-between">
                        <span className="text-[#8E9794]">CR (Coeficiente de Rendimento):</span>
                        <span className="font-medium">{document.academicInfo.gpa.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status de Integração TOTVS */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Status de Integração RM TOTVS
                </h4>
                <div className="space-y-3">
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getTotvsStatusColor(document.totvsIntegration?.status)}`}>
                    {getTotvsStatusIcon(document.totvsIntegration?.status)}
                    <span className="text-sm font-medium">
                      {document.totvsIntegration?.status === 'integrado' ? 'Integrado' : 
                       document.totvsIntegration?.status === 'pendente' ? 'Pendente' : 
                       document.totvsIntegration?.status === 'erro' ? 'Erro na Integração' : 'Não Integrado'}
                    </span>
                  </div>
                  
                  {document.totvsIntegration?.lastSync && (
                    <p className="text-xs text-[#8E9794]">
                      Última sincronização: {formatDate(document.totvsIntegration.lastSync)}
                    </p>
                  )}
                  
                  {document.totvsIntegration?.errorMessage && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Erro:</strong> {document.totvsIntegration.errorMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Disciplinas do Histórico */}
              {document.disciplines && document.disciplines.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Disciplinas do Histórico - {document.academicInfo?.previousInstitution}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Código</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Nome</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Carga Horária</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Créditos</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Semestre</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Nota</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {document.disciplines.map((discipline, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-[#232323]">{discipline.code}</td>
                            <td className="px-3 py-2 text-sm text-[#232323]">{discipline.name}</td>
                            <td className="px-3 py-2 text-sm text-[#8E9794]">{discipline.workload}h</td>
                            <td className="px-3 py-2 text-sm text-[#8E9794]">{discipline.credits}</td>
                            <td className="px-3 py-2 text-sm text-[#8E9794]">{discipline.semester}º</td>
                            <td className="px-3 py-2 text-sm text-[#8E9794]">{discipline.grade?.toFixed(1) || 'N/A'}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                discipline.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                                discipline.status === 'cursando' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {discipline.status === 'aprovado' ? 'Aprovado' :
                                 discipline.status === 'cursando' ? 'Cursando' : 'Reprovado'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Matriz Curricular Sugerida pela IA */}
              {document.suggestedMatrix && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#232323] mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    Matriz Curricular Sugerida pela IA - {document.suggestedMatrix.suggestedCourse}
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-[#8E9794]">Curso Sugerido:</span>
                        <p className="font-medium text-[#232323]">{document.suggestedMatrix.suggestedCourse}</p>
                      </div>
                      <div>
                        <span className="text-[#8E9794]">Instituição:</span>
                        <p className="font-medium text-[#232323]">{document.suggestedMatrix.suggestedInstitution}</p>
                      </div>
                      <div>
                        <span className="text-[#8E9794]">Total Aproveitamento:</span>
                        <p className="font-medium text-[#232323]">{document.suggestedMatrix.totalAproveitamento}%</p>
                      </div>
                    </div>
                    
                    {document.suggestedMatrix.observacoes && (
                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-[#232323]">
                          <strong>Observações da IA:</strong> {document.suggestedMatrix.observacoes}
                        </p>
                      </div>
                    )}

                    {/* Tabela de Aproveitamento de Disciplinas */}
                    <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
                      <div className="bg-blue-100 px-4 py-2 border-b border-blue-200">
                        <h5 className="font-medium text-[#232323] text-sm">Disciplinas Aproveitadas</h5>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-blue-200">
                          <thead className="bg-blue-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Origem</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Destino</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Aproveitamento</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Compatibilidade</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Observações</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-blue-200">
                            {document.suggestedMatrix.aproveitamentoDisciplinas.map((aproveitamento, index) => (
                              <tr key={index} className="hover:bg-blue-50">
                                <td className="px-3 py-2">
                                  <div className="text-xs">
                                    <p className="font-medium text-[#232323]">{aproveitamento.disciplinaOrigem.name}</p>
                                    <p className="text-[#8E9794]">{aproveitamento.disciplinaOrigem.code}</p>
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="text-xs">
                                    <p className="font-medium text-[#232323]">{aproveitamento.disciplinaDestino.name}</p>
                                    <p className="text-[#8E9794]">{aproveitamento.disciplinaDestino.code}</p>
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    aproveitamento.aproveitamento === 'total' ? 'bg-green-100 text-green-800' :
                                    aproveitamento.aproveitamento === 'parcial' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {aproveitamento.aproveitamento === 'total' ? 'Total' :
                                     aproveitamento.aproveitamento === 'parcial' ? 'Parcial' : 'Rejeitado'}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-sm text-[#8E9794]">{aproveitamento.percentualCompatibilidade}%</td>
                                <td className="px-3 py-2 text-xs text-[#8E9794] max-w-xs truncate" title={aproveitamento.observacoes}>
                                  {aproveitamento.observacoes}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Download do documento
                    console.log('Download:', document.url)
                  }}
                  className="flex items-center gap-2 bg-[#CE0058] text-white px-4 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>

                <button
                  onClick={() => {
                    // Visualizar documento
                    console.log('Visualizar:', document.url)
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </button>

                <button
                  onClick={() => {
                    // Reanalisar com IA
                    console.log('Reanalisar com IA:', document.id)
                  }}
                  className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reanalisar com IA
                </button>

                <button
                  onClick={() => {
                    // Sincronizar com TOTVS
                    console.log('Sincronizar com TOTVS:', document.id)
                  }}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Database className="w-4 h-4" />
                  Sincronizar TOTVS
                </button>

                <button
                  onClick={() => {
                    // Aproveitamento de disciplinas no TOTVS
                    console.log('Aproveitamento de disciplinas no TOTVS:', document.id)
                  }}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <GraduationCap className="w-4 h-4" />
                  Aproveitamento TOTVS
                </button>

                <button
                  onClick={() => {
                    // Aprovar documento
                    console.log('Aprovar documento:', document.id)
                  }}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aprovar
                </button>

                <button
                  onClick={() => {
                    // Rejeitar documento
                    console.log('Rejeitar documento:', document.id)
                  }}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeitar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Componente principal
export default function HomePage() {
  const { user, logout } = useAuth()
  const { agents, loading, error } = useAgents()
  const router = useRouter()
  
  // Estados para filtros
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroColigada, setFiltroColigada] = useState<string>('todos')
  const [filtroFilial, setFiltroFilial] = useState<string>('todos')
  const [filtroNivel, setFiltroNivel] = useState<string>('todos')
  const [filtroCurso, setFiltroCurso] = useState<string>('todos')
  const [filtroProcesso, setFiltroProcesso] = useState<string>('todos')
  const [buscaTexto, setBuscaTexto] = useState<string>('')

  // Função para filtrar análises
  const analisesFiltradas = useMemo(() => {
    return MOCK_ANALYSES.filter(analise => {
      // Filtro por status
      if (filtroStatus !== 'todos' && analise.status !== filtroStatus) return false
      
      // Filtro por tipo
      if (filtroTipo !== 'todos' && analise.type !== filtroTipo) return false
      
      // Filtro por coligada
      if (filtroColigada !== 'todos' && analise.coligada !== filtroColigada) return false
      
      // Filtro por filial
      if (filtroFilial !== 'todos' && analise.filial !== filtroFilial) return false
      
      // Filtro por nível
      if (filtroNivel !== 'todos' && analise.nivelEnsino !== filtroNivel) return false
      
      // Filtro por curso
      if (filtroCurso !== 'todos' && analise.curso !== filtroCurso) return false
      
      // Filtro por processo seletivo
      if (filtroProcesso !== 'todos' && analise.processoSeletivo !== filtroProcesso) return false
      
      // Busca por texto (nome do estudante, IDPS, etc.)
      if (buscaTexto && !analise.studentName.toLowerCase().includes(buscaTexto.toLowerCase()) && 
          !analise.idps.includes(buscaTexto) && 
          !analise.curso.toLowerCase().includes(buscaTexto.toLowerCase())) {
        return false
      }
      
      return true
    })
  }, [filtroStatus, filtroTipo, filtroColigada, filtroFilial, filtroNivel, filtroCurso, filtroProcesso, buscaTexto])

  // Valores únicos para os filtros
  const valoresUnicos = useMemo(() => {
    const coligadas = [...new Set(MOCK_ANALYSES.map(a => a.coligada))]
    const filiais = [...new Set(MOCK_ANALYSES.map(a => a.filial))]
    const niveis = [...new Set(MOCK_ANALYSES.map(a => a.nivelEnsino))]
    const cursos = [...new Set(MOCK_ANALYSES.map(a => a.curso))]
    const processos = [...new Set(MOCK_ANALYSES.map(a => a.processoSeletivo))]
    
    return { coligadas, filiais, niveis, cursos, processos }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/AfyaCompleto.png"
                alt="Logomarca AFYA"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>

            {/* Menu de navegação */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-[#232323] hover:text-[#CE0058] transition-colors font-medium">Dashboard</a>
              <a href="#" className="text-[#8E9794] hover:text-[#CE0058] transition-colors">Análise de Documentos</a>
              <a href="#" className="text-[#8E9794] hover:text-[#CE0058] transition-colors">Relatórios</a>
              {user?.role === 'admin' && (
                <a 
                  href="/configuracoes" 
                  className="text-[#8E9794] hover:text-[#CE0058] transition-colors"
                >
                  Configurações
                </a>
              )}
            </nav>

            {/* Lado direito */}
            <div className="flex items-center gap-4">
              {/* Notificações */}
              <button className="relative p-2 text-[#8E9794] hover:text-[#CE0058] transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Avatar do usuário */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#CE0058] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-sm font-medium text-[#232323]">{user?.name}</span>
                    <span className={`block text-xs px-2 py-1 rounded-full ${
                      user?.role === 'admin' 
                        ? 'bg-[#CE0058] text-white' 
                        : 'bg-gray-100 text-[#8E9794]'
                    }`}>
                      {user?.role === 'admin' ? 'Administrador' : 'Coordenador'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout()
                    router.push('/login')
                  }}
                  className="p-2 text-[#8E9794] hover:text-[#CE0058] transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informações de Contexto */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-[#8E9794]">
              <span><strong className="text-[#232323]">Contexto:</strong> 1. PVT SOFTWARE</span>
              <span><strong className="text-[#232323]">Filial:</strong> 1. Vila Velha ES</span>
              <span><strong className="text-[#232323]">Nível de Ensino:</strong> Graduação</span>
            </div>
            <div className="text-xs text-[#8E9794]">
              Sessão ativa como <span className="font-medium text-[#CE0058]">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#232323] mb-4">
            Sistema de Análise de Documentação Acadêmica
          </h1>
          <p className="text-lg text-[#8E9794] max-w-3xl mx-auto mb-8">
            Plataforma inteligente para análise de documentos de transferência externa e portador de diploma. 
            Utilize IA para agilizar o processo de avaliação acadêmica.
          </p>
          <button className="bg-[#CE0058] text-white px-8 py-3 rounded-lg hover:bg-[#B91C5C] transition-colors font-medium text-lg flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            Iniciar Nova Análise
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {MOCK_STATISTICS.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>


        {/* Seção dos Agentes de IA */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#232323] mb-4">
              Agentes de Inteligência Artificial
            </h2>
            <p className="text-lg text-[#8E9794] max-w-3xl mx-auto">
              Nossos agentes especializados utilizam IA avançada para análise acadêmica, 
              aproveitamento de disciplinas e coordenação curricular. Cada agente possui 
              acesso ao dataset completo de análises e ferramentas especializadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {loading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-[#232323] mb-2">Erro ao carregar agentes</h3>
                <p className="text-[#8E9794] mb-4">Não foi possível carregar os agentes de IA. Tente novamente mais tarde.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#CE0058] text-white px-6 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : agents.length > 0 ? (
              // Agents grid
              agents.map((agent) => (
                <div key={agent.id} className="group h-full">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 cursor-pointer h-full flex flex-col relative overflow-hidden">
                    {/* Subtle top accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
                    
                    {/* Header do agente */}
                    <div className="mb-5">
                      <div className="flex items-center justify-center mb-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}
                             style={{ backgroundColor: agent.color || '#6B7280' }}>
                          {(() => {
                            // Mapeamento de ícones emoji para componentes React
                            const iconMap: Record<string, React.ReactNode> = {
                              '👨‍🏫': <User className="w-8 h-8 text-white" />,
                              '🔍': <Eye className="w-8 h-8 text-white" />,
                              '🎓': <GraduationCap className="w-8 h-8 text-white" />,
                              'graduation-cap': <GraduationCap className="w-8 h-8 text-white" />,
                            };
                            
                            if (agent.icon && iconMap[agent.icon]) {
                              return iconMap[agent.icon];
                            } else if (agent.icon && !agent.icon.startsWith('<')) {
                              return <span className="text-3xl text-white">{agent.icon}</span>;
                            } else {
                              return <Brain className="w-8 h-8 text-white" />;
                            }
                          })()}
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-[#232323] mb-2 leading-tight">{agent.name}</h3>
                        <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-green-600 font-medium">Operacional</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <p className="text-[#8E9794] mb-5 leading-relaxed text-sm text-center">{agent.description}</p>
                    </div>
                    
                    {/* Especificações técnicas */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="text-sm font-semibold text-[#232323] mb-3 text-center">Especificações</h4>
                      
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-xs text-[#8E9794] font-medium mb-1">Modelo</div>
                          <div className="font-mono text-[#232323] bg-white px-3 py-2 rounded-lg text-xs border shadow-sm">
                            {agent.model}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div>
                            <div className="text-xs text-[#8E9794] font-medium mb-1">Ferramentas</div>
                            <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              Dataset + Web
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-[#8E9794] font-medium mb-1">Status</div>
                            <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium flex items-center justify-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              Online
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botão de ação */}
                    <button
                      onClick={() => router.push(`/playground?agent=${agent.id}`)}
                      className="w-full bg-gradient-to-r from-[#CE0058] to-[#B91C5C] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#B91C5C] hover:to-[#CE0058] transition-all duration-300 text-sm shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                    >
                      <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Iniciar Conversa
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-[#232323] mb-2">Nenhum agente configurado</h3>
                <p className="text-[#8E9794] mb-4">Entre em contato com o administrador para configurar os agentes de IA.</p>
                <Link
                  href="/configuracoes"
                  className="inline-flex items-center gap-2 bg-[#CE0058] text-white px-6 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Configurar Agentes
                </Link>
              </div>
            )}
          </div>
          
        </div>

        {/* Tabela de Análises Recentes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#232323]">Análises Recentes</h3>
                <p className="text-sm text-[#8E9794]">Últimas análises de documentos acadêmicos</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Busca por texto */}
              <div className="lg:col-span-2">
                <label className="text-sm font-medium text-[#232323] mb-2 block">
                  Buscar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nome, IDPS, curso..."
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CE0058] focus:border-transparent transition-all shadow-sm"
                  />
                  <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Filtro por status */}
              <div>
                <label className="text-sm font-medium text-[#232323] mb-2 block">
                  Status
                </label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CE0058] focus:border-transparent transition-all shadow-sm bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="aprovado">✅ Aprovado</option>
                  <option value="rejeitado">❌ Rejeitado</option>
                  <option value="pendente">⏳ Pendente</option>
                </select>
              </div>

              {/* Filtro por processo seletivo */}
              <div>
                <label className="text-sm font-medium text-[#232323] mb-2 block">
                  Processo Seletivo
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CE0058] focus:border-transparent transition-all shadow-sm bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="transferencia">Transferência Externa</option>
                  <option value="portador">Portador de Diploma</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
              {/* Filtro por coligada */}
              <div>
                <label className="block text-sm font-medium text-[#8E9794] mb-2">Coligada</label>
                <select
                  value={filtroColigada}
                  onChange={(e) => setFiltroColigada(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                >
                  <option value="todos">Todas</option>
                  {valoresUnicos.coligadas.map(coligada => (
                    <option key={coligada} value={coligada}>{coligada}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por filial */}
              <div>
                <label className="block text-sm font-medium text-[#8E9794] mb-2">Filial</label>
                <select
                  value={filtroFilial}
                  onChange={(e) => setFiltroFilial(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                >
                  <option value="todos">Todas</option>
                  {valoresUnicos.filiais.map(filial => (
                    <option key={filial} value={filial}>{filial}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por nível */}
              <div>
                <label className="block text-sm font-medium text-[#8E9794] mb-2">Nível</label>
                <select
                  value={filtroNivel}
                  onChange={(e) => setFiltroNivel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  {valoresUnicos.niveis.map(nivel => (
                    <option key={nivel} value={nivel}>{nivel}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por curso */}
              <div>
                <label className="block text-sm font-medium text-[#8E9794] mb-2">Curso</label>
                <select
                  value={filtroCurso}
                  onChange={(e) => setFiltroCurso(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  {valoresUnicos.cursos.map(curso => (
                    <option key={curso} value={curso}>{curso}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por processo seletivo */}
              <div>
                <label className="block text-sm font-medium text-[#8E9794] mb-2">Processo</label>
                <select
                  value={filtroProcesso}
                  onChange={(e) => setFiltroProcesso(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  {valoresUnicos.processos.map(processo => (
                    <option key={processo} value={processo}>{processo}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botão para limpar filtros */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFiltroStatus('todos')
                  setFiltroTipo('todos')
                  setFiltroColigada('todos')
                  setFiltroFilial('todos')
                  setFiltroNivel('todos')
                  setFiltroCurso('todos')
                  setFiltroProcesso('todos')
                  setBuscaTexto('')
                }}
                className="px-4 py-2 text-sm text-[#8E9794] hover:text-[#CE0058] transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Análises recentes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-blue-100">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">Coligada</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">Filial</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">Nível</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">👤 Estudante</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">Curso</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">IDPS</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">Processo Seletivo</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">Tipo</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">✅ Status</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">📂 Documentos</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">Data</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">Coordenador</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-[#232323]">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {analisesFiltradas.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-blue-50 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-400">
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-[#232323] bg-gray-100 px-2 py-1 rounded">{analysis.coligada}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#8E9794]">{analysis.filial}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#8E9794] bg-blue-50 px-2 py-1 rounded">{analysis.nivelEnsino}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {analysis.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="text-sm font-semibold text-[#232323]">{analysis.studentName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#8E9794]">{analysis.curso}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded border">{analysis.idps}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#8E9794]">{analysis.processoSeletivo}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        analysis.type === 'transferencia' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {analysis.type === 'transferencia' ? 'Transferência' : 'Portador'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={analysis.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#232323]">
                            {analysis.documents.length} documento{analysis.documents.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {analysis.documents.filter(d => d.aiStatus === 'analisado').length} analisado{analysis.documents.filter(d => d.aiStatus === 'analisado').length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            // TODO: Abrir modal com lista de documentos
                            console.log('Ver documentos:', analysis.documents)
                          }}
                          className="text-xs text-[#CE0058] hover:text-[#B91C5C] font-medium flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Ver documentos
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#8E9794]" />
                        <span className="text-sm text-[#8E9794]">
                          {new Date(analysis.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#8E9794]">{analysis.coordinator}</span>
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => router.push(`/analise/${analysis.id}`)}
                        className="bg-[#CE0058] hover:bg-[#B91C5C] text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Ver Análise
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}

