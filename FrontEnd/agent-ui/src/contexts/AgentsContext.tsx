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

type AgentsContextType = {
  agents: Agent[]
  addAgent: (agent: Agent) => Promise<boolean>
  updateAgent: (agent: Agent) => Promise<boolean>
  deleteAgent: (agentId: string) => Promise<boolean>
  resetToDefaultAgents: () => Promise<boolean>
  loading: boolean
  error: string | null
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined)

// API base URL
const API_BASE_URL = 'http://localhost:7777/api'

export function AgentsProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar agentes da API
  const loadAgents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/agents`)
      if (!response.ok) {
        throw new Error(`Erro ao carregar agentes: ${response.status}`)
      }
      
      const data = await response.json()
      setAgents(data)
    } catch (err) {
      console.error('Erro ao carregar agentes:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  // Carregar agentes na inicialização
  useEffect(() => {
    loadAgents()
  }, [])

  // Adicionar agente
  const addAgent = async (agent: Agent): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agent),
      })

      if (!response.ok) {
        throw new Error(`Erro ao criar agente: ${response.status}`)
      }

      // Recarregar agentes
      await loadAgents()
      return true
    } catch (err) {
      console.error('Erro ao criar agente:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return false
    }
  }

  // Atualizar agente
  const updateAgent = async (agent: Agent): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/agents/${agent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agent),
      })

      if (!response.ok) {
        throw new Error(`Erro ao atualizar agente: ${response.status}`)
      }

      // Recarregar agentes
      await loadAgents()
      return true
    } catch (err) {
      console.error('Erro ao atualizar agente:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return false
    }
  }

  // Deletar agente
  const deleteAgent = async (agentId: string): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Erro ao deletar agente: ${response.status}`)
      }

      // Recarregar agentes
      await loadAgents()
      return true
    } catch (err) {
      console.error('Erro ao deletar agente:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return false
    }
  }

  // Resetar para agentes padrão
  const resetToDefaultAgents = async (): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/agents/reset`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Erro ao resetar agentes: ${response.status}`)
      }

      // Recarregar agentes
      await loadAgents()
      return true
    } catch (err) {
      console.error('Erro ao resetar agentes:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return false
    }
  }

  const value: AgentsContextType = {
    agents,
    addAgent,
    updateAgent,
    deleteAgent,
    resetToDefaultAgents,
    loading,
    error
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
    throw new Error('useAgents deve ser usado dentro de um AgentsProvider')
  }
  return context
}
