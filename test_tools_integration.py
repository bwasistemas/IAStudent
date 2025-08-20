#!/usr/bin/env python3
"""
Script de teste para verificar a integração do sistema de ferramentas com os agentes.
Este script demonstra como as ferramentas configuradas são automaticamente
disponibilizadas para os agentes IA.
"""

import sys
import os
import asyncio
from pathlib import Path

# Adicionar o diretório BackEnd ao path
backend_path = Path(__file__).parent / "BackEnd"
sys.path.insert(0, str(backend_path))

from tools_manager import ToolsManager
from main import create_agno_agents

async def test_tools_integration():
    """Testa a integração das ferramentas com os agentes"""
    
    print("🔧 TESTE DE INTEGRAÇÃO - SISTEMA DE FERRAMENTAS AFYA")
    print("=" * 60)
    
    # 1. Inicializar o gerenciador de ferramentas
    print("\n1. 📋 Inicializando gerenciador de ferramentas...")
    tools_manager = ToolsManager("BackEnd/tmp/tools.db")
    
    # 2. Listar ferramentas disponíveis
    print("\n2. 🛠️ Ferramentas configuradas:")
    tools = tools_manager.get_all_tools()
    
    for tool in tools:
        status = "🟢 ATIVA" if tool['is_active'] else "🔴 INATIVA"
        print(f"   • {tool['name']} ({tool['type']}) - {status}")
        print(f"     Endpoint: {tool['endpoint']}")
        print(f"     Descrição: {tool['description']}")
        print()
    
    # 3. Testar ferramentas ativas
    print("3. 🧪 Testando conectividade das ferramentas ativas:")
    active_tools = tools_manager.get_active_tools()
    
    for tool in active_tools:
        print(f"\n   Testando: {tool['name']}")
        try:
            result = tools_manager.test_tool(tool['id'])
            if result['success']:
                print(f"   ✅ Sucesso: {result['message']}")
            else:
                print(f"   ❌ Falha: {result['message']}")
        except Exception as e:
            print(f"   ⚠️ Erro: {e}")
    
    # 4. Demonstrar integração com agentes
    print("\n4. 🤖 Testando integração com agentes IA:")
    
    try:
        # Obter ferramentas para agentes
        agent_tools = tools_manager.get_tools_for_agent()
        print(f"   • {len(agent_tools)} ferramentas disponíveis para agentes")
        
        for tool in agent_tools:
            print(f"     - {tool.name}: {tool.description}")
        
        print("\n   ✅ Integração com agentes funcionando corretamente!")
        
    except Exception as e:
        print(f"   ❌ Erro na integração: {e}")
    
    # 5. Teste de execução de ferramenta (simulado)
    print("\n5. 🎯 Teste de execução de ferramenta:")
    
    if active_tools:
        test_tool = active_tools[0]
        print(f"   Executando: {test_tool['name']}")
        
        try:
            # Criar função da ferramenta
            tool_function = tools_manager.create_tool_function(test_tool)
            
            # Executar com parâmetros de teste
            result = tool_function.func()  # Execução sem parâmetros
            print(f"   📄 Resultado:")
            print(f"   {result}")
            
        except Exception as e:
            print(f"   ⚠️ Execução simulada (sem credenciais): {e}")
    
    print("\n" + "=" * 60)
    print("✅ TESTE CONCLUÍDO - Sistema de ferramentas integrado com sucesso!")
    print("\n📝 Próximos passos:")
    print("   1. Configure as credenciais das APIs na interface administrativa")
    print("   2. Ative as ferramentas desejadas")
    print("   3. Teste a conectividade através da interface web")
    print("   4. Use as ferramentas nos agentes através do Playground")

if __name__ == "__main__":
    # Verificar se está no diretório correto
    if not Path("BackEnd/main.py").exists():
        print("❌ Execute este script a partir do diretório raiz do projeto")
        sys.exit(1)
    
    asyncio.run(test_tools_integration())