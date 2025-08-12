'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft,
  CheckCircle, 
  AlertCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  School,
  BookOpen,
  TrendingUp,
  Filter,
  Download,
  Eye
} from 'lucide-react'
import Image from 'next/image'

interface DisciplinaOrigem {
  codigo: string
  nome: string
  cargaHoraria: number
  creditos: number
  semestre: number
  nota: number
  status: 'aprovado' | 'reprovado'
}

interface DisciplinaAproveitamento {
  origem: string
  destino: string
  aproveitamento: 'total' | 'parcial' | 'nao_aproveitamento'
  compatibilidade: number
  observacoes: string
}

interface AnaliseCompleta {
  id: string
  estudante: {
    nome: string
    idps: string
    cpf: string
    email: string
  }
  academico: {
    instituicaoAnterior: string
    cursoAnterior: string
    creditosConcluidos: number
    totalCreditos: number
    cr: number
  }
  analise: {
    tipo: string
    status: 'aprovado' | 'rejeitado' | 'pendente'
    dataAnalise: string
    agenteIA: string
    percentualAproveitamento: number
    observacoes: string
  }
  contexto: {
    coligada: string
    filial: string
    nivelEnsino: string
    curso: string
    processoSeletivo: string
  }
  disciplinas: DisciplinaOrigem[]
  matrizSugerida: {
    cursoSugerido: string
    instituicao: string
    totalAproveitamento: number
    observacoes: string
    aproveitamentoDisciplinas: DisciplinaAproveitamento[]
  }
}

