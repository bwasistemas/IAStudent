# 🎓 AFYA - Plataforma de Agentes IA Acadêmicos

Uma plataforma moderna e inteligente para gerenciamento de aproveitamento de estudos, desenvolvida com tecnologias de ponta e integração com agentes de IA especializados.

## 🚀 Funcionalidades Principais

### 🔐 Sistema de Autenticação
- **Login seguro** com diferentes níveis de acesso
- **Perfis de usuário**: Administrador e Coordenador
- **Sessões persistentes** com localStorage
- **Proteção de rotas** para usuários não autenticados
- **Logout** integrado no header principal

### 🤖 Gestão de Agentes de IA
- **Criação e edição** de agentes especializados
- **Configuração avançada** de parâmetros de IA
- **Base de Conhecimento RAG** integrada
- **Modelos configuráveis** (GPT-4o-mini, GPT-4-turbo-preview)
- **Ativação/desativação** de agentes
- **Ferramentas integradas** para consulta de dataset e busca web

### 📚 Análise de Documentos Acadêmicos
- **Histórico Escolar** - análise automática de disciplinas
- **Ementas de disciplinas** - comparação e validação
- **Cálculo de equivalências** baseado em parâmetros AFYA
- **Sugestões de alocação** de estudantes
- **Visualização detalhada** de documentos anexados
- **Status de análise da IA** com percentuais de aproveitamento
- **Matriz curricular sugerida** pela IA para TOTVS Educacional

### 🎯 Dashboard Inteligente
- **Interface moderna** com design responsivo
- **Contexto institucional** sempre visível (Coligada, Filial, Nível de Ensino)
- **Navegação intuitiva** entre funcionalidades
- **Indicadores visuais** de status e progresso
- **Sistema de filtros avançado** para análises recentes
- **Tabela de análises** com informações completas (IDPS, Processo Seletivo, Curso)

### 💬 Playground de Agentes IA
- **Interface de conversa** com agentes especializados
- **Seleção dinâmica** de agentes
- **Histórico de mensagens** persistente
- **Upload de documentos** para análise
- **Ferramentas integradas** para consulta de dataset
- **Respostas contextuais** baseadas em dados reais

### 🗂️ Sistema de Filtros e Busca
- **Filtros por status** (Aprovado, Rejeitado, Pendente)
- **Filtros por tipo** (Transferência, Portador de Diploma)
- **Filtros institucionais** (Coligada, Filial, Nível de Ensino)
- **Filtros acadêmicos** (Curso, Processo Seletivo)
- **Busca textual** em todas as análises
- **Limpeza de filtros** com um clique

### 📊 Visualização de Documentos
- **Modal detalhado** para cada documento
- **Informações do estudante** (CPF, email, telefone, data de nascimento)
- **Dados acadêmicos** (instituição anterior, curso, créditos, CR)
- **Disciplinas do histórico** com código, nome e carga horária
- **Status de integração TOTVS** com detalhes de sincronização
- **Matriz curricular sugerida** pela IA com disciplinas aproveitadas

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.2.3** - Framework React moderno
- **TypeScript** - Tipagem estática e segurança
- **Tailwind CSS** - Framework CSS utilitário
- **React Context** - Gerenciamento de estado global
- **Lucide React** - Ícones modernos e consistentes
- **nuqs** - Gerenciamento de parâmetros de URL

### Backend
- **FastAPI** - Framework Python para APIs
- **Uvicorn** - Servidor ASGI de alta performance
- **Agno** - Framework para agentes de IA
- **OpenAI GPT-4** - Modelos de linguagem avançados
- **SQLite** - Banco de dados para persistência
- **Python-dotenv** - Gerenciamento de variáveis de ambiente

### Integrações
- **OpenAI API** - Acesso aos modelos GPT
- **RAG (Retrieval-Augmented Generation)** - Base de conhecimento inteligente
- **Vector Databases** - Armazenamento de embeddings
- **RESTful APIs** - Comunicação entre serviços
- **Dataset de análises** - Base de dados completa de estudantes

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- Python 3.13+
- npm ou pnpm
- Chave da API OpenAI

