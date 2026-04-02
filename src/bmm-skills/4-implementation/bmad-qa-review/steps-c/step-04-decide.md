---

nextStepFile: './step-05-update.md'
---

# Step 4: Consolidate and Decide

## STEP GOAL:

To analyze all validation results, consolidate findings, and determine whether the story should be marked as "done" or returned to "in-progress" for corrections.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER skip the decision logic
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A QA ENGINEER making quality decisions
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a QA Engineer making the final quality call
- ✅ Objective assessment based on evidence
- ✅ Clear categorization of issues
- ✅ Professional documentation of decision

### Step-Specific Rules:

- 🎯 Focus ONLY on analyzing results and deciding outcome
- 🚫 FORBIDDEN to change test results - only analyze them
- 💬 Apply decision rules consistently
- 📝 Prepare QA Review section for story

## EXECUTION PROTOCOLS:

- 🎯 Analyze {{results}} from step-03
- 💾 Prepare {{qa_review_section}} for story
- 📖 Determine {{new_status}} based on rules
- 🚫 Decision must be evidence-based

## CONTEXT BOUNDARIES:

- Available: {{results}} and {{results_summary}} from step-03
- Available: {{story_data}} from step-01
- Produce: {{new_status}}, {{qa_review_section}}

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Analyze Results

From {{results}}, calculate:
- {{total_tested}}: Total items tested
- {{passed_count}}: Items that passed
- {{failed_count}}: Items that failed
- {{blocking_count}}: Blocking failures
- {{non_blocking_count}}: Non-blocking failures

### 2. Apply Decision Rules

**DECISION LOGIC:**

```
IF blocking_count > 0:
    new_status = "in-progress"
    decision = "CORRECTIONS NEEDED"
    reason = "Blocking issues found that prevent story completion"

ELSE IF blocking_count == 0 AND non_blocking_count > 0:
    new_status = "done"
    decision = "APPROVED WITH OBSERVATIONS"
    reason = "No blocking issues. Non-blocking items documented for tracking."

ELSE IF failed_count == 0:
    new_status = "done"
    decision = "APPROVED"
    reason = "All validation items passed"
```

### 3. Prepare QA Review Section

Build {{qa_review_section}} for the story:

```markdown
## QA Review

**Review Date:** {{date}}
**Reviewer:** AI QA Review
**Test Type:** {{test_type}}

### Validation Summary

| Category | Total | Passed | Failed |
|----------|-------|--------|--------|
| Functional Requirements | {{fr_total}} | {{fr_passed}} | {{fr_failed}} |
| Non-Functional Requirements | {{nfr_total}} | {{nfr_passed}} | {{nfr_failed}} |
| Acceptance Criteria | {{ac_total}} | {{ac_passed}} | {{ac_failed}} |
| **TOTAL** | {{total_tested}} | {{passed_count}} | {{failed_count}} |

### Validation Checklist

{{for each item in results}}
- [{{x if passed}}] {{item_id}}: {{description}} - {{status}}{{if failed}} ({{issue_type}}){{/if}}
{{/for}}

### Issues Found

{{if blocking_count > 0}}
#### Blocking Issues ({{blocking_count}})
{{for each blocking issue}}
- [ ] **{{item_id}}**: {{description}}
  - **Issue:** {{failure_details}}
  - **Evidence:** {{evidence}}
  - **Impact:** Blocks story completion
{{/for}}
{{/if}}

{{if non_blocking_count > 0}}
#### Non-Blocking Issues ({{non_blocking_count}}) - Tracked
{{for each non_blocking issue}}
- [ ] **{{item_id}}**: {{description}}
  - **Issue:** {{failure_details}}
  - **Evidence:** {{evidence}}
  - **Impact:** Minor, tracked for future improvement
{{/for}}
{{/if}}

{{if failed_count == 0}}
#### No Issues Found
All validation items passed successfully.
{{/if}}

### Decision

**{{decision}}** → {{new_status}}

{{reason}}

{{if new_status == "in-progress"}}
**Action Required:** Developer must fix {{blocking_count}} blocking issue(s) before next QA review.
{{/if}}

{{if new_status == "done" AND non_blocking_count > 0}}
**Note:** {{non_blocking_count}} non-blocking issue(s) documented for tracking. These do not block release.
{{/if}}
```

### 4. Display Decision Summary

Output to user:

```
════════════════════════════════════════════
          QA REVIEW DECISION
════════════════════════════════════════════

Story: {{story_title}}
Test Type: {{test_type}}

Results:
  ✅ Passed: {{passed_count}} / {{total_tested}}
  ❌ Failed: {{failed_count}}
     🚫 Blocking: {{blocking_count}}
     ⚠️ Non-Blocking: {{non_blocking_count}}

────────────────────────────────────────────

DECISION: {{decision}}
NEW STATUS: {{new_status}}

{{reason}}

════════════════════════════════════════════
```

### 5. Auto-Proceed to Update

**This step auto-proceeds (no menu).**

Display: "**Proceeding to update story and sprint status...**"

Immediately load, read entirely, then execute {nextStepFile}.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Results correctly analyzed
- Decision rules applied consistently
- QA Review section properly formatted
- Decision clearly communicated
- new_status determined correctly

### ❌ SYSTEM FAILURE:

- Wrong decision based on results
- Missing issues in QA Review section
- Inconsistent categorization
- Unclear decision communication

**Master Rule:** The decision must be objective and based solely on the validation results.
