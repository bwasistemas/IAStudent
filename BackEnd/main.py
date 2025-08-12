import os
from dotenv import load_dotenv
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.playground import Playground
from agno.storage.sqlite import SqliteStorage

# Load environment variables
load_dotenv()

agent_storage: str = "tmp/agents.db"

Coordenador = Agent(
    name="Coordenador de Aproveitamento de Estudos",
    model=OpenAIChat(
        id="gpt-4.1-mini",
        api_key=os.getenv("OPENAI_API_KEY")
    ),
    tools=[],
    instructions=[
        "Você é um Coordenador de Curso de Graduação especializado em validar disciplinas para aproveitamento de estudos.",
        "Sua função é analisar documentos acadêmicos de alunos e determinar equivalências entre disciplinas.",
        "Ao receber documentos, você deve:",
        "1. Analisar o conteúdo programático das disciplinas apresentadas",
        "2. Comparar com as disciplinas da matriz curricular do curso",
        "3. Calcular o percentual de equivalência/aproveitamento",
        "4. Indicar quais disciplinas podem ser aproveitadas e o percentual de compatibilidade",
        "5. Justificar suas decisões com base no conteúdo programático e carga horária",
        "Sempre forneça respostas detalhadas e fundamentadas academicamente.",
        "Use sua experiência em coordenação acadêmica para avaliar a qualidade e relevância do conteúdo."
    ],
    # Store the agent sessions in a sqlite database
    storage=SqliteStorage(table_name="coordenador_aproveitamento", db_file=agent_storage),
    # Adds the current date and time to the instructions
    add_datetime_to_instructions=True,
    # Adds the history of the conversation to the messages
    add_history_to_messages=True,
    # Number of history responses to add to the messages
    num_history_responses=5,
    # Adds markdown formatting to the messages
    markdown=True,
)



# Agent especializado em Transferência Externa e Portador de Diploma
TransferenciaExterna = Agent(
    name="Especialista em Transferência Externa e Portador de Diploma",
    model=OpenAIChat(
        id="gpt-4.1-mini",
        api_key=os.getenv("OPENAI_API_KEY")
    ),
    tools=[],
    instructions=[
        "Você é um especialista em processos de Transferência Externa e Portador de Diploma.",
        "Sua especialidade é analisar históricos acadêmicos de outras instituições de ensino superior.",
        "Para cada análise você deve:",
        "1. Verificar a autenticidade e validade dos documentos apresentados",
        "2. Analisar o histórico escolar completo do estudante",
        "3. Identificar disciplinas cursadas com aprovação (nota ≥ 6.0 ou conceito equivalente)",
        "4. Comparar ementa e carga horária com as disciplinas da matriz curricular atual",
        "5. Calcular percentual de equivalência por disciplina (0-100%)",
        "6. Sugerir aproveitamento total, parcial ou não aproveitamento",
        "7. Para Portador de Diploma: verificar se o curso é relacionado à área",
        "Critérios de aproveitamento:",
        "- Conteúdo programático compatível ≥ 75% = Aproveitamento total",
        "- Conteúdo programático compatível 50-74% = Aproveitamento parcial (complementação necessária)",
        "- Conteúdo programático compatível < 50% = Não aproveitamento",
        "- Carga horária mínima: 75% da disciplina equivalente",
        "Sempre apresente resultado em formato de relatório acadêmico detalhado."
    ],
    storage=SqliteStorage(table_name="transferencia_externa", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
)

playground_app = Playground(agents=[Coordenador, TransferenciaExterna])
app = playground_app.get_app()

if __name__ == "__main__":
    playground_app.serve("main:app", reload=True)