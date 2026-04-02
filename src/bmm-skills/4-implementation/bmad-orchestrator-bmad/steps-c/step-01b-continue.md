---
sprintStatusFile: '{project-root}/_bmad-output/implementation-artifacts/sprint-status.yaml'
storyFolder: '{project-root}/_bmad-output/implementation-artifacts/stories'
orchestratorRules: '../data/orchestrator-rules.md'
statusMapping: '../data/status-mapping.md'
workflowsRegistry: '../data/workflows-registry.yaml'
storyCycleStep: './step-02-story-cycle.md'
validationStep: './step-03-validation.md'
---

# Step 1b: Continuation Handler

## STEP GOAL:

Detectar onde o workflow parou e retomar do ponto correto.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Communicate in {communication_language} from config

### Role Reinforcement:

- ✅ You are an autonomous development orchestrator resuming work
- ✅ Detect state from external files (sprint-status, story files)
- ✅ Resume seamlessly without losing progress

### Step-Specific Rules:

- 🎯 Focus ONLY on detecting state and routing
- 🚫 FORBIDDEN to restart from beginning
- 💬 Present clear summary of where we're resuming
- 🔄 Route to correct step based on state

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Reload Orchestrator Rules

```
LOAD: {orchestratorRules}
LOAD: {statusMapping}
```

### 2. Analyze Sprint Status

```
LOAD: {sprintStatusFile}
LOAD: {workflowsRegistry}

# Dynamic: Find story with any active status (has workflow, not done)
PARSE: story_status_flow.statuses from workflowsRegistry
BUILD: active_statuses = [status.name for status in statuses if status.workflow != null and status.name != "done"]

FIND: Story with status IN active_statuses
SET: resume_story = found story
SET: resume_story_id = story identifier
SET: resume_story_status = story status
SET: resume_workflow = status_workflow_map[resume_story_status]
```

### 3. Load Story File

```
LOAD: {storyFolder}/{resume_story_id}.md

CHECK story file for:
- Issues/Blockers section (indicates correction loop)
- Implementation status
- Last action taken
```

### 4. Determine Resume Point (DYNAMIC)

```
# Get workflow category for current status
LOOKUP: workflow_info = workflows[resume_workflow]
SET: workflow_category = workflow_info.category

IF workflow_category == "development":
    IF story has recent Issues/Blockers:
        # Was in correction loop
        SET: resume_phase = "correction"
        SET: resume_step = {validationStep}
    ELSE:
        # Normal development
        SET: resume_phase = "development ({resume_workflow})"
        SET: resume_step = {storyCycleStep}

IF workflow_category == "validation":
    # Was in validation phase (code-review, qa-review, etc.)
    SET: resume_phase = "{resume_workflow}"
    SET: resume_step = {storyCycleStep}

IF workflow_category == "creation":
    # Was in story creation
    SET: resume_phase = "creation ({resume_workflow})"
    SET: resume_step = {storyCycleStep}
```

### 5. Present Continuation Summary

```
OUTPUT:
"## Continuacao Detectada

**Workflow interrompido durante:** {resume_phase}
**Story em progresso:** {resume_story_id} - {resume_story_title}
**Status atual:** {resume_story_status}

{IF has Issues/Blockers}
**Issues pendentes:**
{list issues}
{END IF}

**Retomando de:** {resume_phase}

Continuando desenvolvimento..."
```

### 6. Route to Correct Step

```
LOAD: {resume_step}
READ: Entire file
EXECUTE: With context of resume_story
```

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Story in progress correctly identified
- Story file loaded and analyzed
- Resume point accurately determined
- Clear summary presented
- Routed to correct step

### ❌ SYSTEM FAILURE:

- Not finding story in progress
- Restarting from beginning instead of resuming
- Not checking for Issues/Blockers
- Wrong resume point

**Master Rule:** State lives in external files. Read them to know where you are.
