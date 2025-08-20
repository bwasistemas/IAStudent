import React from 'react'
import { 
  User,
  Eye,
  GraduationCap,
  Brain,
  Book,
  BarChart,
  Briefcase,
  Target,
  Wrench,
  ClipboardCheck,
  Lightbulb,
  Building,
  Users,
  Settings,
  FileText
} from 'lucide-react'

/**
 * Utilitário para mapear ícones de agentes para componentes React
 * Centraliza a lógica de mapeamento para evitar duplicação
 */

// Mapeamento de ícones emoji e strings para componentes React
const iconMap: Record<string, React.ReactNode> = {
  // Emojis
  '👨‍🏫': <User className="w-8 h-8 text-white" />,
  '🔍': <Eye className="w-8 h-8 text-white" />,
  '🎓': <GraduationCap className="w-8 h-8 text-white" />,
  '🤖': <Brain className="w-8 h-8 text-white" />,
  '📚': <Book className="w-8 h-8 text-white" />,
  '📊': <BarChart className="w-8 h-8 text-white" />,
  '💼': <Briefcase className="w-8 h-8 text-white" />,
  '⚙️': <Settings className="w-8 h-8 text-white" />,
  '📝': <FileText className="w-8 h-8 text-white" />,
  '🎯': <Target className="w-8 h-8 text-white" />,
  '🔧': <Wrench className="w-8 h-8 text-white" />,
  '📋': <ClipboardCheck className="w-8 h-8 text-white" />,
  '💡': <Lightbulb className="w-8 h-8 text-white" />,
  '🏫': <Building className="w-8 h-8 text-white" />,
  '👥': <Users className="w-8 h-8 text-white" />,
  
  // Strings de identificação
  'graduation-cap': <GraduationCap className="w-8 h-8 text-white" />,
  'user': <User className="w-8 h-8 text-white" />,
  'eye': <Eye className="w-8 h-8 text-white" />,
  'brain': <Brain className="w-8 h-8 text-white" />,
  'book': <Book className="w-8 h-8 text-white" />,
  'chart': <BarChart className="w-8 h-8 text-white" />,
  'briefcase': <Briefcase className="w-8 h-8 text-white" />,
  'settings': <Settings className="w-8 h-8 text-white" />,
  'file': <FileText className="w-8 h-8 text-white" />,
  'target': <Target className="w-8 h-8 text-white" />,
  'tool': <Wrench className="w-8 h-8 text-white" />,
  'clipboard': <ClipboardCheck className="w-8 h-8 text-white" />,
  'lightbulb': <Lightbulb className="w-8 h-8 text-white" />,
  'building': <Building className="w-8 h-8 text-white" />,
  'users': <Users className="w-8 h-8 text-white" />
}

/**
 * Renderiza o ícone de um agente baseado no valor fornecido
 * @param iconValue - O valor do ícone (emoji, string ou outro)
 * @param agentName - Nome do agente (opcional, para debug)
 * @param size - Tamanho personalizado (padrão: w-8 h-8)
 * @returns JSX Element representando o ícone
 */
export function renderAgentIcon(
  iconValue: string | undefined, 
  agentName?: string, 
  size: string = 'w-8 h-8'
): React.ReactNode {
  // Debug sempre ativo (forçado)
  console.log(`🎨 Renderizando ícone para ${agentName || 'Sem nome'}: "${iconValue}"`);
  console.log(`🎨 Tamanho solicitado: ${size}`);
  console.log(`🎨 Existe mapeamento para "${iconValue}"?`, !!iconMap[iconValue || '']);
  
  // Se não há ícone, usar Brain como padrão
  if (!iconValue) {
    return <Brain className={`${size} text-white`} />;
  }
  
  // Se existe mapeamento, usar ele
  if (iconMap[iconValue]) {
    // Ajustar o tamanho se necessário
    if (size !== 'w-8 h-8') {
      const IconComponent = iconMap[iconValue];
      return React.cloneElement(IconComponent as React.ReactElement, {
        className: `${size} text-white`
      });
    }
    return iconMap[iconValue];
  }
  
  // Se for emoji ou texto simples, exibir diretamente
  if (!iconValue.startsWith('<')) {
    const fontSize = size.includes('w-4') ? 'text-base' : 
                    size.includes('w-6') ? 'text-lg' : 
                    size.includes('w-10') ? 'text-3xl' : 'text-2xl';
    
    return <span className={`${fontSize} text-white leading-none`}>{iconValue}</span>;
  }
  
  // Fallback para ícone padrão
  return <Brain className={`${size} text-white`} />;
}

/**
 * Retorna a lista de ícones disponíveis para seleção
 * @returns Array de objetos com valor e label para cada ícone
 */
export function getAvailableIcons() {
  return [
    { value: '👨‍🏫', label: 'Professor', emoji: '👨‍🏫' },
    { value: '🔍', label: 'Analisador', emoji: '🔍' },
    { value: '🎓', label: 'Acadêmico', emoji: '🎓' },
    { value: '🤖', label: 'IA/Bot', emoji: '🤖' },
    { value: '📚', label: 'Conhecimento', emoji: '📚' },
    { value: '📊', label: 'Análise', emoji: '📊' },
    { value: '💼', label: 'Profissional', emoji: '💼' },
    { value: '⚙️', label: 'Configuração', emoji: '⚙️' },
    { value: '📝', label: 'Documentos', emoji: '📝' },
    { value: '🎯', label: 'Objetivo', emoji: '🎯' },
    { value: '🔧', label: 'Ferramentas', emoji: '🔧' },
    { value: '📋', label: 'Checklist', emoji: '📋' },
    { value: '💡', label: 'Ideias', emoji: '💡' },
    { value: '🏫', label: 'Instituição', emoji: '🏫' },
    { value: '👥', label: 'Equipe', emoji: '👥' }
  ];
}

export default { renderAgentIcon, getAvailableIcons };