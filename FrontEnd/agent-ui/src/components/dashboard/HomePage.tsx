'use client'

import React from 'react'
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
  Search,
  Filter,
  MessageSquare,
  Brain,
  Zap
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

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  buttonText: string
  href: string
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
    documents: [
      { id: 'doc1', name: 'Historico 2023.pdf', type: 'historico', url: '/documents/historico1.pdf', uploadedAt: '2024-01-14', size: '1.2MB' },
      { id: 'doc2', name: 'Ementa Matematica.pdf', type: 'ementa', url: '/documents/ementa1.pdf', uploadedAt: '2024-01-13', size: '500KB' },
      { id: 'doc3', name: 'Carta de Recomendacao.pdf', type: 'outro', url: '/documents/carta1.pdf', uploadedAt: '2024-01-12', size: '800KB' }
    ]
  },
  {
    id: '2',
    studentName: 'João Pedro Costa',
    type: 'portador',
    status: 'aprovado',
    date: '2024-01-14',
    coordinator: 'Dra. Ana Paula',
    documents: [
      { id: 'doc4', name: 'Historico 2022.pdf', type: 'historico', url: '/documents/historico2.pdf', uploadedAt: '2024-01-13', size: '1.5MB' },
      { id: 'doc5', name: 'Ementa Fisica.pdf', type: 'ementa', url: '/documents/ementa2.pdf', uploadedAt: '2024-01-12', size: '600KB' },
      { id: 'doc6', name: 'Carta de Recomendacao.pdf', type: 'outro', url: '/documents/carta2.pdf', uploadedAt: '2024-01-11', size: '900KB' }
    ]
  },
  {
    id: '3',
    studentName: 'Fernanda Oliveira',
    type: 'transferencia',
    status: 'rejeitado',
    date: '2024-01-13',
    coordinator: 'Dr. Roberto Lima',
    documents: [
      { id: 'doc7', name: 'Historico 2021.pdf', type: 'historico', url: '/documents/historico3.pdf', uploadedAt: '2024-01-12', size: '1.8MB' },
      { id: 'doc8', name: 'Ementa Quimica.pdf', type: 'ementa', url: '/documents/ementa3.pdf', uploadedAt: '2024-01-11', size: '700KB' },
      { id: 'doc9', name: 'Carta de Recomendacao.pdf', type: 'outro', url: '/documents/carta3.pdf', uploadedAt: '2024-01-10', size: '1MB' }
    ]
  },
  {
    id: '4',
    studentName: 'Lucas Mendes',
    type: 'portador',
    status: 'pendente',
    date: '2024-01-12',
    coordinator: 'Dra. Claudia Santos',
    documents: [
      { id: 'doc10', name: 'Historico 2020.pdf', type: 'historico', url: '/documents/historico4.pdf', uploadedAt: '2024-01-11', size: '2MB' },
      { id: 'doc11', name: 'Ementa Biologia.pdf', type: 'ementa', url: '/documents/ementa4.pdf', uploadedAt: '2024-01-10', size: '800KB' },
      { id: 'doc12', name: 'Carta de Recomendacao.pdf', type: 'outro', url: '/documents/carta4.pdf', uploadedAt: '2024-01-09', size: '1.1MB' }
    ]
  },
  {
    id: '5',
    studentName: 'Amanda Ferreira',
    type: 'transferencia',
    status: 'aprovado',
    date: '2024-01-11',
    coordinator: 'Dr. Eduardo Costa',
    documents: [
      { id: 'doc13', name: 'Historico 2019.pdf', type: 'historico', url: '/documents/historico5.pdf', uploadedAt: '2024-01-10', size: '2.2MB' },
      { id: 'doc14', name: 'Ementa Filosofia.pdf', type: 'ementa', url: '/documents/ementa5.pdf', uploadedAt: '2024-01-09', size: '900KB' },
      { id: 'doc15', name: 'Carta de Recomendacao.pdf', type: 'outro', url: '/documents/carta5.pdf', uploadedAt: '2024-01-08', size: '1.2MB' }
    ]
  }
]

const MOCK_STATISTICS: Statistic[] = [
  {
    label: 'Análises Pendentes',
    value: 12,
    change: '+2 hoje',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-yellow-600'
  },
  {
    label: 'Concluídas Hoje',
    value: 8,
    change: '+15% vs ontem',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-green-600'
  },
  {
    label: 'Taxa de Aprovação',
    value: '78%',
    change: '+5% vs mês passado',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-blue-600'
  },
  {
    label: 'Total de Estudantes',
    value: 156,
    change: '+12 este mês',
    icon: <Users className="w-5 h-5" />,
    color: 'text-purple-600'
  }
]

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'Transferência Externa',
    description: 'Analise documentos de estudantes transferidos de outras instituições',
    icon: <FileText className="w-8 h-8 text-[#CE0058]" />,
    buttonText: 'Iniciar Análise',
    href: '/analise/transferencia'
  },
  {
    title: 'Portador de Diploma',
    description: 'Avalie candidatos portadores de diploma para aproveitamento',
    icon: <GraduationCap className="w-8 h-8 text-[#CE0058]" />,
    buttonText: 'Iniciar Análise',
    href: '/analise/portador'
  },
  {
    title: 'Relatórios e Analytics',
    description: 'Visualize estatísticas e relatórios detalhados',
    icon: <BarChart3 className="w-8 h-8 text-[#CE0058]" />,
    buttonText: 'Ver Relatórios',
    href: '/relatorios'
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
      <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
        {stat.icon}
      </div>
      <span className="text-sm text-gray-500">{stat.change}</span>
    </div>
    <h3 className="text-2xl font-bold text-[#232323] mb-1">{stat.value}</h3>
    <p className="text-sm text-[#8E9794]">{stat.label}</p>
  </div>
)

