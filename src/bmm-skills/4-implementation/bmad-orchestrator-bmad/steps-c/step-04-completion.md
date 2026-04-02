---
sprintStatusFile: '{project-root}/_bmad-output/implementation-artifacts/sprint-status.yaml'
---

# Step 4: Epic Completion

## STEP GOAL:

Verificar que todas as stories estao completas, marcar epico como done, e apresentar sumario final ao utilizador.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Communicate in {communication_language} from config

### Role Reinforcement:

- ✅ You are presenting the final results of orchestration
- ✅ Be concise and informative
- ✅ Celebrate the completion!

### Step-Specific Rules:

- 🎯 Focus on verification and summary
- 🚫 FORBIDDEN to skip verification
- 💬 Present clear metrics and results

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Verify All Stories Complete

```
LOAD: {sprintStatusFile}

FOR each story in current epic:
    ASSERT: story.status == "done"

IF any story NOT done:
    OUTPUT: "ERRO: Nem todas as stories estao completas."
    LIST: Stories not done
    STOP: Should not be here if stories incomplete
```

### 2. Update Epic Status

```
UPDATE {sprintStatusFile}:
  {epic_id}: done

OUTPUT: "Epic {epic_id} marcado como done."
```

### 3. Gather Metrics

```
LOAD: {sprintStatusFile}

COUNT: total_stories in epic
COUNT: stories completed (all should be done)

EXECUTE via Bash tool:
  command: "git log --oneline | head -20"

CAPTURE: recent_commits
FILTER: commits related to current epic stories
```

### 4. Present Final Summary

```
OUTPUT:
"## Epico Completo! 🎉

**Epico:** {epic_id} - {epic_title}
**Status:** done

---

### Stories Desenvolvidas

| Story | Titulo | Status |
|-------|--------|--------|
{for each story in epic}
| {story_id} | {story_title} | ✓ done |
{end for}

**Total:** {total_stories} stories

---

### Commits Realizados

{for each related commit}
- {commit_hash} {commit_message}
{end for}

---

### Metricas de Qualidade

- **Build:** OK ✓
- **Testes:** OK ✓
- **Code Reviews:** Todos aprovados ✓
- **Commits:** {commit_count} commits

---

### Proximo Passo

O desenvolvimento do epico **{epic_id}** foi concluido com sucesso.

**Recomendacoes:**
1. Executar retrospectiva do epico (opcional)
2. Verificar se ha proximo epico para iniciar
3. Atualizar documentacao se necessario

---

**Obrigado por usar o BMAD Development Orchestrator!**"
```

### 5. End Workflow

```
OUTPUT: "Workflow finalizado com sucesso."

# No next step - workflow complete
STOP: Workflow successfully completed
```

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All stories verified as "done"
- Epic status updated to "done"
- Metrics gathered
- Clear summary presented
- Workflow ended gracefully

### ❌ SYSTEM FAILURE:

- Reaching completion with incomplete stories
- Not updating epic status
- Not presenting summary
- Abrupt termination

**Master Rule:** Only reach this step when ALL stories are truly done.
