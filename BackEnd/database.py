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
                    id TEXT PRIMARY KEY,
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
            
            if count == 0:
                # Inserir agentes padrão
                self._insert_default_agents(cursor)
            
            conn.commit()
    
    def _insert_default_agents(self, cursor):
        """Insere os agentes padrão no banco"""
        default_agents = [
            {
                'id': '1',
                'name': 'Coordenador de Aproveitamento',
                'description': 'Especialista em validação de disciplinas e cálculo de equivalências',
                'icon': 'brain',
                'color': 'from-[#CE0058] to-[#B91C5C]',
                'model': 'gpt-4.1-mini',
                'instructions': '''Você é um Coordenador de Curso de Graduação especializado em validar disciplinas para aproveitamento de estudos.

Sua função é analisar documentos acadêmicos de alunos e determinar equivalências entre disciplinas.

Ao receber documentos, você deve:
1. Analisar o conteúdo programático das disciplinas apresentadas
2. Comparar com as disciplinas da matriz curricular do curso
3. Calcular o percentual de equivalência/aproveitamento
4. Indicar quais disciplinas podem ser aproveitadas e o percentual de compatibilidade
5. Justificar suas decisões com base no conteúdo programático e carga horária

IMPORTANTE: Sempre consulte a Base de Conhecimento disponível para obter informações atualizadas sobre matrizes curriculares, ementas e disciplinas antes de fazer suas análises.''',
                'knowledge_base': json.dumps({
                    'enabled': True,
                    'type': 'rag',
                    'endpoint': 'http://localhost:8000',
                    'collection': 'documents'
                }),
                'parameters': json.dumps({
                    'temperature': 0.7,
                    'maxTokens': 1000,
                    'topP': 0.9,
                    'frequencyPenalty': 0.5,
                    'presencePenalty': 0.5
                }),
                'is_active': True,
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-15T00:00:00Z'
            },
            {
                'id': '2',
                'name': 'Especialista em Transferência',
                'description': 'Transferência Externa e Portador de Diploma',
                'icon': 'graduation-cap',
                'color': 'from-[#232323] to-[#475569]',
                'model': 'gpt-4.1-mini',
                'instructions': '''Você é um especialista em processos de Transferência Externa e Portador de Diploma.

Sua especialidade é analisar históricos acadêmicos de outras instituições de ensino superior.

Para cada análise você deve:
1. Verificar a autenticidade e validade dos documentos apresentados
2. Analisar o histórico escolar completo do estudante
3. Identificar disciplinas cursadas com aprovação (nota ≥ 6.0 ou conceito equivalente)
4. Comparar ementa e carga horária com as disciplinas da matriz curricular atual
5. Calcular percentual de equivalência por disciplina (0-100%)
6. Sugerir aproveitamento total, parcial ou não aproveitamento

IMPORTANTE: Sempre consulte a Base de Conhecimento disponível para obter informações atualizadas sobre matrizes curriculares, ementas e disciplinas antes de fazer suas análises.''',
                'knowledge_base': json.dumps({
                    'enabled': True,
                    'type': 'rag',
                    'endpoint': 'http://localhost:8000',
                    'collection': 'documents'
                }),
                'parameters': json.dumps({
                    'temperature': 0.7,
                    'maxTokens': 1000,
                    'topP': 0.9,
                    'frequencyPenalty': 0.5,
                    'presencePenalty': 0.5
                }),
                'is_active': True,
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-15T00:00:00Z'
            }
        ]
        
        for agent in default_agents:
            cursor.execute('''
                INSERT INTO agents (
                    id, name, description, icon, color, model, instructions,
                    knowledge_base, parameters, is_active, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                agent['id'], agent['name'], agent['description'], agent['icon'],
                agent['color'], agent['model'], agent['instructions'],
                agent['knowledge_base'], agent['parameters'], agent['is_active'],
                agent['created_at'], agent['updated_at']
            ))
    
    def get_all_agents(self) -> List[dict]:
        """Retorna todos os agentes"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM agents ORDER BY created_at DESC')
            
            agents = []
            for row in cursor.fetchall():
                agents.append({
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
                self._insert_default_agents(cursor)
                conn.commit()
                return True
        except Exception as e:
            print(f"Erro ao resetar agentes: {e}")
            return False

# Instância global do banco
agents_db = AgentsDatabase()