### 1. Clone o repositório
```bash
git clone https://github.com/bwasistemas/IAStudent.git
cd IAStudent
```

### 2. Configure as variáveis de ambiente
```bash
# BackEnd/.env
OPENAI_API_KEY=sua_chave_api_aqui
```

### 3. Instale as dependências
```bash
# Frontend
cd FrontEnd/agent-ui
npm install

# Backend
cd ../../BackEnd
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### 4. Execute o projeto
```bash
# Na raiz do projeto
./start.sh
```

O projeto estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:7777

## 👥 Usuários e Acessos

### Administrador
- **Email**: `danilo.pinho@pvtsoftware.com.br`
- **Senha**: `123123`
- **Permissões**: Gestão completa de agentes, configurações do sistema

### Coordenador
- **Email**: `ana.coordenadora@afya.edu.br`
- **Senha**: `123123`
- **Permissões**: Consulta de agentes, análise de documentos, playground

## 🏗️ Arquitetura do Sistema

### Estrutura de Diretórios
```
├── FrontEnd/agent-ui/          # Interface React/Next.js
│   ├── src/
│   │   ├── app/               # Páginas da aplicação
│   │   │   ├── page.tsx      # Página inicial (dashboard)
│   │   │   ├── login/        # Sistema de autenticação
│   │   │   ├── playground/   # Interface de conversa com agentes
│   │   │   └── configuracoes/ # Painel administrativo
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── auth/         # Componentes de autenticação
│   │   │   ├── dashboard/    # Componentes do dashboard
│   │   │   ├── playground/   # Componentes do playground
│   │   │   └── ui/           # Componentes de interface
│   │   ├── contexts/          # Contextos React (Auth, Agents)
│   │   ├── hooks/             # Hooks customizados
│   │   └── types/             # Definições de tipos TypeScript
│   └── public/                # Arquivos estáticos (logos, favicons)
├── BackEnd/                   # API FastAPI
│   ├── main.py               # Servidor principal com agentes
│   ├── database.py           # Gerenciamento de banco SQLite
│   ├── requirements.txt      # Dependências Python
│   └── venv/                 # Ambiente virtual Python
└── start.sh                  # Script de inicialização
```

### Componentes Principais

#### 🔐 AuthContext
- Gerenciamento de autenticação
- Controle de sessões
- Proteção de rotas
- Usuários mock para desenvolvimento

#### 🤖 AgentsContext
- Estado global dos agentes
- Operações CRUD via API
- Sincronização entre componentes
- Gerenciamento de erros e loading

#### 🎛️ ConfiguracoesPage
- Interface administrativa
- Gestão de agentes (CRUD)
- Configuração de parâmetros avançados
- Reset para configurações padrão

#### 🏠 HomePage
- Dashboard principal
- Lista de agentes ativos
- Tabela de análises recentes
- Sistema de filtros avançado
- Contexto institucional fixo

#### 💬 PlaygroundPage
- Interface de conversa com agentes
- Seleção dinâmica de agentes
- Upload e análise de documentos
- Histórico de mensagens
- Integração com ferramentas de IA

## 🎨 Design System

### Cores AFYA
- **Magenta Principal**: `#CE0058`
- **Magenta Hover**: `#B91C5C`
- **Cinza Escuro**: `#232323`
- **Cinza Claro**: `#8E9794`
- **Branco**: `#FFFFFF`

### Componentes UI
- **Botões** com estados hover e disabled
- **Inputs** com validação visual
- **Modais** responsivos e acessíveis
- **Cards** com gradientes e sombras
- **Tipografia** hierárquica e legível
- **Tabelas** com ordenação e filtros
- **Badges** para status e tipos

## 🔧 Configuração de Agentes

