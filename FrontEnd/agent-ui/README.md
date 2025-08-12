# AFYA - Sistema de Aproveitamento de Estudos

Sistema completo de análise e aproveitamento de disciplinas acadêmicas com interface moderna e agentes de IA especializados. Desenvolvido para facilitar o processo de transferência e análise curricular de estudantes.

## ✨ Funcionalidades Principais

### 🏠 Dashboard Inteligente
- **Interface Moderna**: Design clean e responsivo com componentes otimizados
- **Agentes Especializados**: 3 agentes IA com diferentes especialidades:
  - 👨‍🏫 **Coordenador**: Especialista em coordenação acadêmica
  - 🔍 **Analisador**: Focado em análise de documentos acadêmicos  
  - 🎓 **Especialista**: Expert em regras e procedimentos acadêmicos
- **Filtros Inteligentes**: Sistema de filtros por processo seletivo, status e período
- **Visualização de Documentos**: Preview inteligente com opção "Ver mais"
- **Tabela Interativa**: Interface otimizada para análise de dados acadêmicos

### 🤖 Sistema de Agentes IA
- **Backend Python**: Integração com SQLite para gestão de agentes
- **Configuração Flexível**: Parâmetros customizáveis para cada agente
- **Knowledge Base**: Sistema RAG integrado para consultas contextuais
- **Modelos LLM**: Suporte a diferentes modelos (GPT-4o-mini configurado)

### 📊 Análise Acadêmica
- **Processamento de Histórico**: Análise automatizada de históricos escolares
- **Comparação Curricular**: Matching inteligente entre disciplinas
- **Relatórios Detalhados**: Feedback completo sobre aproveitamento
- **Integração TOTVS**: Conectividade com sistemas acadêmicos

## 🚀 Getting Started

### Pré-requisitos
- Node.js 18+ 
- Python 3.8+
- npm ou pnpm

### Instalação e Configuração

#### 1. Frontend (Next.js)
```bash
cd FrontEnd/agent-ui
npm install
npm run dev
```

#### 2. Backend (Python)
```bash
cd BackEnd
pip install -r requirements.txt
python main.py
```

#### 3. Acessar o Sistema
- **Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Playground**: [http://localhost:3000/playground](http://localhost:3000/playground)
- **API Backend**: [http://localhost:7777](http://localhost:7777)

## 🔧 Configuração dos Agentes

O sistema vem com 3 agentes pré-configurados:

### Coordenador 👨‍🏫
- **Função**: Coordenação acadêmica e análise geral
- **Modelo**: GPT-4o-mini
- **Temperatura**: 0.7
- **Especialidade**: Visão geral e coordenação de processos

### Analisador 🔍  
- **Função**: Análise detalhada de documentos
- **Modelo**: GPT-4o-mini
- **Temperatura**: 0.5 (mais preciso)
- **Especialidade**: Interpretação de históricos e ementas

### Especialista 🎓
- **Função**: Regras acadêmicas e procedimentos
- **Modelo**: GPT-4o-mini
- **Temperatura**: 0.6
- **Especialidade**: Normas institucionais e aproveitamento

## 📋 Melhorias Implementadas

### Interface do Dashboard
- ✅ Removido ícone de robô, adicionado ícone Brain elegante
- ✅ Layout de agentes redesenhado (vertical, mais limpo)  
- ✅ Filtros otimizados (apenas "Processo Seletivo")
- ✅ Visualização de documentos melhorada com "Ver mais"
- ✅ Botão "Ver detalhes" corrigido para roteamento adequado
- ✅ Ícones reduzidos para elementos essenciais
- ✅ Gradientes e animações sutis adicionadas

### Sistema Backend
- ✅ Banco SQLite configurado para gestão de agentes
- ✅ API REST completa para CRUD de agentes
- ✅ Sistema de parâmetros configuráveis
- ✅ Knowledge Base RAG integrada
- ✅ Reset para configurações padrão

## 🎯 Próximos Passos

1. **Playground Aprimorado**: Interface de chat mais intuitiva
2. **Integração LLM**: Comunicação direta com modelos
3. **Upload de Documentos**: Sistema de análise em tempo real
4. **Relatórios Avançados**: Dashboards analíticos detalhados

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the [MIT License](./LICENSE).