// Componente de ação rápida
const QuickActionCard = ({ action }: { action: QuickAction }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        {action.icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[#232323] mb-2">{action.title}</h3>
        <p className="text-sm text-[#8E9794] mb-4">{action.description}</p>
        <button className="bg-[#CE0058] text-white px-4 py-2 rounded-lg hover:bg-[#B91C5C] transition-colors font-medium">
          {action.buttonText}
        </button>
      </div>
    </div>
  </div>
)

// Componente principal
export function HomePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { agents } = useAgents()


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/Afya.png"
                alt="Logomarca Afya"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-[#232323]">AFYA</span>
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

        {/* Funcionalidades principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {QUICK_ACTIONS.map((action, index) => (
            <QuickActionCard key={index} action={action} />
          ))}
        </div>

        {/* Agentes de IA */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#232323] mb-4">
              Agentes de IA Especializados
            </h2>
            <p className="text-lg text-[#8E9794] max-w-3xl mx-auto">
              Interaja diretamente com nossos agentes inteligentes para análise detalhada de documentos acadêmicos
            </p>
          </div>
          
          {agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {agents.map((agent) => (
                <div key={agent.id} className={`bg-gradient-to-br ${agent.color} rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      {agent.icon === 'brain' && <Brain className="w-8 h-8 text-white" />}
                      {agent.icon === 'graduation-cap' && <GraduationCap className="w-8 h-8 text-white" />}
                      {agent.icon === 'users' && <Users className="w-8 h-8 text-white" />}
                      {agent.icon === 'shield' && <Zap className="w-8 h-8 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{agent.name}</h3>
                      <p className="text-white/80 text-sm">{agent.description}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/90 mb-6 leading-relaxed">
                    {agent.instructions[0]}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Link 
                      href="/playground"
                      className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Conversar com o Agente
                    </Link>
                    <div className="flex items-center gap-2 text-white/80">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">{agent.model}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-[#8E9794] mb-2">Nenhum agente configurado</h3>
              <p className="text-sm text-[#8E9794]">Entre em contato com o administrador para configurar os agentes de IA.</p>
            </div>
          )}

          {/* Botão para acessar o playground completo */}
          <div className="text-center mt-8">
            <Link 
              href="/playground"
              className="inline-flex items-center gap-3 bg-[#8E9794] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#64748B] transition-colors text-lg"
            >
              <MessageSquare className="w-6 h-6" />
              Acessar Playground Completo dos Agentes
            </Link>
            <p className="text-sm text-[#8E9794] mt-3">
              Interface avançada para interação completa com todos os agentes
            </p>
          </div>
        </div>

        {/* Análises recentes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#232323]">Análises Recentes</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar análises..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE0058] focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Estudante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Documentos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Coordenador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8E9794] uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {MOCK_ANALYSES.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#232323]">{analysis.studentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#8E9794]">
                        {analysis.type === 'transferencia' ? 'Transferência Externa' : 'Portador de Diploma'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={analysis.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {analysis.documents.slice(0, 2).map((doc) => (
                          <span
                            key={doc.id}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              doc.type === 'historico' 
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : doc.type === 'ementa'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}
                          >
                            {doc.type === 'historico' && <FileText className="w-3 h-3" />}
                            {doc.type === 'ementa' && <GraduationCap className="w-3 h-3" />}
                            {doc.name.split('.')[0].substring(0, 15)}...
                          </span>
                        ))}
                        {analysis.documents.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#CE0058] text-white">
                            +{analysis.documents.length - 2}
                          </span>
                        )}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => router.push(`/analise/${analysis.id}`)}
                          className="text-[#CE0058] hover:text-[#B91C5C] text-sm font-medium transition-colors"
                        >
                          Ver Detalhes
                        </button>
                        <button 
                          onClick={() => router.push(`/playground?analysis=${analysis.id}`)}
                          className="text-[#8E9794] hover:text-[#CE0058] text-sm font-medium transition-colors"
                        >
                          IA
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar de atalhos */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 hidden xl:block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 w-64">
            <h3 className="font-semibold text-[#232323] mb-4">Atalhos Rápidos</h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-[#8E9794]">3 documentos em revisão</span>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-[#8E9794]">1 alerta importante</span>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-[#8E9794]">5 análises concluídas</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
