import os
from dotenv import load_dotenv
from agno.agent import Agent
from agno.tools import Function
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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://localhost:3002", "http://192.168.20.155:3000", "http://192.168.20.155:3001", "http://192.168.20.155:3002"],
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

def web_search(query: str) -> str:
    """Simula uma busca na web"""
    return f"Resultados simulados para: {query}"

def consultar_analises_alunos(
    filtro_estudante: str = "",
    filtro_status: str = "",
    filtro_curso: str = "",
    filtro_coligada: str = "",
    incluir_documentos: bool = True,
    incluir_disciplinas: bool = True,
    incluir_matriz_sugerida: bool = True
) -> str:
    """
    Consulta o dataset completo de análises dos alunos.
    
    Args:
        filtro_estudante: Nome ou IDPS do estudante para filtrar
        filtro_status: Status da análise (aprovado, rejeitado, pendente)
        filtro_curso: Curso específico para filtrar
        filtro_coligada: Coligada específica para filtrar
        incluir_documentos: Se deve incluir detalhes dos documentos
        incluir_disciplinas: Se deve incluir disciplinas do histórico
        incluir_matriz_sugerida: Se deve incluir matriz curricular sugerida
    
    Returns:
        String formatada com as análises encontradas
    """
    # Dataset mock das análises (em produção viria do banco de dados)
    analises = [
        {
            "id": "1",
            "estudante": {
                "nome": "João Silva",
                "idps": "156",
                "cpf": "123.456.789-00",
                "email": "joao.silva@email.com",
                "telefone": "(27) 99999-9999",
                "dataNascimento": "1995-03-15"
            },
            "academico": {
                "instituicaoAnterior": "Universidade Federal do Espírito Santo",
                "cursoAnterior": "Engenharia Civil",
                "creditosConcluidos": 85,
                "totalCreditos": 100,
                "cr": 8.5
            },
            "analise": {
                "tipo": "transferencia",
                "status": "aprovado",
                "dataAnalise": "2024-01-15T10:30:00Z",
                "agenteIA": "Agente de Análise Curricular",
                "percentualAproveitamento": 85,
                "observacoes": "Excelente aproveitamento em disciplinas de exatas. Recomenda-se validação manual para disciplinas específicas."
            },
            "contexto": {
                "coligada": "1. PVT SOFTWARE",
                "filial": "1. Vila Velha ES",
                "nivelEnsino": "Graduação",
                "curso": "Engenharia de Software",
                "processoSeletivo": "2023/2024"
            },
            "documentos": [
                {
                    "id": "doc1",
                    "nome": "Historico 2023.pdf",
                    "tipo": "historico",
                    "statusIA": "analisado",
                    "recomendacao": "Aproveitamento de 85% - Disciplinas de Matemática e Física compatíveis",
                    "integracaoTOTVS": {
                        "status": "integrado",
                        "ultimaSincronizacao": "2024-01-15T11:00:00Z"
                    }
                },
                {
                    "id": "doc2",
                    "nome": "Ementa Matematica.pdf",
                    "tipo": "ementa",
                    "statusIA": "analisado",
                    "recomendacao": "Conteúdo 90% compatível com Cálculo I e II",
                    "integracaoTOTVS": {
                        "status": "integrado",
                        "ultimaSincronizacao": "2024-01-14T15:00:00Z"
                    }
                }
            ],
            "disciplinas": [
                {
                    "codigo": "MAT001",
                    "nome": "Cálculo I",
                    "cargaHoraria": 60,
                    "creditos": 4,
                    "semestre": 1,
                    "nota": 8.5,
                    "status": "aprovado"
                },
                {
                    "codigo": "MAT002",
                    "nome": "Cálculo II",
                    "cargaHoraria": 60,
                    "creditos": 4,
                    "semestre": 2,
                    "nota": 8.0,
                    "status": "aprovado"
                },
                {
                    "codigo": "FIS001",
                    "nome": "Física I",
                    "cargaHoraria": 60,
                    "creditos": 4,
                    "semestre": 1,
                    "nota": 7.5,
                    "status": "aprovado"
                }
            ],
            "matrizSugerida": {
                "cursoSugerido": "Engenharia de Software",
                "instituicao": "AFYA - Vila Velha",
                "totalAproveitamento": 85,
                "observacoes": "Excelente aproveitamento em disciplinas de exatas. Recomenda-se validação de disciplinas específicas de programação.",
                "aproveitamentoDisciplinas": [
                    {
                        "origem": "Cálculo I",
                        "destino": "Cálculo I",
                        "aproveitamento": "total",
                        "compatibilidade": 95,
                        "observacoes": "Disciplina totalmente compatível"
                    },
                    {
                        "origem": "Física I",
                        "destino": "Física I",
                        "aproveitamento": "total",
                        "compatibilidade": 88,
                        "observacoes": "Disciplina totalmente compatível"
                    }
                ]
            }
        },
        {
            "id": "2",
            "estudante": {
                "nome": "Maria Santos",
                "idps": "189",
                "cpf": "987.654.321-00",
                "email": "maria.santos@email.com",
                "telefone": "(27) 88888-8888",
                "dataNascimento": "1998-07-22"
            },
            "academico": {
                "instituicaoAnterior": "Instituto Federal do Espírito Santo",
                "cursoAnterior": "Técnico em Mecatrônica",
                "creditosConcluidos": 45,
                "totalCreditos": 50,
                "cr": 9.2
            },
            "analise": {
                "tipo": "transferencia",
                "status": "aprovado",
                "dataAnalise": "2024-01-14T14:20:00Z",
                "agenteIA": "Agente de Análise de Ementas",
                "percentualAproveitamento": 92,
                "observacoes": "Excelente compatibilidade curricular. Todas as disciplinas foram validadas automaticamente."
            },
            "contexto": {
                "coligada": "1. PVT SOFTWARE",
                "filial": "1. Vila Velha ES",
                "nivelEnsino": "Graduação",
                "curso": "Ciência da Computação",
                "processoSeletivo": "2023/2024"
            },
            "documentos": [
                {
                    "id": "doc4",
                    "nome": "Historico 2022.pdf",
                    "tipo": "historico",
                    "statusIA": "analisado",
                    "recomendacao": "Aproveitamento de 92% - Excelente compatibilidade curricular",
                    "integracaoTOTVS": {
                        "status": "integrado",
                        "ultimaSincronizacao": "2024-01-14T10:00:00Z"
                    }
                }
            ],
            "disciplinas": [
                {
                    "codigo": "MAT001",
                    "nome": "Matemática Aplicada",
                    "cargaHoraria": 60,
                    "creditos": 4,
                    "semestre": 1,
                    "nota": 9.0,
                    "status": "aprovado"
                },
                {
                    "codigo": "FIS001",
                    "nome": "Física Aplicada",
                    "cargaHoraria": 60,
                    "creditos": 4,
                    "semestre": 1,
                    "nota": 9.5,
                    "status": "aprovado"
                }
            ],
            "matrizSugerida": {
                "cursoSugerido": "Ciência da Computação",
                "instituicao": "AFYA - Vila Velha",
                "totalAproveitamento": 92,
                "observacoes": "Excelente aproveitamento em disciplinas de exatas. Todas as disciplinas foram validadas automaticamente.",
                "aproveitamentoDisciplinas": [
                    {
                        "origem": "Matemática Aplicada",
                        "destino": "Cálculo I",
                        "aproveitamento": "total",
                        "compatibilidade": 95,
                        "observacoes": "Disciplina totalmente compatível"
                    }
                ]
            }
        },
        {
            "id": "3",
            "estudante": {
                "nome": "Carlos Ferreira",
                "idps": "134",
                "cpf": "999.888.777-66",
                "email": "carlos.ferreira@email.com",
                "telefone": "(27) 55555-5555",
                "dataNascimento": "1994-09-25"
            },
            "academico": {
                "instituicaoAnterior": "Universidade Estadual do Rio de Janeiro",
                "cursoAnterior": "Administração",
                "creditosConcluidos": 45,
                "totalCreditos": 100,
                "cr": 6.8
            },
            "analise": {
                "tipo": "transferencia",
                "status": "rejeitado",
                "dataAnalise": "2024-01-13T11:20:00Z",
                "agenteIA": "Agente de Análise Curricular",
                "percentualAproveitamento": 45,
                "observacoes": "Baixa compatibilidade curricular. Necessita revisão manual e possível complementação."
            },
            "contexto": {
                "coligada": "1. PVT SOFTWARE",
                "filial": "1. Vila Velha ES",
                "nivelEnsino": "Graduação",
                "curso": "Engenharia Civil",
                "processoSeletivo": "2023/2024"
            },
            "documentos": [
                {
                    "id": "doc7",
                    "nome": "Historico 2021.pdf",
                    "tipo": "historico",
                    "statusIA": "analisado",
                    "recomendacao": "Aproveitamento de 45% - Baixa compatibilidade curricular",
                    "integracaoTOTVS": {
                        "status": "erro",
                        "ultimaSincronizacao": "2024-01-13T12:00:00Z",
                        "mensagemErro": "Documento rejeitado pela IA - Baixa compatibilidade"
                    }
                }
            ],
            "disciplinas": [
                {
                    "codigo": "ADM001",
                    "nome": "Administração Geral",
                    "cargaHoraria": 60,
                    "creditos": 4,
                    "semestre": 1,
                    "nota": 7.0,
                    "status": "aprovado"
                },
                {
                    "codigo": "ECO001",
                    "nome": "Economia",
                    "cargaHoraria": 60,
                    "creditos": 4,
                    "semestre": 2,
                    "nota": 6.5,
                    "status": "aprovado"
                }
            ],
            "matrizSugerida": {
                "cursoSugerido": "Engenharia Civil",
                "instituicao": "AFYA - Vila Velha",
                "totalAproveitamento": 45,
                "observacoes": "Baixa compatibilidade curricular. Necessita revisão manual e possível complementação.",
                "aproveitamentoDisciplinas": [
                    {
                        "origem": "Administração Geral",
                        "destino": "Gestão de Projetos",
                        "aproveitamento": "parcial",
                        "compatibilidade": 60,
                        "observacoes": "Aproveitamento parcial - conteúdo similar mas foco diferente"
                    }
                ]
            }
        }
    ]
    
    # Aplicar filtros
    analises_filtradas = analises
    
    if filtro_estudante:
        analises_filtradas = [a for a in analises_filtradas 
                             if filtro_estudante.lower() in a["estudante"]["nome"].lower() 
                             or filtro_estudante in a["estudante"]["idps"]]
    
    if filtro_status:
        analises_filtradas = [a for a in analises_filtradas 
                             if a["analise"]["status"] == filtro_status]
    
    if filtro_curso:
        analises_filtradas = [a for a in analises_filtradas 
                             if filtro_curso.lower() in a["contexto"]["curso"].lower()]
    
    if filtro_coligada:
        analises_filtradas = [a for a in analises_filtradas 
                             if filtro_coligada.lower() in a["contexto"]["coligada"].lower()]
    
    # Formatar resultado
    resultado = f"📊 **Dataset de Análises dos Alunos**\n\n"
    resultado += f"🔍 **Filtros aplicados:**\n"
    resultado += f"- Estudante: {filtro_estudante or 'Todos'}\n"
    resultado += f"- Status: {filtro_status or 'Todos'}\n"
    resultado += f"- Curso: {filtro_curso or 'Todos'}\n"
    resultado += f"- Coligada: {filtro_coligada or 'Todas'}\n\n"
    
    resultado += f"📈 **Total de análises encontradas:** {len(analises_filtradas)}\n\n"
    
    for analise in analises_filtradas:
        resultado += f"🎓 **Análise #{analise['id']} - {analise['estudante']['nome']}**\n"
        resultado += f"   📋 IDPS: {analise['estudante']['idps']}\n"
        resultado += f"   🏫 Instituição Anterior: {analise['academico']['instituicaoAnterior']}\n"
        resultado += f"   📚 Curso Anterior: {analise['academico']['cursoAnterior']}\n"
        resultado += f"   🎯 Curso Destino: {analise['contexto']['curso']}\n"
        resultado += f"   📊 Status: {analise['analise']['status'].upper()}\n"
        resultado += f"   🧠 Percentual Aproveitamento: {analise['analise']['percentualAproveitamento']}%\n"
        resultado += f"   🤖 Agente IA: {analise['analise']['agenteIA']}\n"
        resultado += f"   📝 Observações: {analise['analise']['observacoes']}\n"
        
        if incluir_documentos and analise['documentos']:
            resultado += f"\n   📄 **Documentos Analisados:**\n"
            for doc in analise['documentos']:
                resultado += f"      - {doc['nome']} ({doc['tipo']}) - {doc['statusIA']}\n"
                resultado += f"        Recomendação: {doc['recomendacao']}\n"
                resultado += f"        TOTVS: {doc['integracaoTOTVS']['status']}\n"
        
        if incluir_disciplinas and analise['disciplinas']:
            resultado += f"\n   📚 **Disciplinas do Histórico:**\n"
            for disc in analise['disciplinas']:
                resultado += f"      - {disc['codigo']}: {disc['nome']} ({disc['cargaHoraria']}h, {disc['creditos']} créditos)\n"
                resultado += f"        Semestre: {disc['semestre']}º, Nota: {disc['nota']}, Status: {disc['status']}\n"
        
        if incluir_matriz_sugerida and analise['matrizSugerida']:
            resultado += f"\n   🎯 **Matriz Curricular Sugerida:**\n"
            resultado += f"      Curso: {analise['matrizSugerida']['cursoSugerido']}\n"
            resultado += f"      Instituição: {analise['matrizSugerida']['instituicao']}\n"
            resultado += f"      Total Aproveitamento: {analise['matrizSugerida']['totalAproveitamento']}%\n"
            resultado += f"      Observações: {analise['matrizSugerida']['observacoes']}\n"
            
            if analise['matrizSugerida']['aproveitamentoDisciplinas']:
                resultado += f"\n      📋 **Disciplinas Aproveitadas:**\n"
                for ap in analise['matrizSugerida']['aproveitamentoDisciplinas']:
                    resultado += f"         - {ap['origem']} → {ap['destino']} ({ap['aproveitamento']}, {ap['compatibilidade']}%)\n"
                    resultado += f"           {ap['observacoes']}\n"
        
        resultado += "\n" + "─" * 80 + "\n\n"
    
    return resultado

