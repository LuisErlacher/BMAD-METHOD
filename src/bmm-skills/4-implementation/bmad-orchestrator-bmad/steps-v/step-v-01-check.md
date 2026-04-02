---
configFile: '{project-root}/_bmad/bmm/config.yaml'
sprintStatusFile: '{project-root}/_bmad-output/implementation-artifacts/sprint-status.yaml'
projectContextFile: '{project-root}/_bmad-output/project-context.md'
workflowsRegistry: '../data/workflows-registry.yaml'
workflowsBasePath: ''  # resolved at runtime from skill discovery
buildCommand: 'dotnet build'
---

# Validate: Check Prerequisites

## STEP GOAL:

Verificar todos os pre-requisitos antes de executar o orquestrador.

## MANDATORY SEQUENCE

### 1. Check Configuration Files

```
OUTPUT: "## Verificacao de Pre-requisitos"
OUTPUT: ""
OUTPUT: "### 1. Arquivos de Configuracao"

CHECK: {configFile} exists
  ✓ config.yaml encontrado
  ✗ config.yaml NAO encontrado - Executar setup do BMAD primeiro

CHECK: {sprintStatusFile} exists
  ✓ sprint-status.yaml encontrado
  ✗ sprint-status.yaml NAO encontrado - Executar sprint-planning primeiro

CHECK: {projectContextFile} exists
  ✓ project-context.md encontrado
  ✗ project-context.md NAO encontrado - Executar generate-project-context primeiro
```

### 2. Check Sprint Status Content

```
OUTPUT: "### 2. Status do Sprint"

LOAD: {sprintStatusFile}

CHECK: Has epic with status "in-progress" or "backlog"
  ✓ Epico encontrado para processar: {epic_id}
  ✗ Nenhum epico para processar - Todos completos ou nenhum definido

CHECK: Epic has stories defined
  ✓ Stories encontradas: {story_count}
  ✗ Epico sem stories definidas

CHECK: At least one story not "done"
  ✓ Stories para processar: {pending_count}
  ✗ Todas as stories ja estao completas
```

### 3. Check Required Workflows

```
OUTPUT: "### 3. Workflows Disponiveis"

LOAD: {workflowsRegistry}
EXTRACT: orchestrates list from orchestrator-bmad entry

FOR each workflow in orchestrates [create-story, dev-story, code-review, qa-review]:
  CHECK: ../bmad-{workflow}/SKILL.md exists (sibling skill directory)
    ✓ {workflow} skill encontrado
    ✗ {workflow} skill NAO encontrado

OUTPUT: "Workflows necessarios: create-story, dev-story, code-review"
```

### 4. Check Build Environment

```
OUTPUT: "### 4. Ambiente de Build"

EXECUTE via Bash tool:
  command: "{buildCommand}"

IF exit_code == 0:
  ✓ Build executado com sucesso
ELSE:
  ✗ Build FALHOU - Corrigir erros antes de executar orquestrador
  OUTPUT: {build_errors}
```

### 5. Check Git Status

```
OUTPUT: "### 5. Git"

EXECUTE via Bash tool:
  command: "git status --porcelain"

OUTPUT: Status do repositorio
WARN: Se ha muitas alteracoes nao commitadas
```

### 6. Present Summary

```
OUTPUT: "---"
OUTPUT: "## Resultado da Verificacao"
OUTPUT: ""

IF all checks passed:
  OUTPUT: "✓ **TODOS OS PRE-REQUISITOS ATENDIDOS**"
  OUTPUT: ""
  OUTPUT: "O orquestrador esta pronto para executar."
  OUTPUT: "Execute com modo [E]xecutar para iniciar."

IF any check failed:
  OUTPUT: "✗ **PRE-REQUISITOS NAO ATENDIDOS**"
  OUTPUT: ""
  OUTPUT: "Corrija os itens marcados com ✗ antes de executar."
  OUTPUT: ""
  FOR each failed check:
    OUTPUT: "- {check_name}: {fix_instruction}"
```

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All files checked
- Clear pass/fail for each prerequisite
- Actionable guidance for failures
- Summary presented

### ❌ SYSTEM FAILURE:

- Not checking all prerequisites
- Unclear results
- No guidance for fixing issues