### Parâmetros Configuráveis
- **Nome e Descrição** do agente
- **Ícone e Cor** para identificação visual
- **Modelo de IA** (GPT-4o-mini, GPT-4-turbo-preview)
- **Instruções** personalizadas em texto único
- **Base de Conhecimento** (RAG, Vector, Database)
- **Parâmetros de Modelo**:
  - Temperature (0-2)
  - Max Tokens (100-4000)
  - Top P (0-1)
  - Frequency Penalty (-2 a 2)
  - Presence Penalty (-2 a 2)

### Base de Conhecimento
- **RAG**: Retrieval-Augmented Generation
- **Vector**: Bases vetoriais para embeddings
- **Database**: Bases de dados tradicionais
- **Endpoint configurável** para APIs externas
- **Coleções** para organização de documentos

### Ferramentas Integradas
- **Dataset Query**: Consulta ao dataset completo de análises
- **Web Search**: Busca de informações atualizadas na internet
- **Document Analysis**: Análise automática de documentos acadêmicos

## 📱 Responsividade

- **Mobile-first** design
- **Breakpoints** otimizados
- **Componentes adaptativos**
- **Navegação touch-friendly**
- **Tabelas responsivas** com scroll horizontal

## 🔍 Sistema de Filtros

### Filtros Disponíveis
- **Status**: Aprovado, Rejeitado, Pendente
- **Tipo**: Transferência Externa, Portador de Diploma
- **Coligada**: PVT SOFTWARE
- **Filial**: Vila Velha/ES
- **Nível de Ensino**: Graduação
- **Curso**: Filtro por curso específico
- **Processo Seletivo**: Filtro por processo
- **Busca Textual**: Pesquisa em todos os campos

### Funcionalidades
- **Filtros combinados** para busca precisa
- **Limpeza automática** de filtros
- **Persistência** de filtros ativos
- **Contadores** de resultados filtrados

## 📊 Visualização de Documentos

### Informações Exibidas
- **Dados do Documento**: Nome, tipo, data de upload, tamanho
- **Status da IA**: Analisado, Em análise, Pendente, Rejeitado
- **Recomendação da IA**: Feedback detalhado sobre aproveitamento
- **Percentual de Aproveitamento**: Barra de progresso visual
- **Informações do Estudante**: CPF, email, telefone, data de nascimento
- **Dados Acadêmicos**: Instituição anterior, curso, créditos, CR
- **Disciplinas do Histórico**: Código, nome, carga horária, semestre, nota
- **Status TOTVS**: Integrado, Pendente, Erro com detalhes de sincronização
- **Matriz Curricular Sugerida**: Curso sugerido, disciplinas aproveitadas

### Funcionalidades
- **Modal responsivo** com todas as informações
- **Navegação por abas** para organizar conteúdo
- **Botões de ação** para aproveitamento de disciplinas
- **Indicadores visuais** de status e progresso

## 🚀 Deploy

### Build de Produção
```bash
cd FrontEnd/agent-ui
npm run build
npm start
```

### Variáveis de Ambiente de Produção
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://seu-backend.com
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvimento

### Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev          # Frontend em modo desenvolvimento
python main.py       # Backend em modo desenvolvimento

# Build
npm run build        # Build de produção
npm run start        # Servidor de produção

# Linting
npm run lint         # Verificação de código
```

### Estrutura de Commits
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação de código
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de manutenção

## 🔧 Configuração do Banco de Dados

### SQLite (tmp/agents.db)
- **Tabela agents**: Armazenamento de configurações de agentes
- **Auto-incremento** de IDs
- **Timestamps** de criação e atualização
- **Inicialização automática** com agentes padrão
- **Reset para configurações padrão** via interface administrativa

### Estrutura da Tabela
```sql
CREATE TABLE agents (
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
);
```

## 📞 Suporte

Para dúvidas ou suporte técnico:
- **Email**: suporte@pvtsoftware.com.br
- **Issues**: [GitHub Issues](https://github.com/bwasistemas/IAStudent/issues)

---

**Desenvolvido com ❤️ pela equipe PVT Software para AFYA**
