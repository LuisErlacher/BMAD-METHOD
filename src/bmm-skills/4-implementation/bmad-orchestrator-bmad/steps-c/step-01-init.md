---
continueFile: './step-01b-continue.md'
nextStepFile: './step-02-story-cycle.md'
configFile: '{project-root}/_bmad/bmm/config.yaml'
sprintStatusFile: '{project-root}/_bmad-output/implementation-artifacts/sprint-status.yaml'
projectContextFile: '{project-root}/_bmad-output/project-context.md'
orchestratorRules: '../data/orchestrator-rules.md'
statusMapping: '../data/status-mapping.md'
workflowsRegistry: '../data/workflows-registry.yaml'
---

# Step 1: Initialization

## STEP GOAL:

Carregar configuracoes, contexto do projeto e sprint status. Detectar se e continuacao ou novo inicio.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ✅ Communicate in {communication_language} from config

### Role Reinforcement:

- ✅ You are an autonomous development orchestrator
- ✅ You coordinate sub-agents, you do NOT do their work
- ✅ Quality over speed - never skip steps

### Step-Specific Rules:

- 🎯 Focus ONLY on initialization and context loading
- 🚫 FORBIDDEN to start development cycle yet
- 💬 Load orchestrator rules FIRST
- 🔄 Auto-proceed when ready

## EXECUTION PROTOCOLS:

- 🎯 Load all required context files
- 💾 Store configuration as session variables
- 📖 Check for continuation state
- 🚫 FORBIDDEN to skip context loading

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load Orchestrator Rules and Workflows Registry

```
LOAD: {orchestratorRules}
LOAD: {statusMapping}
LOAD: {workflowsRegistry}
INTERNALIZE: As fundamental operating principles

# DYNAMIC EXTRACTION from workflowsRegistry.story_status_flow
PARSE: story_status_flow.statuses[]

BUILD status_workflow_map:
  FOR EACH status in story_status_flow.statuses:
    IF status.workflow != null:
      status_workflow_map[status.name] = status.workflow

BUILD status_transitions:
  FOR EACH status in story_status_flow.statuses:
    status_transitions[status.name] = {
      next: status.next,
      workflow: status.workflow,
      output_pass: workflows[status.workflow].output_status_pass OR status.next,
      output_fail: workflows[status.workflow].output_status_fail OR null
    }

STORE: status_workflow_map, status_transitions as session variables
```

**Critical reminder after loading:**

"Eu sou um ORQUESTRADOR. Eu COORDENO, nao EXECUTO. Nunca editarei codigo diretamente.
Workflows carregados dinamicamente do workflows.yaml:
{list status_workflow_map keys and values}"

### 2. Load Configuration

```
LOAD: {configFile}
EXTRACT:
  - communication_language
  - user_name
  - output_folder
STORE: As session variables
```

### 3. Load Project Context

```
LOAD: {projectContextFile}
PURPOSE: Understand project patterns, technologies, conventions
STORE: As reference context
```

### 4. Load Sprint Status

```
LOAD: {sprintStatusFile}
EXTRACT:
  - Current epic (status: in-progress)
  - Stories list with status
  - Next story to process
```

### 5. Check for Continuation

```
ANALYZE sprint-status:

# Check for any status that has a workflow (dynamic detection)
IF any story has status with workflow in status_workflow_map (except "done"):
    # Workflow was interrupted mid-story
    SET: continuation_detected = true
    SET: resume_story = story with active status
    SET: resume_status = story.status
    GOTO: Load {continueFile}

IF all stories in epic are "done":
    # Epic already complete
    OUTPUT: "Epico ja esta completo. Nada a fazer."
    STOP

IF epic status is "backlog":
    # First run - need to start epic
    UPDATE: epic status → in-progress
    CONTINUE to step 6

IF epic status is "in-progress" AND stories have "ready-for-dev" or "backlog":
    # Normal state - continue processing
    CONTINUE to step 6
```

### 6. Present Status Summary

```
OUTPUT:
"## Orchestrator Inicializado

**Projeto:** {project_name}
**Epico Atual:** {epic_id} - {epic_title}
**Status do Epico:** {epic_status}

**Stories:**
{for each story in epic}
- [{story_status}] {story_id}: {story_title}
{end for}

**Proxima Story:** {next_story_id} - {next_story_title}

Iniciando ciclo de desenvolvimento..."
```

### 7. Auto-Proceed to Story Cycle

```
LOAD: {nextStepFile}
READ: Entire file
EXECUTE: step-02-story-cycle.md
```

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Orchestrator rules loaded and internalized
- Config loaded with communication_language
- Sprint status loaded and analyzed
- Continuation detected if applicable
- Status summary presented
- Auto-proceeded to next step

### ❌ SYSTEM FAILURE:

- Not loading orchestrator rules FIRST
- Skipping context files
- Not detecting continuation state
- Not presenting status summary

**Master Rule:** Always load orchestrator rules first. They define WHO you are.
