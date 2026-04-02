---

nextStepFile: './step-04-decide.md'
---

# Step 3: Execute Validation Loop

## STEP GOAL:

To systematically test EVERY item in the validation checklist, documenting results for each FR, NFR, and AC. This is the core testing phase.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER skip any checklist item - EVERY item must be tested
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A QA ENGINEER executing systematic validation
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL FALLBACK: If Playwright unavailable, document and use manual verification

### Role Reinforcement:

- ✅ You are a QA Engineer executing thorough testing
- ✅ Quality over speed - test everything completely
- ✅ Document evidence for every test (response codes, screenshots, logs)
- ✅ Continue testing even when failures are found

### Step-Specific Rules:

- 🎯 Focus ONLY on executing tests and documenting results
- 🚫 FORBIDDEN to skip any item - LOOP MUST BE COMPLETE
- 💬 Document PASSED/FAILED with evidence for each item
- 🔄 If a test fails, document and CONTINUE to next item
- ⏸️ Do NOT stop on failures - complete the entire checklist

## EXECUTION PROTOCOLS:

- 🎯 Test EVERY item in {{checklist}} sequentially
- 💾 Document result for each: PASSED/FAILED + evidence
- 📖 Categorize failures: blocking vs non-blocking
- 🚫 Complete ALL items before proceeding

## CONTEXT BOUNDARIES:

- Available: {{checklist}} from step-02
- Available: {{test_type}} from step-01
- Available: {{base_url}} / {{frontend_url}} from step-02
- Produce: {{results}} array with test outcomes

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. The LOOP is mandatory - do not skip items.

### 1. Initialize Results Tracking

Create {{results}} array to track:
```
{
  item_id: "FR-001",
  description: "...",
  status: "PASSED" | "FAILED",
  evidence: "...",
  issue_type: null | "blocking" | "non-blocking",
  details: "..."
}
```

### 2. BEGIN VALIDATION LOOP

**FOR EACH item in {{checklist}}:**

Display: "**Testing {{item_id}}: {{description}}**"

#### 2a. Determine Test Method

**IF {{test_type}} == "backend-only":**
- Use cURL for API testing
- Validate response codes, body, timing

**IF {{test_type}} == "frontend-e2e":**
- Use Playwright MCP for E2E testing
- Interact with UI, validate behavior
- For API-related items, also test via cURL

#### 2b. Execute Backend Test (cURL)

**For API/Backend items:**

```bash
# Example cURL test
curl -X {{method}} "{{base_url}}/{{endpoint}}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{token}}" \
  -d '{{request_body}}' \
  -w "\n%{http_code} %{time_total}s"
```

**Validate:**
- Response code matches expected (200, 201, etc.)
- Response body contains expected data
- Response time within acceptable limits (for NFRs)
- Error handling works correctly (test error cases)

**Document evidence:**
- Actual response code
- Key response data
- Response time (for performance NFRs)

#### 2c. Execute Frontend Test (Playwright)

**For UI/Frontend items:**

Use Playwright MCP to:

1. **Navigate to page:**
   - `browser_navigate` to target URL

2. **Interact with elements:**
   - `browser_click` for buttons, links
   - `browser_fill_form` for inputs
   - `browser_select_option` for dropdowns

3. **Verify behavior:**
   - `browser_snapshot` to capture DOM state
   - Check for expected elements
   - Verify text content, visibility

4. **Handle authentication:**
   - Navigate to login
   - Fill credentials
   - Submit and verify redirect

5. **Capture evidence:**
   - `browser_take_screenshot` on failures
   - Note console errors with `browser_console_messages`

**Document evidence:**
- Actions performed
- Expected vs actual behavior
- Screenshot reference (if failure)
- Console errors (if any)

#### 2d. Determine Result

**PASSED:**
- Behavior matches expected
- Response/UI is correct
- Performance within thresholds (for NFRs)

**FAILED:**
- Behavior does not match expected
- Errors occur
- Performance outside thresholds

#### 2e. Categorize Failures

**IF FAILED, categorize:**

**Blocking:**
- Core functionality broken
- User cannot complete primary task
- Security vulnerability
- Data corruption risk
- Critical AC not met

**Non-Blocking:**
- Minor visual issues
- Performance slightly outside threshold
- Edge case failures
- Documentation/message issues
- Nice-to-have features missing

#### 2f. Document Result

Add to {{results}}:
```
{{item_id}}: {{status}}
Evidence: {{evidence}}
{{if FAILED}}
Issue Type: {{issue_type}}
Details: {{failure_details}}
{{/if}}
```

Display brief status: "{{item_id}}: {{status}} {{if FAILED}}({{issue_type}}){{/if}}"

#### 2g. CONTINUE TO NEXT ITEM

**CRITICAL: DO NOT STOP ON FAILURES**

Move to next item in checklist. Repeat steps 2a-2f.

### 3. END VALIDATION LOOP

**After ALL items tested:**

Display loop completion:
```
**Validation Loop Complete**

Items Tested: {{total_count}}
Passed: {{passed_count}}
Failed: {{failed_count}}
  - Blocking: {{blocking_count}}
  - Non-Blocking: {{non_blocking_count}}
```

### 4. Compile Results Summary

Create {{results_summary}}:

```
VALIDATION RESULTS - {{story_title}}
════════════════════════════════════

PASSED ({{passed_count}})
────────────────────────
[x] FR-001: {description} - PASSED
[x] AC-002: {description} - PASSED
...

FAILED - BLOCKING ({{blocking_count}})
────────────────────────
[ ] FR-003: {description} - FAILED
    Issue: {details}
    Evidence: {evidence}
...

FAILED - NON-BLOCKING ({{non_blocking_count}})
────────────────────────
[ ] NFR-001: {description} - FAILED
    Issue: {details}
    Evidence: {evidence}
...
```

### 5. Auto-Proceed to Decision

**This step auto-proceeds (no menu).**

Display: "**Proceeding to decision phase...**"

Immediately load, read entirely, then execute {nextStepFile}.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- EVERY checklist item tested (none skipped)
- Each result documented with evidence
- Failures categorized (blocking/non-blocking)
- Complete results summary compiled
- Loop executed to completion regardless of failures

### ❌ SYSTEM FAILURE:

- Skipping ANY checklist item
- Stopping loop on first failure
- Not documenting evidence for tests
- Not categorizing failures
- Incomplete results summary

**Master Rule:** The loop MUST complete. Every item MUST be tested. Failures do NOT stop the loop.