export function AnaliseAproveitamentoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [analise, setAnalise] = useState<AnaliseCompleta | null>(null)
  const [filtroAproveitamento, setFiltroAproveitamento] = useState<string>('todos')
  const [loading, setLoading] = useState(true)

  // Dados mock baseados no dataset do backend
  const mockAnalise: AnaliseCompleta = {
    id: "1",
    estudante: {
      nome: "João Silva",
      idps: "156",
      cpf: "123.456.789-00",
      email: "joao.silva@email.com"
    },
    academico: {
      instituicaoAnterior: "Universidade Federal do Espírito Santo",
      cursoAnterior: "Engenharia Civil",
      creditosConcluidos: 85,
      totalCreditos: 100,
      cr: 8.5
    },
    analise: {
      tipo: "transferencia",
      status: "aprovado",
      dataAnalise: "2024-01-15T10:30:00Z",
      agenteIA: "Agente de Análise Curricular",
      percentualAproveitamento: 85,
      observacoes: "Excelente aproveitamento em disciplinas de exatas. Recomenda-se validação manual para disciplinas específicas."
    },
    contexto: {
      coligada: "1. PVT SOFTWARE",
      filial: "1. Vila Velha ES",
      nivelEnsino: "Graduação",
      curso: "Engenharia de Software",
      processoSeletivo: "2023/2024"
    },
    disciplinas: [
      {
        codigo: "MAT001",
        nome: "Cálculo I",
        cargaHoraria: 60,
        creditos: 4,
        semestre: 1,
        nota: 8.5,
        status: "aprovado"
      },
      {
        codigo: "MAT002",
        nome: "Cálculo II",
        cargaHoraria: 60,
        creditos: 4,
        semestre: 2,
        nota: 8.0,
        status: "aprovado"
      },
      {
        codigo: "FIS001",
        nome: "Física I",
        cargaHoraria: 60,
        creditos: 4,
        semestre: 1,
        nota: 7.5,
        status: "aprovado"
      }
    ],
    matrizSugerida: {
      cursoSugerido: "Engenharia de Software",
      instituicao: "AFYA - Vila Velha",
      totalAproveitamento: 85,
      observacoes: "Excelente aproveitamento em disciplinas de exatas. Recomenda-se validação de disciplinas específicas de programação.",
      aproveitamentoDisciplinas: [
        {
          origem: "Cálculo I",
          destino: "Cálculo I",
          aproveitamento: "total",
          compatibilidade: 95,
          observacoes: "Disciplina totalmente compatível"
        },
        {
          origem: "Cálculo II", 
          destino: "Cálculo II",
          aproveitamento: "total",
          compatibilidade: 90,
          observacoes: "Disciplina totalmente compatível"
        },
        {
          origem: "Física I",
          destino: "Física I",
          aproveitamento: "total",
          compatibilidade: 88,
          observacoes: "Disciplina totalmente compatível"
        }
      ]
    }
  }

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setAnalise(mockAnalise)
      setLoading(false)
    }, 1000)
  }, [])

  const getAproveitamentoColor = (aproveitamento: string) => {
    switch (aproveitamento) {
      case 'total': return 'text-green-600 bg-green-50 border-green-200'
      case 'parcial': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'nao_aproveitamento': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getAproveitamentoIcon = (aproveitamento: string) => {
    switch (aproveitamento) {
      case 'total': return <CheckCircle className="w-4 h-4" />
      case 'parcial': return <AlertCircle className="w-4 h-4" />
      case 'nao_aproveitamento': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getAproveitamentoTexto = (aproveitamento: string) => {
    switch (aproveitamento) {
      case 'total': return 'Aproveitamento Total'
      case 'parcial': return 'Aproveitamento Parcial'
      case 'nao_aproveitamento': return 'Não Aproveitamento'
      default: return 'Indefinido'
    }
  }

  const disciplinasFiltradas = analise?.matrizSugerida.aproveitamentoDisciplinas.filter(disc => 
    filtroAproveitamento === 'todos' || disc.aproveitamento === filtroAproveitamento
  ) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CE0058] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando análise...</p>
        </div>
      </div>
    )
  }

  if (!analise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Análise não encontrada</p>
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
                onClick={() => router.back()}
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
              <span className="text-lg font-bold text-[#232323]">Análise de Aproveitamento</span>
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

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informações do Estudante */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CE0058] to-[#B91C5C] rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#232323]">{analise.estudante.nome}</h1>
              <p className="text-[#8E9794]">IDPS: {analise.estudante.idps} • {analise.estudante.email}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#CE0058] text-white rounded-lg hover:bg-[#B91C5C] transition-colors">
                <Download className="w-4 h-4" />
                Relatório
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4" />
                Visualizar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-[#232323] mb-2 flex items-center gap-2">
                <School className="w-4 h-4" />
                Informações Acadêmicas
              </h3>
              <div className="space-y-1 text-sm">
                <p><strong>Instituição:</strong> {analise.academico.instituicaoAnterior}</p>
                <p><strong>Curso:</strong> {analise.academico.cursoAnterior}</p>
                <p><strong>CR:</strong> {analise.academico.cr}</p>
                <p><strong>Créditos:</strong> {analise.academico.creditosConcluidos}/{analise.academico.totalCreditos}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#232323] mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Status da Análise
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    analise.analise.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                    analise.analise.status === 'rejeitado' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {analise.analise.status.toUpperCase()}
                  </span>
                </div>
                <p><strong>Aproveitamento:</strong> {analise.analise.percentualAproveitamento}%</p>
                <p><strong>Agente IA:</strong> {analise.analise.agenteIA}</p>
                <p><strong>Data:</strong> {new Date(analise.analise.dataAnalise).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#232323] mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Contexto Institucional
              </h3>
              <div className="space-y-1 text-sm">
                <p><strong>Curso Destino:</strong> {analise.contexto.curso}</p>
                <p><strong>Filial:</strong> {analise.contexto.filial}</p>
                <p><strong>Processo:</strong> {analise.contexto.processoSeletivo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo da Análise */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-[#232323] mb-4">Resumo da Matriz Sugerida</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[#232323] mb-2"><strong>Curso Sugerido:</strong> {analise.matrizSugerida.cursoSugerido}</p>
            <p className="text-[#232323] mb-2"><strong>Aproveitamento Total:</strong> {analise.matrizSugerida.totalAproveitamento}%</p>
            <p className="text-[#8E9794] text-sm">{analise.matrizSugerida.observacoes}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#232323]">Análise de Disciplinas</h2>
            <div className="flex items-center gap-4">
              <Filter className="w-4 h-4 text-[#8E9794]" />
              <select 
                value={filtroAproveitamento}
                onChange={(e) => setFiltroAproveitamento(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="todos">Todos os aproveitamentos</option>
                <option value="total">Aproveitamento Total</option>
                <option value="parcial">Aproveitamento Parcial</option>
                <option value="nao_aproveitamento">Não Aproveitamento</option>
              </select>
            </div>
          </div>

          {/* Lista de Disciplinas */}
          <div className="space-y-4">
            {disciplinasFiltradas.map((disc, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getAproveitamentoColor(disc.aproveitamento)}`}>
                    {getAproveitamentoIcon(disc.aproveitamento)}
                    {getAproveitamentoTexto(disc.aproveitamento)}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#232323]">{disc.compatibilidade}%</div>
                    <div className="text-xs text-[#8E9794]">Compatibilidade</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Disciplina de Origem */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-[#232323] mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Disciplina de Origem
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-[#232323]">{disc.origem}</p>
                      <p className="text-[#8E9794]">Instituição: {analise.academico.instituicaoAnterior}</p>
                      {/* Buscar detalhes da disciplina original */}
                      {analise.disciplinas.find(d => d.nome === disc.origem) && (
                        <>
                          <p className="text-[#8E9794]">
                            Carga Horária: {analise.disciplinas.find(d => d.nome === disc.origem)?.cargaHoraria}h
                          </p>
                          <p className="text-[#8E9794]">
                            Créditos: {analise.disciplinas.find(d => d.nome === disc.origem)?.creditos}
                          </p>
                          <p className="text-[#8E9794]">
                            Nota: {analise.disciplinas.find(d => d.nome === disc.origem)?.nota}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Disciplina Sugerida */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-[#232323] mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Disciplina Sugerida (AFYA)
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-[#232323]">{disc.destino}</p>
                      <p className="text-[#8E9794]">Curso: {analise.matrizSugerida.cursoSugerido}</p>
                      <p className="text-[#8E9794]">Instituição: {analise.matrizSugerida.instituicao}</p>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-[#232323]">
                    <strong>Observações:</strong> {disc.observacoes}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {disciplinasFiltradas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Nenhuma disciplina encontrada para o filtro selecionado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}