---
nextStepFile: './step-03-validation.md'
sprintStatusFile: '{project-root}/_bmad-output/implementation-artifacts/sprint-status.yaml'
storyFolder: '{project-root}/_bmad-output/implementation-artifacts/stories'
workflowsRegistry: '../data/workflows-registry.yaml'
---

# Step 2: Story Development Cycle

## STEP GOAL:

Executar o ciclo de desenvolvimento DINAMICAMENTE baseado no story_status_flow do workflows.yaml. O orquestrador APENAS coordena, NUNCA executa o trabalho dos agentes.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Communicate in {communication_language} from config

### Role Reinforcement:

- ✅ You are a COORDINATOR, not an implementer
- ✅ You invoke sub-agents via Task tool
- ✅ You WAIT for sub-agents to complete
- ✅ You UPDATE status after each phase

### Step-Specific Rules:

- 🎯 Focus ONLY on coordinating the development cycle
- 🚫 FORBIDDEN to edit code directly
- 🚫 FORBIDDEN to create story content directly
- 🚫 FORBIDDEN to do code review directly
- 💬 Use Task tool to invoke sub-agents
- 📝 Update sprint-status.yaml after each transition

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. NEVER do the work yourself.

### 1. Identify Next Story

```
LOAD: {sprintStatusFile}
LOAD: {workflowsRegistry} (if not already in session)

# Find story with status that has a workflow to execute
FIND story where status IN status_workflow_map keys AND status != "done"

# Priority order from story_status_flow.statuses
PRIORITY: Use order defined in story_status_flow.statuses

SET: current_story = found story
SET: current_story_status = story.status
SET: current_workflow = status_workflow_map[current_story_status]
```

### 2. Phase Routing (DYNAMIC)

```
# Route based on workflow category from workflows.yaml
LOOKUP: workflow_info = workflows[current_workflow]
SET: workflow_category = workflow_info.category

IF workflow_category == "creation":
    GOTO: Section 3 (Story Creation)

IF workflow_category == "development":
    GOTO: Section 4 (Development)

IF workflow_category == "validation":
    GOTO: Section 5 (Validation Workflow - code-review, qa-review, etc.)
```

### 3. Story Creation Phase

**Only if story status is "backlog"**

```
OUTPUT:
"### Fase: Criacao de Story

Story {current_story_id} esta em backlog. Acionando create-story..."

INVOKE via Task tool:
  subagent_type: "create-story"
  prompt: "Criar story detalhada para {current_story_id} do epico {epic_id}.
           Sprint status: {sprintStatusFile}
           Criar arquivo em: {storyFolder}/{current_story_id}.md"

WAIT: For create-story to complete

VERIFY: Story file created at {storyFolder}/{current_story_id}.md

UPDATE {sprintStatusFile}:
  {current_story_id}: ready-for-dev

OUTPUT:
"Story criada com sucesso. Status atualizado para: ready-for-dev"

CONTINUE to Section 4
```

### 4. Development Phase

**Story status should be "ready-for-dev" or "in-progress"**

```
OUTPUT:
"### Fase: Desenvolvimento

Acionando dev-story para implementar {current_story_id}..."

IF status == "ready-for-dev":
    UPDATE {sprintStatusFile}:
      {current_story_id}: in-progress

INVOKE via Task tool:
  subagent_type: "dev-story"
  prompt: "Desenvolver story {current_story_id}.
           Story file: {storyFolder}/{current_story_id}.md
           Implementar todas as tasks/subtasks seguindo os Acceptance Criteria.
           Atualizar o story file com progresso."

WAIT: For dev-story to complete

VERIFY: Dev-story reported completion

UPDATE {sprintStatusFile}:
  {current_story_id}: review

OUTPUT:
"Desenvolvimento completado. Status atualizado para: review"

CONTINUE to Section 5
```

### 5. Validation Workflow Phase (DYNAMIC: code-review, qa-review, etc.)

**Handles any workflow in category "validation"**

```
SET: validation_workflow = current_workflow  # e.g., "code-review" or "qa-review"
SET: workflow_info = status_transitions[current_story_status]

OUTPUT:
"### Fase: {validation_workflow}

Acionando {validation_workflow} para validar {current_story_id}..."

INVOKE via Task tool:
  subagent_type: "{validation_workflow}"
  prompt: "Executar {validation_workflow} da story {current_story_id}.
           Story file: {storyFolder}/{current_story_id}.md
           Validar conforme criterios do workflow."

WAIT: For {validation_workflow} to complete

CAPTURE: review_result (approved / changes_requested)

IF review_result == "changes_requested":
    SET: next_status = workflow_info.output_fail  # e.g., "in-progress"
    UPDATE {sprintStatusFile}: {current_story_id}: {next_status}
    GOTO: Section 6 (Correction Loop)

IF review_result == "approved":
    SET: next_status = workflow_info.output_pass  # e.g., "qa-review" or "done"
    OUTPUT: "{validation_workflow} aprovado."

    # Check if next status has another validation workflow
    IF next_status IN status_workflow_map AND next_status != "done":
        UPDATE {sprintStatusFile}: {current_story_id}: {next_status}
        SET: current_story_status = next_status
        SET: current_workflow = status_workflow_map[next_status]
        OUTPUT: "Proximo: {current_workflow}..."
        GOTO: Section 5 (invoke next validation workflow)
    ELSE:
        OUTPUT: "Prosseguindo para validacao de build/test..."
        GOTO: Section 7 (Proceed to Build Validation)
```

### 6. Validation Correction Loop

**Only if validation workflow requested changes**

```
OUTPUT:
"### {validation_workflow}: Alteracoes Solicitadas

Issues identificados. Anotando na story e acionando correcao..."

# ORCHESTRATOR ANOTA - nao corrige!
LOAD: {storyFolder}/{current_story_id}.md

APPEND to story file (Issues/Blockers section):
"### [{current_date}] [{validation_workflow}] Alteracoes solicitadas
{review_issues_list}
- Tentativa: {attempt_count}/3"

# ORCHESTRATOR ACIONA dev-story para corrigir
INVOKE via Task tool:
  subagent_type: "dev-story"
  prompt: "Corrigir issues do {validation_workflow} na story {current_story_id}.
           Story file: {storyFolder}/{current_story_id}.md
           Ver secao Issues/Blockers para detalhes."

WAIT: For dev-story to complete

# Atualizar status para re-validacao
UPDATE {sprintStatusFile}: {current_story_id}: {status that triggers validation_workflow}

# ORCHESTRATOR re-aciona o mesmo validation workflow
SET: current_story_status = status that triggers validation_workflow
GOTO: Section 5 (re-validate)

# Loop control
IF attempt_count >= 3:
    OUTPUT: "ERRO: {validation_workflow} falhou apos 3 tentativas. Intervencao necessaria."
    STOP
```

### 7. Proceed to Build Validation

```
OUTPUT:
"Story {current_story_id} passou pelas validacoes de workflow.
Prosseguindo para validacao de build + test..."

LOAD: {nextStepFile}
READ: Entire file
EXECUTE: step-03-validation.md with current_story context
```

---
## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:
- Story identified, sub-agents invoked via Task tool
- Status updated after each phase, proceeded to validation when approved

### ❌ SYSTEM FAILURE:
- Doing work directly instead of invoking sub-agents
- Not updating sprint-status.yaml

**Master Rule:** You COORDINATE. Sub-agents EXECUTE.
