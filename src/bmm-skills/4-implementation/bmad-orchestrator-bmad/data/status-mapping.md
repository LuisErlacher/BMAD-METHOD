# BMAD Status Mapping

## Epic Status

| Status | Descricao | Transicao |
|--------|-----------|-----------|
| `backlog` | Epico ainda nao iniciado | Estado inicial |
| `in-progress` | Epico ativamente sendo trabalhado | Quando primeira story criada |
| `done` | Todas as stories completadas | Quando ultima story done |

---

## Story Status

**NOTA:** Os status sao carregados DINAMICAMENTE do arquivo `workflows.yaml`.
A tabela abaixo e apenas referencia. A fonte de verdade e `story_status_flow` no workflows.yaml.

| Status | Descricao | Workflow | Proximo (pass) | Proximo (fail) |
|--------|-----------|----------|----------------|----------------|
| `backlog` | Story so existe no epic file | create-story | ready-to-dev | - |
| `ready-to-dev` | Story file criado, pronto para dev | dev-story | in-progress | - |
| `in-progress` | Developer ativamente trabalhando | dev-story | review | - |
| `review` | Aguardando code review | code-review | qa-review | in-progress |
| `qa-review` | Code review passou, aguardando QA | qa-review | done | in-progress |
| `done` | Story completada | - | - | - |

---

## Retrospective Status

| Status | Descricao |
|--------|-----------|
| `optional` | Pode ser completado mas nao obrigatorio |
| `done` | Retrospectiva completada |

---

## Transicoes do Orquestrador (DINAMICAS)

**NOTA:** As transicoes sao determinadas pelo `story_status_flow` no workflows.yaml.

```
EVENTO                                 STATUS ATUALIZADO
-----------------------------------------------------------
Epico inicia (primeira story)         epic: backlog → in-progress
create-story completa                 story: backlog → ready-to-dev
dev-story inicia                      story: ready-to-dev → in-progress
dev-story completa implementacao      story: in-progress → review
code-review aprova                    story: review → qa-review
code-review rejeita                   story: review → in-progress (fix)
qa-review aprova + build + test OK    story: qa-review → done
qa-review rejeita                     story: qa-review → in-progress (fix)
Todas stories done                    epic: in-progress → done
```

**Extensibilidade:** Novos workflows adicionados ao `story_status_flow` serao automaticamente
reconhecidos pelo orquestrador. Basta adicionar o status e workflow no workflows.yaml.

---

## Status INVALIDOS (NUNCA usar)

Os seguintes status NAO existem no BMAD method:

- ~~completed~~ → usar `done`
- ~~finished~~ → usar `done`
- ~~approved~~ → usar `done`
- ~~validated~~ → usar `review` ou `done`
- ~~pending~~ → usar `backlog` ou `ready-for-dev`
- ~~waiting~~ → usar `backlog`
- ~~blocked~~ → anotar na story, manter status atual

---

## Atualizacao do sprint-status.yaml

Formato YAML para atualizacao:

```yaml
development_status:
  epic-N: in-progress           # ou done quando todas stories completas
  N-1-story-name: done          # story completada
  N-2-story-name: in-progress   # story em desenvolvimento
  N-3-story-name: ready-for-dev # story pronta para dev
  N-4-story-name: backlog       # story ainda nao iniciada
```

**IMPORTANTE:** Usar sempre o formato exato. Nao inventar status.
