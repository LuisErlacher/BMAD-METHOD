---
nextStepFile: './step-02-story-cycle.md'
completionStepFile: './step-04-completion.md'
sprintStatusFile: '{project-root}/_bmad-output/implementation-artifacts/sprint-status.yaml'
storyFolder: '{project-root}/_bmad-output/implementation-artifacts/stories'
workflowsRegistry: '../data/workflows-registry.yaml'
zeroTechDebtPolicy: '../data/zero-tech-debt-policy.md'
buildCommand: 'dotnet build'
testCommand: 'dotnet test'
---

# Step 3: Validation and Commit

## STEP GOAL:

Executar build, testes, loop de correcao se necessario, commit quando tudo passar, e transicao dinamica de status baseada no workflows.yaml.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Communicate in {communication_language} from config

### Role Reinforcement:

- ✅ You EXECUTE build and test commands (this is orchestrator work)
- ✅ You ANNOTATE issues in story file (this is orchestrator work)
- ✅ You INVOKE sub-agents to FIX issues (NOT fix yourself)
- ✅ You COMMIT when everything passes (this is orchestrator work)

### Step-Specific Rules:

- 🎯 Focus on validation and commit
- 🚫 FORBIDDEN to fix build errors directly - invoke dev-story
- 🚫 FORBIDDEN to fix test failures directly - invoke dev-story
- 💬 Annotate ALL issues before invoking correction
- ✅ Commit ONLY when build AND tests pass
- 🛡️ **ZERO TECH DEBT POLICY**: ANY failure must be fixed, even if unrelated to current story

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Initialize Validation

```
SET: attempt_count = 0
SET: max_attempts = 3

OUTPUT:
"### Fase: Validacao

Iniciando verificacao de build e testes para story {current_story_id}..."
```

### 2. Build Verification

```
OUTPUT:
"Executando build..."

EXECUTE via Bash tool:
  command: "{buildCommand}"

CAPTURE: build_exit_code, build_output

IF build_exit_code != 0:
    OUTPUT: "Build FALHOU"
    SET: failure_type = "BUILD"
    SET: failure_details = build_output
    GOTO: Section 4 (Correction Loop)

OUTPUT: "Build OK ✓"
CONTINUE to Section 3
```

### 3. Test Verification

```
OUTPUT:
"Executando testes..."

EXECUTE via Bash tool:
  command: "{testCommand}"

CAPTURE: test_exit_code, test_output

IF test_exit_code != 0:
    OUTPUT: "Testes FALHARAM"
    SET: failure_type = "TEST"
    SET: failure_details = test_output
    GOTO: Section 4 (Correction Loop)

OUTPUT: "Testes OK ✓"
CONTINUE to Section 5 (Commit)
```

### 4. Failure Analysis and Correction Loop

**See {zeroTechDebtPolicy} for detailed classification rules and prompts**

```
INCREMENT: attempt_count

IF attempt_count > max_attempts:
    OUTPUT: "## ERRO: Falha Persistente - Intervencao manual necessaria."
    STOP: Await manual intervention

# 4.1: ANALYZE and CLASSIFY failure (see zero-tech-debt-policy.md)
ANALYZE: Check if failure is in files modified by current story
CLASSIFY: STORY_RELATED (in scope) or TECH_DEBT (pre-existing)
OUTPUT: Classification result with scope explanation

# 4.2: ANNOTATE issue in story file
LOAD: {storyFolder}/{current_story_id}.md
APPEND: Issue with classification, scope, error details, attempt count

# 4.3: INVOKE dev-story to fix
INVOKE via Task tool:
  subagent_type: "dev-story"
  prompt: "Corrigir falha de {failure_type} ({failure_classification}).
           Story file: {storyFolder}/{current_story_id}.md
           Erro: {failure_details}"

WAIT: For dev-story to complete

# 4.4: INVOKE code-review to validate fix
INVOKE via Task tool:
  subagent_type: "code-review"
  prompt: "Validar correcao de {failure_type} ({failure_classification})."

WAIT: For code-review to complete

# 4.5: Re-run validation
GOTO: Section 2 (Build Verification)
```

### 5. Commit

**Only when build AND tests pass**

```
OUTPUT:
"### Validacao Completa ✓

Build: OK
Testes: OK

Realizando commit..."

# Get story title for commit message
LOAD: {storyFolder}/{current_story_id}.md
EXTRACT: story_title from frontmatter or first heading

EXECUTE via Bash tool:
  command: 'git add -A && git commit -m "$(cat <<'\''EOF'\''
feat({current_story_id}): {story_title}

- Acceptance criteria validated
- Build OK
- Tests OK
- Code review approved

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"'

CAPTURE: commit_result

IF commit failed:
    OUTPUT: "AVISO: Commit falhou. Verificar estado do git."
    # Continue anyway - story is done

OUTPUT: "Commit realizado com sucesso."
```

### 6. Dynamic Status Transition

```
# Load workflows registry to check transitions
LOAD: {workflowsRegistry} (if not in session)

# Get current status and determine next
SET: current_status = current_story_status from session
LOOKUP: transition = status_transitions[current_status]
SET: next_status = transition.output_pass

# Check if next status has a workflow to execute (e.g., qa-review)
IF next_status IN status_workflow_map AND next_status != "done":
    UPDATE {sprintStatusFile}: {current_story_id}: {next_status}
    OUTPUT:
    "Story {current_story_id} passou build/test.
    Status atualizado para: {next_status}
    Voltando ao ciclo para executar: {status_workflow_map[next_status]}..."

    LOAD: {nextStepFile}
    READ: Entire file
    EXECUTE: step-02-story-cycle.md with updated status

ELSE:
    # No more workflows, mark as done
    UPDATE {sprintStatusFile}: {current_story_id}: done
    OUTPUT:
    "Story {current_story_id} completada com sucesso!
    Status atualizado para: done"
    CONTINUE to Section 7
```

### 7. Check for More Stories

```
LOAD: {sprintStatusFile}

FIND: Stories in current epic with status != "done"

IF found stories to process:
    OUTPUT: "Proxima story: {next_story_id}"
    LOAD: {nextStepFile}
    READ: Entire file
    EXECUTE: step-02-story-cycle.md

IF all stories are "done":
    OUTPUT: "Todas as stories do epico foram completadas!"
    LOAD: {completionStepFile}
    READ: Entire file
    EXECUTE: step-04-completion.md
```

---
## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:
- Build/tests executed, failures analyzed and classified
- Issues annotated with classification BEFORE invoking correction
- ALL failures corrected (Zero Tech Debt Policy)
- Commit made when ALL validations pass
- Dynamic status transition executed correctly

### ❌ SYSTEM FAILURE:
- Fixing errors directly instead of invoking dev-story
- Skipping tech-debt fixes (letting failures pass)
- Committing with failing build or tests

**Master Rule:** Build/test = YOUR job. Fixing = dev-story's job. Zero Tech Debt.
