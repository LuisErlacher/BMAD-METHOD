---
orchestratorRules: '../data/orchestrator-rules.md'
statusMapping: '../data/status-mapping.md'
workflowsRegistry: '../data/workflows-registry.yaml'
---

# Edit: Modify Configuration

## STEP GOAL:

Permitir modificacao das configuracoes do orquestrador.

## MANDATORY SEQUENCE

### 1. Present Current Configuration

```
OUTPUT: "## Configuracao do Orchestrator"
OUTPUT: ""
OUTPUT: "### Configuracoes Atuais"
OUTPUT: ""
OUTPUT: "| Setting | Valor Atual |"
OUTPUT: "|---------|-------------|"
OUTPUT: "| Max Tentativas de Correcao | 3 |"
OUTPUT: "| Comando de Build | dotnet build |"
OUTPUT: "| Comando de Testes | dotnet test |"
OUTPUT: "| Workflows Registry | workflows.yaml |"
OUTPUT: "| Story Workflow | create-story |"
OUTPUT: "| Dev Workflow | dev-story |"
OUTPUT: "| Review Workflow | code-review |"
OUTPUT: ""
```

### 2. Present Edit Menu

```
OUTPUT: "### O que gostaria de modificar?"
OUTPUT: ""
OUTPUT: "[1] Limite de tentativas de correcao"
OUTPUT: "[2] Comando de build"
OUTPUT: "[3] Comando de testes"
OUTPUT: "[4] Workflows utilizados"
OUTPUT: "[5] Visualizar regras do orquestrador"
OUTPUT: "[6] Visualizar mapeamento de status"
OUTPUT: "[X] Sair"
OUTPUT: ""
OUTPUT: "Selecione uma opcao:"
```

### 3. Handle Selection

```
IF selection == 1:
    OUTPUT: "Limite atual: 3 tentativas"
    OUTPUT: "Novo limite (1-5):"
    CAPTURE: new_limit
    VALIDATE: 1 <= new_limit <= 5
    UPDATE: max_attempts = new_limit
    OUTPUT: "Limite atualizado para {new_limit}"

IF selection == 2:
    OUTPUT: "Comando atual: dotnet build"
    OUTPUT: "Novo comando:"
    CAPTURE: new_command
    UPDATE: buildCommand = new_command
    OUTPUT: "Comando de build atualizado"

IF selection == 3:
    OUTPUT: "Comando atual: dotnet test"
    OUTPUT: "Novo comando:"
    CAPTURE: new_command
    UPDATE: testCommand = new_command
    OUTPUT: "Comando de testes atualizado"

IF selection == 4:
    OUTPUT: "### Workflows Configurados"
    LOAD: {workflowsRegistry}
    OUTPUT: "Workflows disponiveis definidos em: workflows.yaml"
    OUTPUT: "Orquestrador usa: create-story, dev-story, code-review"

IF selection == 5:
    LOAD: {orchestratorRules}
    OUTPUT: {file content}

IF selection == 6:
    LOAD: {statusMapping}
    OUTPUT: {file content}

IF selection == X:
    OUTPUT: "Saindo do modo de edicao."
    STOP

GOTO: Section 2 (redisplay menu)
```

---

## NOTA IMPORTANTE

As configuracoes do orquestrador estao hardcoded nos step files por design.
Para alteracoes permanentes, edite diretamente os arquivos:

- `steps-c/step-03-validation.md` - Comandos de build/test
- `data/orchestrator-rules.md` - Regras de comportamento
- `data/status-mapping.md` - Mapeamento de status

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Current config displayed
- Clear menu options
- Changes captured and confirmed
- Can exit cleanly

### ❌ SYSTEM FAILURE:

- Not showing current values
- Invalid input not handled
- No way to exit
