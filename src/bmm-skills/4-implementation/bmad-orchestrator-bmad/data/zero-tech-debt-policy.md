# Zero Tech Debt Policy

## Regra Fundamental

```
🛡️ NENHUM TECH DEBT PODE PASSAR

Quando build ou testes falham, o orquestrador DEVE:
1. ANALISAR a origem da falha
2. CLASSIFICAR como STORY_RELATED ou TECH_DEBT
3. CORRIGIR INDEPENDENTE DA ORIGEM
4. NUNCA prosseguir com falhas pendentes
```

---

## Classificação de Falhas

### STORY_RELATED
- Falha em arquivos modificados pela story atual
- Erro diretamente relacionado às mudanças da story
- **Ação:** Corrigir como parte normal do desenvolvimento

### TECH_DEBT
- Falha em arquivos NÃO modificados pela story
- Erro pré-existente ou efeito colateral
- Código legacy com problemas
- **Ação:** Corrigir igualmente (Zero Tech Debt Policy)

---

## Análise de Origem

```
ANALYZE failure_details:
  1. Check if failing files/tests are in scope of current story tasks
  2. Check if error references code modified by current story
  3. Check git blame/history for recently modified files

CLASSIFY:
  IF failure in files modified by current story:
    failure_classification = "STORY_RELATED"
    failure_scope = "Diretamente relacionado a story atual"
  ELSE:
    failure_classification = "TECH_DEBT"
    failure_scope = "Pre-existente ou efeito colateral"
```

---

## Formato de Anotação na Story

```markdown
### [{current_date}] [{failure_type}] [{failure_classification}] Falha de validacao
- **Comando:** {command}
- **Classificacao:** {failure_classification}
- **Escopo:** {failure_scope}
- **Erro:** {failure_details summary}
- **Tentativa:** {attempt_count}/{max_attempts}
- **Acao:** Correcao obrigatoria (Zero Tech Debt Policy)
```

---

## Prompt para Dev-Story (Tech Debt)

```
Corrigir falha de {failure_type} detectada durante validacao.

**Classificacao:** TECH_DEBT
**Escopo:** Pre-existente ou efeito colateral

NOTA: Esta falha e pre-existente ou efeito colateral, mas deve ser
corrigida agora conforme Zero Tech Debt Policy do projeto.
Analise o erro, identifique a causa raiz, e aplique a correcao.

Erro:
{failure_details}
```

---

## Motivo da Política

Deixar tech debt passar compromete:
- Qualidade do projeto
- Confiabilidade dos testes
- Manutenibilidade do código
- Velocidade de desenvolvimento futuro

**Princípio:** Corrigir agora é mais barato que corrigir depois.
