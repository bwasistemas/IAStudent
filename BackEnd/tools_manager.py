import json
import requests
from typing import Dict, List, Any, Optional
from agno.tools import Function
import sqlite3
from datetime import datetime

class ToolsManager:
    """
    Gerenciador de ferramentas dinâmicas para integração com agentes.
    Permite configurar e executar APIs externas, bases de dados e webhooks.
    """
    
    def __init__(self, db_path: str = "tmp/tools.db"):
        self.db_path = db_path
        self._init_database()
    
    def _init_database(self):
        """Inicializa a base de dados de ferramentas"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS tools (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT NOT NULL,
                    type TEXT NOT NULL,
                    endpoint TEXT NOT NULL,
                    method TEXT DEFAULT 'GET',
                    authentication TEXT DEFAULT '{}',
                    headers TEXT DEFAULT '{}',
                    parameters TEXT DEFAULT '[]',
                    response_mapping TEXT DEFAULT '{}',
                    is_active BOOLEAN DEFAULT 1,
                    last_tested TEXT,
                    test_status TEXT,
                    test_message TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            
            # Inserir ferramentas padrão se não existirem
            self._insert_default_tools(conn)
    
    def _insert_default_tools(self, conn):
        """Insere ferramentas padrão no banco"""
        default_tools = [
            {
                'id': 'afya_dispensas_api',
                'name': 'API de Dispensas AFYA',
                'description': 'Consulta histórico de dispensas e equivalências acadêmicas aprovadas',
                'type': 'api',
                'endpoint': 'https://api.afya.edu.br/v1/dispensas',
                'method': 'GET',
                'authentication': json.dumps({
                    'type': 'bearer',
                    'token': ''
                }),
                'headers': json.dumps({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }),
                'parameters': json.dumps([
                    {
                        'name': 'curso_origem',
                        'type': 'string',
                        'required': False,
                        'description': 'Filtrar por curso de origem'
                    },
                    {
                        'name': 'disciplina',
                        'type': 'string',
                        'required': False,
                        'description': 'Nome da disciplina para buscar equivalências'
                    },
                    {
                        'name': 'instituicao',
                        'type': 'string',
                        'required': False,
                        'description': 'Instituição de origem do estudante'
                    }
                ]),
                'response_mapping': json.dumps({
                    'dataPath': 'data.dispensas',
                    'fields': [
                        {'source': 'disciplina_origem', 'target': 'disciplina_origem', 'type': 'string'},
                        {'source': 'disciplina_destino', 'target': 'disciplina_destino', 'type': 'string'},
                        {'source': 'percentual_equivalencia', 'target': 'equivalencia', 'type': 'number'},
                        {'source': 'observacoes', 'target': 'observacoes', 'type': 'string'}
                    ]
                }),
                'is_active': True,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            },
            {
                'id': 'matriz_curricular_db',
                'name': 'Base de Matriz Curricular AFYA',
                'description': 'Consulta matrizes curriculares atualizadas dos cursos AFYA',
                'type': 'database',
                'endpoint': 'https://db.afya.edu.br/api/matriz-curricular',
                'method': 'POST',
                'authentication': json.dumps({
                    'type': 'api_key',
                    'apiKey': '',
                    'headerName': 'X-API-Key'
                }),
                'headers': json.dumps({
                    'Content-Type': 'application/json'
                }),
                'parameters': json.dumps([
                    {
                        'name': 'curso_id',
                        'type': 'string',
                        'required': True,
                        'description': 'ID do curso para consultar matriz'
                    },
                    {
                        'name': 'ano_letivo',
                        'type': 'string',
                        'required': False,
                        'description': 'Ano letivo da matriz (padrão: atual)'
                    }
                ]),
                'response_mapping': json.dumps({
                    'dataPath': 'matriz.disciplinas',
                    'fields': [
                        {'source': 'codigo', 'target': 'codigo_disciplina', 'type': 'string'},
                        {'source': 'nome', 'target': 'nome_disciplina', 'type': 'string'},
                        {'source': 'carga_horaria', 'target': 'carga_horaria', 'type': 'number'},
                        {'source': 'creditos', 'target': 'creditos', 'type': 'number'},
                        {'source': 'periodo', 'target': 'periodo', 'type': 'number'}
                    ]
                }),
                'is_active': True,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            },
            {
                'id': 'totvs_integration',
                'name': 'Integração TOTVS Educacional',
                'description': 'Webhook para sincronização com sistema TOTVS',
                'type': 'webhook',
                'endpoint': 'https://totvs.afya.edu.br/webhook/aproveitamento',
                'method': 'POST',
                'authentication': json.dumps({
                    'type': 'basic',
                    'username': '',
                    'password': ''
                }),
                'headers': json.dumps({
                    'Content-Type': 'application/json'
                }),
                'parameters': json.dumps([
                    {
                        'name': 'estudante_id',
                        'type': 'string',
                        'required': True,
                        'description': 'ID do estudante no sistema TOTVS'
                    },
                    {
                        'name': 'disciplinas_aproveitadas',
                        'type': 'array',
                        'required': True,
                        'description': 'Array de disciplinas aproveitadas'
                    }
                ]),
                'response_mapping': json.dumps({
                    'dataPath': 'result',
                    'fields': [
                        {'source': 'status', 'target': 'status_sincronizacao', 'type': 'string'},
                        {'source': 'message', 'target': 'mensagem', 'type': 'string'},
                        {'source': 'id_processo', 'target': 'id_processo', 'type': 'string'}
                    ]
                }),
                'is_active': False,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
        ]
        
        for tool in default_tools:
            conn.execute("""
                INSERT OR IGNORE INTO tools 
                (id, name, description, type, endpoint, method, authentication, headers, parameters, response_mapping, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                tool['id'], tool['name'], tool['description'], tool['type'],
                tool['endpoint'], tool['method'], tool['authentication'],
                tool['headers'], tool['parameters'], tool['response_mapping'],
                tool['is_active'], tool['created_at'], tool['updated_at']
            ))
    
    def get_all_tools(self) -> List[Dict]:
        """Retorna todas as ferramentas configuradas"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("SELECT * FROM tools ORDER BY created_at")
            tools = []
            for row in cursor.fetchall():
                tool = dict(row)
                # Parse JSON fields
                tool['authentication'] = json.loads(tool['authentication'])
                tool['headers'] = json.loads(tool['headers'])
                tool['parameters'] = json.loads(tool['parameters'])
                tool['response_mapping'] = json.loads(tool['response_mapping'])
                tools.append(tool)
            return tools
    
    def get_active_tools(self) -> List[Dict]:
        """Retorna apenas ferramentas ativas"""
        return [tool for tool in self.get_all_tools() if tool['is_active']]
    
    def create_tool_function(self, tool: Dict) -> Function:
        """
        Cria uma função Agno para uma ferramenta específica
        """
        def tool_executor(**kwargs) -> str:
            return self._execute_tool(tool, kwargs)
        
        # Criar descrição detalhada dos parâmetros
        param_descriptions = []
        for param in tool['parameters']:
            required_text = "obrigatório" if param['required'] else "opcional"
            param_descriptions.append(f"- {param['name']} ({param['type']}, {required_text}): {param['description']}")
        
        description = f"{tool['description']}\n\nParâmetros disponíveis:\n" + "\n".join(param_descriptions)
        
        return Function(
            name=f"tool_{tool['id']}",
            description=description,
            func=tool_executor
        )
    
    def _execute_tool(self, tool: Dict, params: Dict) -> str:
        """
        Executa uma ferramenta com os parâmetros fornecidos
        """
        try:
            # Preparar headers
            headers = tool['headers'].copy()
            
            # Adicionar autenticação
            auth = tool['authentication']
            if auth['type'] == 'bearer' and auth.get('token'):
                headers['Authorization'] = f"Bearer {auth['token']}"
            elif auth['type'] == 'api_key' and auth.get('apiKey'):
                header_name = auth.get('headerName', 'X-API-Key')
                headers[header_name] = auth['apiKey']
            elif auth['type'] == 'basic' and auth.get('username') and auth.get('password'):
                import base64
                credentials = base64.b64encode(f"{auth['username']}:{auth['password']}".encode()).decode()
                headers['Authorization'] = f"Basic {credentials}"
            
            # Preparar parâmetros
            if tool['method'].upper() == 'GET':
                response = requests.get(tool['endpoint'], params=params, headers=headers, timeout=30)
            else:
                response = requests.post(tool['endpoint'], json=params, headers=headers, timeout=30)
            
            response.raise_for_status()
            
            # Processar resposta
            data = response.json()
            return self._format_response(tool, data)
            
        except requests.RequestException as e:
            return f"❌ Erro na requisição para {tool['name']}: {str(e)}"
        except json.JSONDecodeError:
            return f"❌ Erro ao decodificar resposta JSON de {tool['name']}"
        except Exception as e:
            return f"❌ Erro inesperado ao executar {tool['name']}: {str(e)}"
    
    def _format_response(self, tool: Dict, data: Dict) -> str:
        """
        Formata a resposta da API baseado no mapeamento configurado
        """
        try:
            mapping = tool['response_mapping']
            data_path = mapping.get('dataPath', '')
            
            # Navegar pelo caminho dos dados
            result_data = data
            if data_path:
                for path_part in data_path.split('.'):
                    if path_part and isinstance(result_data, dict):
                        result_data = result_data.get(path_part, {})
            
            # Se o resultado for uma lista, processar cada item
            if isinstance(result_data, list):
                formatted_results = []
                for item in result_data[:10]:  # Limitar a 10 resultados
                    formatted_item = self._map_fields(item, mapping.get('fields', []))
                    formatted_results.append(formatted_item)
                
                result = f"✅ {tool['name']} - {len(formatted_results)} resultados encontrados:\n\n"
                for i, item in enumerate(formatted_results, 1):
                    result += f"📋 Resultado {i}:\n"
                    for key, value in item.items():
                        result += f"   • {key}: {value}\n"
                    result += "\n"
                
                return result
            else:
                # Resultado único
                formatted_item = self._map_fields(result_data, mapping.get('fields', []))
                result = f"✅ {tool['name']} - Resultado:\n\n"
                for key, value in formatted_item.items():
                    result += f"• {key}: {value}\n"
                return result
                
        except Exception as e:
            return f"⚠️ Dados recebidos de {tool['name']}, mas erro na formatação: {str(e)}\n\nDados brutos: {json.dumps(data, indent=2, ensure_ascii=False)}"
    
    def _map_fields(self, data: Dict, field_mappings: List[Dict]) -> Dict:
        """
        Mapeia campos baseado na configuração de mapeamento
        """
        result = {}
        for mapping in field_mappings:
            source = mapping.get('source', '')
            target = mapping.get('target', source)
            field_type = mapping.get('type', 'string')
            
            if source in data:
                value = data[source]
                
                # Converter tipo se necessário
                try:
                    if field_type == 'number' and isinstance(value, (str, int, float)):
                        value = float(value) if '.' in str(value) else int(value)
                    elif field_type == 'boolean':
                        value = bool(value)
                    elif field_type == 'string':
                        value = str(value)
                except (ValueError, TypeError):
                    pass  # Manter valor original se conversão falhar
                
                result[target] = value
        
        return result
    
    def test_tool(self, tool_id: str) -> Dict[str, Any]:
        """
        Testa uma ferramenta específica
        """
        tools = self.get_all_tools()
        tool = next((t for t in tools if t['id'] == tool_id), None)
        
        if not tool:
            return {
                'success': False,
                'message': 'Ferramenta não encontrada'
            }
        
        try:
            # Teste básico de conectividade
            headers = tool['headers'].copy()
            
            # Adicionar autenticação para teste
            auth = tool['authentication']
            if auth['type'] == 'bearer' and auth.get('token'):
                headers['Authorization'] = f"Bearer {auth['token']}"
            elif auth['type'] == 'api_key' and auth.get('apiKey'):
                header_name = auth.get('headerName', 'X-API-Key')
                headers[header_name] = auth['apiKey']
            
            # Fazer requisição de teste
            if tool['method'].upper() == 'GET':
                response = requests.get(tool['endpoint'], headers=headers, timeout=10)
            else:
                response = requests.post(tool['endpoint'], json={}, headers=headers, timeout=10)
            
            # Atualizar status do teste no banco
            with sqlite3.connect(self.db_path) as conn:
                if response.status_code == 200:
                    status = 'success'
                    message = 'Conexão bem-sucedida! API respondeu corretamente.'
                else:
                    status = 'error'
                    message = f'API retornou status {response.status_code}'
                
                conn.execute("""
                    UPDATE tools 
                    SET test_status = ?, test_message = ?, last_tested = ?
                    WHERE id = ?
                """, (status, message, datetime.now().isoformat(), tool_id))
            
            return {
                'success': response.status_code == 200,
                'message': message,
                'status_code': response.status_code
            }
            
        except requests.RequestException as e:
            # Atualizar status de erro no banco
            with sqlite3.connect(self.db_path) as conn:
                conn.execute("""
                    UPDATE tools 
                    SET test_status = ?, test_message = ?, last_tested = ?
                    WHERE id = ?
                """, ('error', f'Erro de conexão: {str(e)}', datetime.now().isoformat(), tool_id))
            
            return {
                'success': False,
                'message': f'Erro de conexão: {str(e)}'
            }
    
    def get_tools_for_agent(self) -> List[Function]:
        """
        Retorna todas as ferramentas ativas como funções Agno
        """
        active_tools = self.get_active_tools()
        return [self.create_tool_function(tool) for tool in active_tools]