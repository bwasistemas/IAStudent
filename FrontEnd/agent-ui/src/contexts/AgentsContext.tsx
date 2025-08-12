'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Agent {
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

interface AgentsContextType {
  agents: Agent[]
  setAgents: (agents: Agent[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (agent: Agent) => void
  deleteAgent: (agentId: string) => void
  getActiveAgents: () => Agent[]
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined)

// Agentes padrão iniciais
const DEFAULT_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Coordenador de Aproveitamento',
    description: 'Especialista em validação de disciplinas e cálculo de equivalências',
    icon: 'brain',
    color: 'from-[#CE0058] to-[#B91C5C]',
    model: 'gpt-4.1-mini',
    instructions: `Você é um Coordenador de Curso de Graduação especializado em validar disciplinas para aproveitamento de estudos.

Sua função é analisar documentos acadêmicos de alunos e determinar equivalências entre disciplinas.

Ao receber documentos, você deve:
1. Analisar o conteúdo programático das disciplinas apresentadas
2. Comparar com as disciplinas da matriz curricular do curso
3. Calcular o percentual de equivalência/aproveitamento
4. Indicar quais disciplinas podem ser aproveitadas e o percentual de compatibilidade
5. Justificar suas decisões com base no conteúdo programático e carga horária

IMPORTANTE: Sempre consulte a Base de Conhecimento disponível para obter informações atualizadas sobre matrizes curriculares, ementas e disciplinas antes de fazer suas análises.`,
    knowledgeBase: {
      enabled: true,
      type: 'rag',
      endpoint: 'http://localhost:8000',
      collection: 'documents'
    },
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Especialista em Transferência',
    description: 'Transferência Externa e Portador de Diploma',
    icon: 'graduation-cap',
    color: 'from-[#232323] to-[#475569]',
    model: 'gpt-4.1-mini',
    instructions: `Você é um especialista em processos de Transferência Externa e Portador de Diploma.

Sua especialidade é analisar históricos acadêmicos de outras instituições de ensino superior.

Para cada análise você deve:
1. Verificar a autenticidade e validade dos documentos apresentados
2. Analisar o histórico escolar completo do estudante
3. Identificar disciplinas cursadas com aprovação (nota ≥ 6.0 ou conceito equivalente)
4. Comparar ementa e carga horária com as disciplinas da matriz curricular atual
5. Calcular percentual de equivalência por disciplina (0-100%)
6. Sugerir aproveitamento total, parcial ou não aproveitamento

IMPORTANTE: Sempre consulte a Base de Conhecimento disponível para obter informações atualizadas sobre matrizes curriculares, ementas e disciplinas antes de fazer suas análises.`,
    knowledgeBase: {
      enabled: true,
      type: 'rag',
      endpoint: 'http://localhost:8000',
      collection: 'documents'
    },
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  }
]

export function AgentsProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(() => {
    // Carregar agentes do localStorage se disponível
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('afya-agents')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return DEFAULT_AGENTS
        }
      }
    }
    return DEFAULT_AGENTS
  })

  // Salvar agentes no localStorage sempre que mudarem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('afya-agents', JSON.stringify(agents))
    }
  }, [agents])

  const addAgent = (agent: Agent) => {
    setAgents(prev => [...prev, agent])
  }

  const updateAgent = (updatedAgent: Agent) => {
    setAgents(prev => prev.map(agent => 
      agent.id === updatedAgent.id ? updatedAgent : agent
    ))
  }

  const deleteAgent = (agentId: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== agentId))
  }

  const getActiveAgents = () => {
    return agents.filter(agent => agent.isActive)
  }

  const value: AgentsContextType = {
    agents,
    setAgents,
    addAgent,
    updateAgent,
    deleteAgent,
    getActiveAgents
  }

  return (
    <AgentsContext.Provider value={value}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgents() {
  const context = useContext(AgentsContext)
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentsProvider')
  }
  return context
}