# Ferramentas disponíveis para os agentes
tools = [
    Function(
        name="web_search",
        description="Busca informações atualizadas na internet sobre um tópico específico",
        func=web_search
    ),
    Function(
        name="consultar_analises_alunos",
        description="Consulta o dataset completo de análises dos alunos, incluindo histórico acadêmico, documentos analisados, feedback da IA e status de integração TOTVS. Útil para entender o contexto completo de um estudante ou análise específica.",
        func=consultar_analises_alunos
    )
]

# Função para criar agentes Agno dinamicamente do banco
def create_agno_agents():
    """Cria agentes Agno baseados nos dados do banco"""
    db_agents = agents_db.get_all_agents()
    agno_agents = []
    
    for db_agent in db_agents:
        if not db_agent['isActive']:
            continue
            
        # Configurar modelo baseado nos parâmetros do banco
        params = db_agent['parameters']
        model = OpenAIChat(
            id=db_agent['model'],
            api_key=os.getenv("OPENAI_API_KEY"),
            temperature=params.get('temperature', 0.7),
            max_tokens=params.get('maxTokens', 2000),
            top_p=params.get('topP', 0.9),
            frequency_penalty=params.get('frequencyPenalty', 0.1),
            presence_penalty=params.get('presencePenalty', 0.1)
        )
        
        # Criar agente Agno
        agno_agent = Agent(
            name=db_agent['name'],
            description=db_agent['description'],
            instructions=db_agent['instructions'],
            tools=tools,
            model=model
        )
        
        agno_agents.append(agno_agent)
    
    return agno_agents

# Criar agentes dinamicamente do banco e configurar playground
dynamic_agents = create_agno_agents()
playground_app = Playground(agents=dynamic_agents)
playground_router = playground_app.get_app()

# Configurar CORS para o playground
playground_router.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://localhost:3002", "http://192.168.20.155:3000", "http://192.168.20.155:3001", "http://192.168.20.155:3002"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=["*"],
)

# Montar as aplicações
app = FastAPI(title="AFYA Platform", version="1.0.0")

# Configurar CORS para a aplicação principal
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://localhost:3002", "http://192.168.20.155:3000", "http://192.168.20.155:3001", "http://192.168.20.155:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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