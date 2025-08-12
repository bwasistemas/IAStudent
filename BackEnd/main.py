import os
from dotenv import load_dotenv
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.playground import Playground
from agno.storage.sqlite import SqliteStorage
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

# Importar o banco de dados
from database import agents_db

# Load environment variables
load_dotenv()

agent_storage: str = "tmp/agents.db"

# Modelos Pydantic para a API
class KnowledgeBaseModel(BaseModel):
    enabled: bool
    type: str
    endpoint: Optional[str] = None
    collection: Optional[str] = None
    documents: Optional[List[str]] = None

class ParametersModel(BaseModel):
    temperature: float
    maxTokens: int
    topP: float
    frequencyPenalty: float
    presencePenalty: float

class AgentModel(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    color: str
    model: str
    instructions: str
    knowledgeBase: KnowledgeBaseModel
    parameters: ParametersModel
    isActive: bool
    createdAt: str
    updatedAt: str

# Criar aplicação FastAPI separada para a API REST
api_app = FastAPI(title="AFYA Agents API", version="1.0.0")

# Configurar CORS
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints da API REST
@api_app.get("/agents", response_model=List[AgentModel])
async def get_agents():
    """Retorna todos os agentes"""
    try:
        agents = agents_db.get_all_agents()
        return agents
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar agentes: {str(e)}")

@api_app.get("/agents/{agent_id}", response_model=AgentModel)
async def get_agent(agent_id: str):
    """Retorna um agente específico"""
    try:
        agent = agents_db.get_agent_by_id(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        return agent
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar agente: {str(e)}")

@api_app.post("/agents", response_model=dict)
async def create_agent(agent: AgentModel):
    """Cria um novo agente"""
    try:
        # Atualizar timestamps
        agent.updatedAt = datetime.now().isoformat()
        if not agent.createdAt:
            agent.createdAt = datetime.now().isoformat()
        
        success = agents_db.create_agent(agent.dict())
        if success:
            return {"message": "Agente criado com sucesso", "id": agent.id}
        else:
            raise HTTPException(status_code=500, detail="Erro ao criar agente")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar agente: {str(e)}")

@api_app.put("/agents/{agent_id}", response_model=dict)
async def update_agent(agent_id: str, agent: AgentModel):
    """Atualiza um agente existente"""
    try:
        # Verificar se o agente existe
        existing_agent = agents_db.get_agent_by_id(agent_id)
        if not existing_agent:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        # Atualizar timestamp
        agent.updatedAt = datetime.now().isoformat()
        agent.id = agent_id  # Garantir que o ID seja o correto
        
        success = agents_db.update_agent(agent.dict())
        if success:
            return {"message": "Agente atualizado com sucesso"}
        else:
            raise HTTPException(status_code=500, detail="Erro ao atualizar agente")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar agente: {str(e)}")

@api_app.delete("/agents/{agent_id}", response_model=dict)
async def delete_agent(agent_id: str):
    """Deleta um agente"""
    try:
        success = agents_db.delete_agent(agent_id)
        if success:
            return {"message": "Agente deletado com sucesso"}
        else:
            raise HTTPException(status_code=500, detail="Erro ao deletar agente")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao deletar agente: {str(e)}")

@api_app.post("/agents/reset", response_model=dict)
async def reset_agents():
    """Reseta os agentes para os padrões"""
    try:
        success = agents_db.reset_to_defaults()
        if success:
            return {"message": "Agentes resetados para os padrões com sucesso"}
        else:
            raise HTTPException(status_code=500, detail="Erro ao resetar agentes")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao resetar agentes: {str(e)}")

# Agentes Agno existentes (mantidos para compatibilidade)
Coordenador = Agent(
    name="Coordenador de Aproveitamento de Estudos",
    model=OpenAIChat(
        id="gpt-4.1-mini",
        api_key=os.getenv("OPENAI_API_KEY")
    ),
    tools=[],
    instructions=[
        "Você é um Coordenador de Curso de Graduação especializado em validar disciplinas para aproveitamento de estudos.",
        "Sua função é analisar documentos acadêmicos de alunos e determinar equivalências entre disciplinas.",
        "Ao receber documentos, você deve:",
        "1. Analisar o conteúdo programático das disciplinas apresentadas",
        "2. Comparar com as disciplinas da matriz curricular do curso",
        "3. Calcular o percentual de equivalência/aproveitamento",
        "4. Indicar quais disciplinas podem ser aproveitadas e o percentual de compatibilidade",
        "5. Justificar suas decisões com base no conteúdo programático e carga horária",
        "Sempre forneça respostas detalhadas e fundamentadas academicamente.",
        "Use sua experiência em coordenação acadêmica para avaliar a qualidade e relevância do conteúdo."
    ],
    # Store the agent sessions in a sqlite database
    storage=SqliteStorage(table_name="coordenador_aproveitamento", db_file=agent_storage),
    # Adds the current date and time to the instructions
    add_datetime_to_instructions=True,
    # Adds the history of the conversation to the messages
    add_history_to_messages=True,
    # Number of history responses to add to the messages
    num_history_responses=5,
    # Adds markdown formatting to the messages
    markdown=True,
)

# Agent especializado em Transferência Externa e Portador de Diploma
TransferenciaExterna = Agent(
    name="Especialista em Transferência Externa e Portador de Diploma",
    model=OpenAIChat(
        id="gpt-4.1-mini",
        api_key=os.getenv("OPENAI_API_KEY")
    ),
    tools=[],
    instructions=[
        "Você é um especialista em processos de Transferência Externa e Portador de Diploma.",
        "Sua especialidade é analisar históricos acadêmicos de outras instituições de ensino superior.",
        "Para cada análise você deve:",
        "1. Verificar a autenticidade e validade dos documentos apresentados",
        "2. Analisar o histórico escolar completo do estudante",
        "3. Identificar disciplinas cursadas com aprovação (nota ≥ 6.0 ou conceito equivalente)",
        "4. Comparar ementa e carga horária com as disciplinas da matriz curricular atual",
        "5. Calcular percentual de equivalência por disciplina (0-100%)",
        "6. Sugerir aproveitamento total, parcial ou não aproveitamento",
        "7. Para Portador de Diploma: verificar se o curso é relacionado à área",
        "Critérios de aproveitamento:",
        "- Conteúdo programático compatível ≥ 75% = Aproveitamento total",
        "- Conteúdo programático compatível 50-74% = Aproveitamento parcial (complementação necessária)",
        "- Conteúdo programático compatível < 50% = Não aproveitamento",
        "- Carga horária mínima: 75% da disciplina equivalente",
        "Sempre apresente resultado em formato de relatório acadêmico detalhado."
    ],
    storage=SqliteStorage(table_name="transferencia_externa", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

# Aplicação do playground Agno
playground_app = Playground(agents=[Coordenador, TransferenciaExterna])
playground_router = playground_app.get_app()

# Montar as aplicações
app = FastAPI(title="AFYA Platform", version="1.0.0")

# Incluir as rotas do playground
app.mount("/playground", playground_router)

# Incluir as rotas da API REST
app.mount("/api", api_app)

# Rota raiz
@app.get("/")
async def root():
    return {
        "message": "AFYA Platform - Plataforma de Agentes IA Acadêmicos",
        "version": "1.0.0",
        "endpoints": {
            "playground": "/playground",
            "api": "/api",
            "agents": "/api/agents"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=7777, reload=True)