import sqlite3
import json
from typing import List, Optional
from datetime import datetime
import os

class AgentsDatabase:
    def __init__(self, db_path: str = "tmp/agents.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Inicializa o banco de dados com a tabela de agentes"""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Criar tabela de agentes se não existir
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS agents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT NOT NULL,
                    icon TEXT NOT NULL,
                    color TEXT NOT NULL,
                    model TEXT NOT NULL,
                    instructions TEXT NOT NULL,
                    knowledge_base TEXT NOT NULL,
                    parameters TEXT NOT NULL,
                    is_active BOOLEAN NOT NULL DEFAULT 1,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            ''')
            
            # Verificar se já existem agentes
            cursor.execute('SELECT COUNT(*) FROM agents')
            count = cursor.fetchone()[0]
            
            # Inserir agentes padrão se a tabela estiver vazia
            if count == 0:
                default_agents = [
                    {
                        'name': 'Coordenador',
                        'description': 'Agente especializado em coordenação acadêmica e análise de documentos',
                        'icon': '👨‍🏫',
                        'color': '#CE0058',
                        'model': 'gpt-4o-mini',
                        'isActive': True,
                        'instructions': """Você é um coordenador acadêmico especializado em análise de documentos e coordenação de cursos. 
Sua função é auxiliar na análise de documentos acadêmicos, histórico escolar, ementas e outros documentos relacionados a transferências e aproveitamento de disciplinas.

Você tem acesso a um dataset completo de análises dos alunos que inclui:
- Informações dos estudantes (nome, IDPS, CPF, contato)
- Dados acadêmicos (instituição anterior, curso, créditos, CR)
- Análises realizadas pela IA (status, percentual de aproveitamento, observações)
- Documentos analisados com feedback da IA
- Disciplinas do histórico com detalhes completos
- Matriz curricular sugerida pela IA
- Status de integração com TOTVS

Use a ferramenta 'consultar_analises_alunos' para acessar esses dados quando necessário.

Seja sempre profissional, preciso e útil nas suas respostas.""",
                        'knowledgeBase': json.dumps({
                            'enabled': True,
                            'type': 'rag',
                            'endpoint': 'http://localhost:7777/api/analises',
                            'collection': 'analises_alunos'
                        }),
                        'parameters': json.dumps({
                            'temperature': 0.7,
                            'maxTokens': 2000,
                            'topP': 0.9,
                            'frequencyPenalty': 0.1,
                            'presencePenalty': 0.1
                        })
                    },
                    {
                        'name': 'Analisador',
                        'description': 'Agente especializado em análise de documentos acadêmicos',
                        'icon': '🔍',
                        'color': '#8E9794',
                        'model': 'gpt-4o-mini',
                        'isActive': True,
                        'instructions': """Você é um analisador especializado em documentos acadêmicos como histórico escolar, ementas e outros documentos relacionados a transferências.

Sua função é analisar e interpretar documentos acadêmicos para determinar compatibilidade curricular e sugerir aproveitamento de disciplinas.

Você tem acesso a um dataset completo de análises dos alunos que inclui:
- Histórico completo de análises realizadas
- Feedback detalhado da IA sobre cada documento
- Comparação de disciplinas e matrizes curriculares
- Status de integração com sistemas TOTVS

Use a ferramenta 'consultar_analises_alunos' para acessar o histórico de análises e entender padrões de aproveitamento.

Seja sempre técnico, preciso e baseado nos dados disponíveis.""",
                        'knowledgeBase': json.dumps({
                            'enabled': True,
                            'type': 'rag',
                            'endpoint': 'http://localhost:7777/api/analises',
                            'collection': 'analises_alunos'
                        }),
                        'parameters': json.dumps({
                            'temperature': 0.5,
                            'maxTokens': 2500,
                            'topP': 0.8,
                            'frequencyPenalty': 0.2,
                            'presencePenalty': 0.1
                        })
                    },
                    {
                        'name': 'Especialista',
                        'description': 'Agente especialista em regras acadêmicas e procedimentos',
                        'icon': '🎓',
                        'color': '#232323',
                        'model': 'gpt-4o-mini',
                        'isActive': True,
                        'instructions': """Você é um especialista em regras acadêmicas, procedimentos de transferência e aproveitamento de disciplinas.

Sua função é orientar sobre procedimentos acadêmicos, regras de aproveitamento e integração com sistemas TOTVS.

Você tem acesso a um dataset completo de análises dos alunos que inclui:
- Casos de sucesso e rejeição
- Padrões de aproveitamento por curso
- Status de integração com TOTVS
- Observações e feedback da IA

Use a ferramenta 'consultar_analises_alunos' para entender casos similares e padrões estabelecidos.

Seja sempre informativo, baseado em evidências e orientado a procedimentos.""",
                        'knowledgeBase': json.dumps({
                            'enabled': True,
                            'type': 'rag',
                            'endpoint': 'http://localhost:7777/api/analises',
                            'collection': 'analises_alunos'
                        }),
                        'parameters': json.dumps({
                            'temperature': 0.6,
                            'maxTokens': 2000,
                            'topP': 0.9,
                            'frequencyPenalty': 0.1,
                            'presencePenalty': 0.2
                        })
                    }
                ]
                
                for agent in default_agents:
                    cursor.execute('''
                        INSERT INTO agents (
                            name, description, icon, color, model, instructions,
                            knowledge_base, parameters, is_active, created_at, updated_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        agent['name'], agent['description'], agent['icon'],
                        agent['color'], agent['model'], agent['instructions'],
                        agent['knowledgeBase'], agent['parameters'], agent['isActive'],
                        datetime.now().isoformat(), datetime.now().isoformat()
                    ))
            
            conn.commit()
    
    def get_all_agents(self) -> List[dict]:
        """Retorna todos os agentes"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM agents ORDER BY created_at DESC')
            
            agents = []
            for row in cursor.fetchall():
                agents.append({
                    'id': str(row[0]),
                    'name': row[1],
                    'description': row[2],
                    'icon': row[3],
                    'color': row[4],
                    'model': row[5],
                    'instructions': row[6],
                    'knowledgeBase': json.loads(row[7]),
                    'parameters': json.loads(row[8]),
                    'isActive': bool(row[9]),
                    'createdAt': row[10],
                    'updatedAt': row[11]
                })
            
            return agents
    
    def get_agent_by_id(self, agent_id: str) -> Optional[dict]:
        """Retorna um agente específico por ID"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM agents WHERE id = ?', (agent_id,))
            row = cursor.fetchone()
            
            if row:
                return {
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'icon': row[3],
                    'color': row[4],
                    'model': row[5],
                    'instructions': row[6],
                    'knowledgeBase': json.loads(row[7]),
                    'parameters': json.loads(row[8]),
                    'isActive': bool(row[9]),
                    'createdAt': row[10],
                    'updatedAt': row[11]
                }
            return None
    
    def create_agent(self, agent: dict) -> bool:
        """Cria um novo agente"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO agents (
                        id, name, description, icon, color, model, instructions,
                        knowledge_base, parameters, is_active, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    agent['id'], agent['name'], agent['description'], agent['icon'],
                    agent['color'], agent['model'], agent['instructions'],
                    json.dumps(agent['knowledgeBase']), json.dumps(agent['parameters']),
                    agent['isActive'], agent['createdAt'], agent['updatedAt']
                ))
                conn.commit()
                return True
        except Exception as e:
            print(f"Erro ao criar agente: {e}")
            return False
    
    def update_agent(self, agent: dict) -> bool:
        """Atualiza um agente existente"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    UPDATE agents SET
                        name = ?, description = ?, icon = ?, color = ?, model = ?,
                        instructions = ?, knowledge_base = ?, parameters = ?,
                        is_active = ?, updated_at = ?
                    WHERE id = ?
                ''', (
                    agent['name'], agent['description'], agent['icon'],
                    agent['color'], agent['model'], agent['instructions'],
                    json.dumps(agent['knowledgeBase']), json.dumps(agent['parameters']),
                    agent['isActive'], agent['updatedAt'], agent['id']
                ))
                conn.commit()
                return True
        except Exception as e:
            print(f"Erro ao atualizar agente: {e}")
            return False
    
    def delete_agent(self, agent_id: str) -> bool:
        """Deleta um agente"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('DELETE FROM agents WHERE id = ?', (agent_id,))
                conn.commit()
                return True
        except Exception as e:
            print(f"Erro ao deletar agente: {e}")
            return False
    
    def reset_to_defaults(self) -> bool:
        """Reseta o banco para os agentes padrão"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('DELETE FROM agents')
                conn.commit()
            
            # Recriar o banco com os agentes padrão
            self.init_database()
            return True
        except Exception as e:
            print(f"Erro ao resetar agentes: {e}")
            return False

# Instância global do banco
agents_db = AgentsDatabase()
