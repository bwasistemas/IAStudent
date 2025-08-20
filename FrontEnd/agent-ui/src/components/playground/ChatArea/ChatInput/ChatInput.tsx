'use client'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { TextArea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { usePlaygroundStore } from '@/store'
import useAIChatStreamHandler from '@/hooks/useAIStreamHandler'
import { useQueryState } from 'nuqs'
import Icon from '@/components/ui/icon'
import { Paperclip, X, FileText, Image, File } from 'lucide-react'

interface AttachedFile {
  id: string
  file: File
  preview?: string
  type: 'document' | 'image' | 'other'
}

const ChatInput = () => {
  const { chatInputRef } = usePlaygroundStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { handleStreamResponse } = useAIChatStreamHandler()
  const [selectedAgent] = useQueryState('agent')
  const [inputMessage, setInputMessage] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const isStreaming = usePlaygroundStore((state) => state.isStreaming)

  // Função para determinar o tipo de arquivo
  const getFileType = (file: File): 'document' | 'image' | 'other' => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type === 'application/pdf' || 
        file.type.includes('document') || 
        file.type.includes('text') ||
        file.name.endsWith('.pdf') ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx') ||
        file.name.endsWith('.txt')) {
      return 'document'
    }
    return 'other'
  }

  // Função para lidar com seleção de arquivos
  const handleFileSelect = async (files: FileList | null) => {
    console.log('📁 handleFileSelect chamado com:', files)
    if (!files) {
      console.log('❌ Nenhum arquivo selecionado')
      return
    }

    console.log(`📁 ${files.length} arquivo(s) selecionado(s)`)
    const newFiles: AttachedFile[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`📄 Arquivo ${i + 1}: ${file.name} (${file.size} bytes, ${file.type})`)
      
      // Verificar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Arquivo ${file.name} é muito grande. Máximo 10MB permitido.`)
        continue
      }

      const fileType = getFileType(file)
      let preview: string | undefined

      // Criar preview para imagens
      if (fileType === 'image') {
        preview = URL.createObjectURL(file)
      }

      const attachedFile = {
        id: `${Date.now()}-${i}`,
        file,
        preview,
        type: fileType
      }
      
      console.log(`✅ Arquivo processado:`, attachedFile)
      newFiles.push(attachedFile)
    }

    console.log(`📎 Adicionando ${newFiles.length} arquivo(s) à lista`)
    setAttachedFiles(prev => {
      const updated = [...prev, ...newFiles]
      console.log('📎 Lista atualizada de arquivos:', updated)
      return updated
    })
  }

  // Função para remover arquivo
  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  // Função para upload de arquivos
  const uploadFiles = async (files: AttachedFile[]): Promise<string[]> => {
    const uploadedUrls: string[] = []
    
    for (const attachedFile of files) {
      const formData = new FormData()
      formData.append('file', attachedFile.file)
      formData.append('type', attachedFile.type)

      try {
        console.log(`🔄 Processando arquivo: ${attachedFile.file.name} (${attachedFile.file.type})`)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        console.log(`📡 Resposta do upload: ${response.status}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`❌ Erro na resposta: ${errorText}`)
          throw new Error(`Erro ao fazer upload de ${attachedFile.file.name}: ${response.status}`)
        }

        const result = await response.json()
        console.log(`✅ Resultado do processamento:`, result)
        
        uploadedUrls.push(result.text || result.url || `Arquivo processado: ${attachedFile.file.name}`)
      } catch (error) {
        console.error(`❌ Erro ao processar ${attachedFile.file.name}:`, error)
        toast.error(`Erro ao processar ${attachedFile.file.name}: ${error}`)
        throw error
      }
    }

    return uploadedUrls
  }

  const handleSubmit = async () => {
    console.log('🚀 handleSubmit iniciado')
    console.log('📝 inputMessage:', `"${inputMessage}"`)
    console.log('📎 attachedFiles:', attachedFiles)
    console.log('📊 attachedFiles.length:', attachedFiles.length)
    
    // Verificar se há conteúdo para enviar
    const hasMessage = inputMessage.trim().length > 0
    const hasFiles = attachedFiles.length > 0
    
    console.log('✅ hasMessage:', hasMessage)
    console.log('✅ hasFiles:', hasFiles)
    
    if (!hasMessage && !hasFiles) {
      console.log('❌ Retornando: sem mensagem e sem arquivos')
      return
    }
    
    console.log('✅ Prosseguindo com o envio...')

    const currentMessage = inputMessage
    const currentFiles = [...attachedFiles]
    
    console.log('💾 currentFiles:', currentFiles)
    
    setInputMessage('')
    setAttachedFiles([])

    try {
      let messageWithFiles = currentMessage

      // Se há arquivos anexados, fazer upload e incluir no contexto
      if (currentFiles.length > 0) {
        console.log('📎 Processando arquivos anexados:', currentFiles.length)
        toast.info('Processando arquivos anexados...')
        const uploadedTexts = await uploadFiles(currentFiles)
        console.log('✅ Upload concluído, textos extraídos:', uploadedTexts)
        
        // Se não há mensagem do usuário, criar uma mensagem padrão
        let userMessage = currentMessage.trim()
        if (!userMessage) {
          userMessage = `Por favor, analise o(s) documento(s) anexado(s) e forneça uma análise detalhada.`
        }
        
        // Montar mensagem com instruções claras para o agente
        let fileInfo = '\n\n📎 **DOCUMENTOS ANEXADOS PARA ANÁLISE:**\n\n'
        
        currentFiles.forEach((file, index) => {
          fileInfo += `📄 **Documento ${index + 1}: ${file.file.name}**\n`
          fileInfo += `Tipo: ${file.type}\n`
          fileInfo += `Tamanho: ${(file.file.size / 1024 / 1024).toFixed(2)} MB\n\n`
          
          if (uploadedTexts[index]) {
            fileInfo += `**CONTEÚDO EXTRAÍDO:**\n${uploadedTexts[index]}\n\n`
          }
          
          fileInfo += '---\n\n'
        })
        
        fileInfo += '🤖 **INSTRUÇÃO PARA O AGENTE:** Use a ferramenta "analisar_documento_academico" para analisar cada documento enviado acima. Forneça uma análise detalhada do conteúdo extraído.\n\n'
        
        // Combinar mensagem do usuário com informações dos documentos
        messageWithFiles = userMessage + fileInfo
        
        console.log('📝 Mensagem completa a ser enviada:', messageWithFiles)
      }

      console.log('🚀 Chamando handleStreamResponse com:', messageWithFiles)
      await handleStreamResponse(messageWithFiles)
      
      // Limpar previews
      currentFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
      
    } catch (error) {
      toast.error(
        `Error in handleSubmit: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
      // Restaurar arquivos em caso de erro
      setAttachedFiles(currentFiles)
    }
  }

  return (
    <div className="relative mx-auto mb-1 w-full max-w-2xl font-geist">
      {/* Preview de arquivos anexados */}
      {attachedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachedFiles.map((file) => (
            <div
              key={file.id}
              className="relative flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 pr-8"
            >
              {/* Ícone do tipo de arquivo */}
              {file.type === 'image' ? (
                <Image className="h-4 w-4 text-blue-500" />
              ) : file.type === 'document' ? (
                <FileText className="h-4 w-4 text-green-500" />
              ) : (
                <File className="h-4 w-4 text-gray-500" />
              )}
              
              {/* Preview da imagem ou nome do arquivo */}
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="h-8 w-8 rounded object-cover"
                />
              ) : null}
              
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                  {file.file.name}
                </span>
                <span className="text-xs text-gray-500">
                  {(file.file.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
              
              {/* Botão remover */}
              <button
                onClick={() => removeFile(file.id)}
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <X className="h-2 w-2" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input de texto e botões */}
      <div className="flex items-end justify-center gap-x-2">
        {/* Input de arquivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => {
            console.log('🔄 onChange do input disparado:', e.target.files)
            handleFileSelect(e.target.files)
          }}
          className="hidden"
        />
        
        {/* Botão de anexar */}
        <Button
          onClick={() => {
            console.log('📎 Botão de anexar clicado')
            console.log('📂 fileInputRef.current:', fileInputRef.current)
            fileInputRef.current?.click()
          }}
          disabled={!selectedAgent || isStreaming}
          size="icon"
          variant="outline"
          className="rounded-xl border-accent bg-primaryAccent p-2 text-primary hover:bg-accent"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* TextArea */}
        <TextArea
          placeholder={attachedFiles.length > 0 ? 'Descreva o que você quer analisar nos arquivos...' : 'Ask anything'}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.nativeEvent.isComposing &&
              !e.shiftKey &&
              !isStreaming
            ) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          className="w-full border border-accent bg-primaryAccent px-4 text-sm text-primary focus:border-accent"
          disabled={!selectedAgent}
          ref={chatInputRef}
        />
        
        {/* Botão enviar - FORÇADO HTML PURO */}
        <button
          onClick={() => {
            console.log('🔘 Botão enviar clicado')
            console.log('🔘 selectedAgent:', selectedAgent)
            console.log('🔘 inputMessage.trim():', `"${inputMessage.trim()}"`)
            console.log('🔘 attachedFiles.length:', attachedFiles.length)
            console.log('🔘 isStreaming:', isStreaming)
            const isDisabled = !selectedAgent || (!inputMessage.trim() && attachedFiles.length === 0) || isStreaming
            console.log('🔘 Botão está desabilitado?', isDisabled)
            console.log('🔘 Forçando envio mesmo se desabilitado...')
            handleSubmit()
          }}
          className="rounded-xl bg-blue-500 p-3 text-white hover:bg-blue-600 cursor-pointer"
          style={{
            minWidth: '40px',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 1,
            pointerEvents: 'auto',
            border: 'none'
          }}
        >
          ▶️ ENVIAR
        </button>
      </div>
    </div>
  )
}

export default ChatInput
