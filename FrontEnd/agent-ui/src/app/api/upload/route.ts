import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Verificar tamanho do arquivo
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 10MB permitido.' },
        { status: 400 }
      )
    }

    // Ler o conteúdo do arquivo
    const buffer = await file.arrayBuffer()
    const fileContent = Buffer.from(buffer)

    let extractedText = ''

    try {
      // Processar diferentes tipos de arquivo
      if (file.type === 'application/pdf') {
        // Para PDFs, enviar para o backend para extração de texto
        extractedText = await extractPDFText(fileContent, file.name)
      } else if (file.type.startsWith('image/')) {
        // Para imagens, pode usar OCR ou descrição de imagem
        extractedText = await processImage(fileContent, file.name)
      } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
        // Para arquivos de texto
        extractedText = fileContent.toString('utf-8')
      } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        // Para documentos Word, enviar para o backend
        extractedText = await extractDocumentText(fileContent, file.name)
      } else {
        return NextResponse.json(
          { error: 'Tipo de arquivo não suportado' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        filename: file.name,
        type: type,
        size: file.size,
        text: extractedText,
        message: 'Arquivo processado com sucesso'
      })

    } catch (processingError) {
      console.error('Erro ao processar arquivo:', processingError)
      return NextResponse.json(
        { error: `Erro ao processar o arquivo: ${processingError}` },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para extrair texto de PDF
async function extractPDFText(fileContent: Buffer, filename: string): Promise<string> {
  try {
    // Enviar para o backend para processamento
    const formData = new FormData()
    const blob = new Blob([fileContent], { type: 'application/pdf' })
    formData.append('file', blob, filename)

    const response = await fetch('http://localhost:7777/api/process-document', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Erro do backend: ${response.statusText}`)
    }

    const result = await response.json()
    return result.text || 'Não foi possível extrair texto do PDF'

  } catch (error) {
    console.error('Erro ao processar PDF:', error)
    // Fallback: retornar informações básicas do arquivo
    return `**Arquivo PDF:** ${filename}\n**Tamanho:** ${(fileContent.length / 1024 / 1024).toFixed(2)} MB\n**Nota:** Não foi possível extrair o texto automaticamente. Por favor, descreva o conteúdo do documento.`
  }
}

// Função para processar imagens
async function processImage(fileContent: Buffer, filename: string): Promise<string> {
  try {
    // Para imagens, pode implementar OCR ou análise de imagem no futuro
    // Por agora, retornar informações básicas
    const base64 = fileContent.toString('base64')
    return `**Imagem anexada:** ${filename}\n**Tamanho:** ${(fileContent.length / 1024 / 1024).toFixed(2)} MB\n**Formato:** Imagem\n**Nota:** Imagem carregada com sucesso. Você pode pedir para o agente analisar ou descrever a imagem.`
  } catch (error) {
    console.error('Erro ao processar imagem:', error)
    return `**Imagem:** ${filename} - Erro ao processar`
  }
}

// Função para extrair texto de documentos Word
async function extractDocumentText(fileContent: Buffer, filename: string): Promise<string> {
  try {
    // Enviar para o backend para processamento
    const formData = new FormData()
    const blob = new Blob([fileContent], { 
      type: filename.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/msword'
    })
    formData.append('file', blob, filename)

    const response = await fetch('http://localhost:7777/api/process-document', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Erro do backend: ${response.statusText}`)
    }

    const result = await response.json()
    return result.text || 'Não foi possível extrair texto do documento'

  } catch (error) {
    console.error('Erro ao processar documento:', error)
    // Fallback: retornar informações básicas do arquivo
    return `**Documento Word:** ${filename}\n**Tamanho:** ${(fileContent.length / 1024 / 1024).toFixed(2)} MB\n**Nota:** Não foi possível extrair o texto automaticamente. Por favor, descreva o conteúdo do documento.`
  }
}