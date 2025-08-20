#!/usr/bin/env python3

"""
Teste de integração DIFY
Testa a conectividade e resposta da API DIFY
"""

import requests
import json

def test_dify_connection():
    """Testa a conexão com a API DIFY"""
    
    api_key = "app-AbEffSO5R4mJSj7EYk15jpUE"
    base_url = "http://192.168.1.184/v1"
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'inputs': {},
        'query': 'Quais são as normas de aproveitamento de disciplinas na AFYA?',
        'response_mode': 'blocking',
        'conversation_id': '',
        'user': 'test-afya-agent'
    }
    
    try:
        print("🔗 Testando conexão com DIFY...")
        print(f"URL: {base_url}/chat-messages")
        print(f"API Key: {api_key[:15]}...")
        
        response = requests.post(
            f"{base_url}/chat-messages",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Conexão estabelecida com sucesso!")
            print("📄 Resposta DIFY:")
            
            if 'answer' in data:
                print(f"💬 {data['answer']}")
            elif 'data' in data and 'answer' in data['data']:
                print(f"💬 {data['data']['answer']}")
            else:
                print(f"📋 Resposta completa: {json.dumps(data, indent=2)}")
                
            return True
        else:
            print(f"❌ Erro na conexão: {response.status_code}")
            print(f"📝 Detalhes: {response.text}")
            return False
            
    except requests.RequestException as e:
        print(f"🚫 Erro de rede: {str(e)}")
        return False
    except Exception as e:
        print(f"⚠️ Erro inesperado: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Teste de Integração DIFY - AFYA")
    print("=" * 50)
    
    success = test_dify_connection()
    
    if success:
        print("\n🎉 Teste concluído com sucesso!")
        print("✨ A integração DIFY está funcionando corretamente.")
    else:
        print("\n💥 Teste falhou!")
        print("🔧 Verifique a configuração da API DIFY.")