# 🎓 AFYA - Plataforma de Agentes IA Acadêmicos

Uma plataforma moderna e inteligente para gerenciamento de aproveitamento de estudos, desenvolvida com tecnologias de ponta e integração com agentes de IA especializados.

## 🚀 Funcionalidades Principais

### 🔐 Sistema de Autenticação
- **Login seguro** com diferentes níveis de acesso
- **Perfis de usuário**: Administrador e Coordenador
- **Sessões persistentes** com localStorage
- **Proteção de rotas** para usuários não autenticados

### 🤖 Gestão de Agentes de IA
- **Criação e edição** de agentes especializados
- **Configuração avançada** de parâmetros de IA
- **Base de Conhecimento RAG** integrada
- **Modelos configuráveis** (GPT-4.1-mini, GPT-4-turbo-preview)
- **Ativação/desativação** de agentes

### 📚 Análise de Documentos Acadêmicos
- **Histórico Escolar** - análise automática de disciplinas
- **Ementas de disciplinas** - comparação e validação
- **Cálculo de equivalências** baseado em parâmetros AFYA
- **Sugestões de alocação** de estudantes

### 🎯 Dashboard Inteligente
- **Interface moderna** com design responsivo
- **Contexto institucional** sempre visível
- **Navegação intuitiva** entre funcionalidades
- **Indicadores visuais** de status e progresso

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.2.3** - Framework React moderno
- **TypeScript** - Tipagem estática e segurança
- **Tailwind CSS** - Framework CSS utilitário
- **React Context** - Gerenciamento de estado global
- **Lucide React** - Ícones modernos e consistentes

### Backend
- **FastAPI** - Framework Python para APIs
- **Uvicorn** - Servidor ASGI de alta performance
- **Agno** - Framework para agentes de IA
- **OpenAI GPT-4** - Modelos de linguagem avançados
- **SQLite** - Banco de dados para persistência

### Integrações
- **OpenAI API** - Acesso aos modelos GPT
- **RAG (Retrieval-Augmented Generation)** - Base de conhecimento inteligente
- **Vector Databases** - Armazenamento de embeddings
- **RESTful APIs** - Comunicação entre serviços

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
- **Permissões**: Consulta de agentes, análise de documentos

## 🏗️ Arquitetura do Sistema

### Estrutura de Diretórios
```
├── FrontEnd/agent-ui/          # Interface React/Next.js
│   ├── src/
│   │   ├── app/               # Páginas da aplicação
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── contexts/          # Contextos React (Auth, Agents)
│   │   ├── hooks/             # Hooks customizados
│   │   └── types/             # Definições de tipos TypeScript
│   └── public/                # Arquivos estáticos
├── BackEnd/                   # API FastAPI
│   ├── main.py               # Servidor principal
│   ├── requirements.txt      # Dependências Python
│   └── venv/                 # Ambiente virtual Python
└── start.sh                  # Script de inicialização
```

### Componentes Principais

#### 🔐 AuthContext
- Gerenciamento de autenticação
- Controle de sessões
- Proteção de rotas

#### 🤖 AgentsContext
- Estado global dos agentes
- Operações CRUD
- Sincronização entre componentes

#### 🎛️ ConfiguracoesPage
- Interface administrativa
- Gestão de agentes
- Configuração de parâmetros

#### 🏠 HomePage
- Dashboard principal
- Lista de agentes ativos
- Navegação do sistema

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

## 🔧 Configuração de Agentes

### Parâmetros Configuráveis
- **Nome e Descrição** do agente
- **Ícone e Cor** para identificação visual
- **Modelo de IA** (GPT-4.1-mini, GPT-4-turbo-preview)
- **Instruções** personalizadas
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

## 📱 Responsividade

- **Mobile-first** design
- **Breakpoints** otimizados
- **Componentes adaptativos**
- **Navegação touch-friendly**

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

## 📞 Suporte

Para dúvidas ou suporte técnico:
- **Email**: suporte@pvtsoftware.com.br
- **Issues**: [GitHub Issues](https://github.com/bwasistemas/IAStudent/issues)

---

**Desenvolvido com ❤️ pela equipe PVT Software para AFYA**
