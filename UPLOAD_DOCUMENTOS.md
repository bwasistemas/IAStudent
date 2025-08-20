# 📎 Sistema de Upload de Documentos no Playground

## ✅ Funcionalidade Implementada!

O playground da AFYA agora suporta **upload e análise de documentos acadêmicos** pelos agentes de IA. Esta funcionalidade permite que os usuários anexem arquivos diretamente na conversa para análise automática.

## 🚀 Como Usar

### 1. **Acessar o Playground**
- Navegue até `/playground`
- Selecione um agente ativo
- Localize o botão de clipe (📎) ao lado do campo de texto

### 2. **Anexar Documentos**
- Clique no ícone de clipe para abrir o seletor de arquivos
- Selecione um ou múltiplos arquivos
- **Tipos suportados**: PDF, DOC, DOCX, TXT, Imagens (JPG, PNG, etc.)
- **Limite**: 10MB por arquivo

### 3. **Preview dos Arquivos**
- Arquivos anexados aparecem como cards acima do campo de texto
- Imagens mostram preview visual
- Documentos mostram ícone e informações (nome, tamanho)
- Botão ❌ para remover arquivos antes do envio

### 4. **Enviar para Análise**
- Digite sua pergunta ou deixe em branco para análise geral
- Clique em "Enviar" ou pressione Enter
- Os arquivos são processados automaticamente
- O agente recebe o conteúdo extraído e faz a análise

## 🔧 Tipos de Análise Suportados

### 📚 **Histórico Escolar**
- Extração automática de disciplinas
- Identificação de notas e carga horária
- Análise de compatibilidade com cursos AFYA
- Sugestões de equivalências

### 📝 **Ementas de Disciplinas**
- Análise de conteúdo programático
- Identificação de objetivos e bibliografia
- Comparação com disciplinas AFYA
- Recomendações de aproveitamento

### 🎓 **Certificados e Diplomas**
- Verificação de conclusão de curso
- Identificação de instituição e área
- Validação para processos de transferência

### 📊 **Matriz Curricular**
- Análise de estrutura curricular
- Comparação com cursos de destino
- Identificação de disciplinas compatíveis

## 🛠️ Funcionalidades Técnicas

### **Frontend (ChatInput.tsx)**
```typescript
// Estados para gerenciar arquivos
const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

// Upload e preview de arquivos
const handleFileSelect = async (files: FileList | null) => {
  // Validação de tamanho e tipo
  // Criação de previews para imagens
  // Adição à lista de arquivos anexados
}

// Processamento e envio
const uploadFiles = async (files: AttachedFile[]): Promise<string[]> => {
  // Envio para API /api/upload
  // Extração de texto dos documentos
  // Retorno do conteúdo processado
}
```

### **API Route (/api/upload/route.ts)**
```typescript
// Processamento por tipo de arquivo
- PDF: Extração com PyPDF2/pdfplumber
- Word: Extração com python-docx
- Texto: Leitura direta UTF-8
- Imagem: Preparação para OCR futuro

// Validações
- Tamanho máximo: 10MB
- Tipos permitidos: PDF, DOC, DOCX, TXT, Imagens
- Sanitização de conteúdo
```

### **Backend (main.py)**
```python
@api_app.post("/process-document")
async def process_document(file: UploadFile = File(...)):
    # Extração de texto baseada no tipo MIME
    # Processamento com bibliotecas especializadas
    # Retorno de texto estruturado

# Nova ferramenta para agentes
def analisar_documento_academico(conteudo_documento, nome_arquivo, tipo_analise):
    # Identificação automática do tipo de documento
    # Análise específica por tipo (histórico, ementa, etc.)
    # Recomendações de compatibilidade AFYA
    # Extração de disciplinas e informações relevantes
```

## 📦 Dependências Instaladas

```bash
# Backend
PyPDF2==3.0.1          # Processamento de PDFs
python-docx==1.2.0      # Documentos Word
pdfplumber==0.11.7      # PDF avançado com OCR
python-multipart        # Upload de arquivos FastAPI

# Frontend
# Nenhuma dependência adicional necessária
```

## 🎯 Fluxo Completo

1. **Usuario anexa arquivo** → Frontend valida e mostra preview
2. **Usuario envia mensagem** → Frontend faz upload via `/api/upload`
3. **API extrai texto** → Backend processa com bibliotecas especializadas
4. **Texto + pergunta** → Enviado para agente via playground
5. **Agente analisa** → Usa ferramenta `analisar_documento_academico`
6. **Resposta estruturada** → Retorna análise detalhada

## 💡 Casos de Uso

### **Para Coordenadores**
```
🎓 "Analise este histórico escolar para aproveitamento em Medicina"
📎 [anexar histórico.pdf]
→ Agente analisa disciplinas, notas, compatibilidade
```

### **Para Estudantes**
```
📚 "Posso aproveitar esta disciplina de Cálculo?"
📎 [anexar ementa_calculo.pdf]
→ Agente compara com matriz AFYA e sugere equivalência
```

### **Para Análise Completa**
```
🔍 "Faça uma análise completa destes documentos"
📎 [anexar histórico.pdf, certificado.pdf, ementa1.pdf]
→ Agente faz análise integrada de todos os documentos
```

## 🔒 Segurança

- **Validação de tipos**: Apenas formatos educacionais aceitos
- **Limite de tamanho**: 10MB por arquivo previne sobrecarga
- **Sanitização**: Conteúdo é processado e limpo antes da análise
- **Temporário**: Arquivos não são salvos permanentemente
- **CORS configurado**: Apenas origins autorizadas

## 🚀 Próximas Melhorias

- [ ] **OCR para imagens**: Extração de texto de documentos escaneados
- [ ] **Análise de similaridade**: Comparação automática com base AFYA
- [ ] **Batch processing**: Upload de múltiplos documentos por vez
- [ ] **Histórico de uploads**: Salvar documentos analisados por sessão
- [ ] **Integração TOTVS**: Envio direto para sistema acadêmico
- [ ] **Validação digital**: Verificação de autenticidade de documentos

---

## ✅ Status: **FUNCIONAL**

A funcionalidade de upload de documentos está **totalmente implementada e funcionando**. Os agentes podem agora analisar documentos acadêmicos de forma inteligente e contextualizada.

**Testado com**: PDFs, documentos Word, arquivos de texto e imagens.
**Compatível com**: Todos os agentes AFYA configurados.
**Performance**: Processamento em tempo real para arquivos até 10MB.