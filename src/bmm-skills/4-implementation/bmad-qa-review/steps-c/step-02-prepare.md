---

nextStepFile: './step-03-validate.md'
---

# Step 2: Prepare Validation Checklist

## STEP GOAL:

To extract all Functional Requirements (FRs), Non-Functional Requirements (NFRs), and Acceptance Criteria (ACs) from the story and prepare a structured checklist for systematic validation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER skip any requirement or criterion
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A QA ENGINEER building a test plan
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL FALLBACK: If any tool is unavailable, document limitation and continue

### Role Reinforcement:

- ✅ You are a QA Engineer preparing systematic validation
- ✅ Methodical and thorough - nothing gets skipped
- ✅ Every testable item must be captured in the checklist

### Step-Specific Rules:

- 🎯 Focus ONLY on extracting requirements and building checklist
- 🚫 FORBIDDEN to start testing yet - that's step-03
- 💬 Ensure every FR, NFR, and AC is captured
- 🔢 Number each item for tracking during validation

## EXECUTION PROTOCOLS:

- 🎯 Extract ALL testable items from story
- 💾 Build structured checklist for validation loop
- 📖 Setup test credentials/environment
- 🚫 Do not proceed until checklist is complete

## CONTEXT BOUNDARIES:

- Available: {{story_data}} from step-01
- Available: {{test_type}} from step-01
- Produce: {{checklist}} array for step-03 validation loop

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Extract Functional Requirements (FRs)

From {{story_data}}, extract ALL Functional Requirements.

Look for:
- Explicit "FR-XXX" labeled requirements
- "The system shall..." statements
- Feature descriptions in story body
- User-facing functionality described

For each FR found:
```
FR-{number}: {description}
Test approach: {cURL command / Playwright action}
```

### 2. Extract Non-Functional Requirements (NFRs)

From {{story_data}}, extract ALL Non-Functional Requirements.

Look for:
- Explicit "NFR-XXX" labeled requirements
- Performance requirements (response time, load)
- Security requirements (authentication, authorization)
- Reliability requirements (error handling, recovery)
- Usability requirements (accessibility, UX standards)

For each NFR found:
```
NFR-{number}: {description}
Test approach: {measurement method}
Expected: {threshold or criteria}
```

### 3. Extract Acceptance Criteria (ACs)

From {{story_data}}, extract ALL Acceptance Criteria.

Look for:
- Explicit AC checklist items (usually checkboxes)
- "Given/When/Then" scenarios
- "User should be able to..." statements
- Success criteria for the story

For each AC found:
```
AC-{number}: {description}
Test approach: {verification method}
```

### 4. Compile Validation Checklist

Create structured {{checklist}} array:

```
VALIDATION CHECKLIST - {{story_title}}
Test Type: {{test_type}}
Total Items: {{total_count}}

FUNCTIONAL REQUIREMENTS ({{fr_count}})
──────────────────────────────────────
[ ] FR-001: {description}
[ ] FR-002: {description}
...

NON-FUNCTIONAL REQUIREMENTS ({{nfr_count}})
──────────────────────────────────────
[ ] NFR-001: {description} | Expected: {threshold}
[ ] NFR-002: {description} | Expected: {threshold}
...

ACCEPTANCE CRITERIA ({{ac_count}})
──────────────────────────────────────
[ ] AC-001: {description}
[ ] AC-002: {description}
...
```

### 5. Setup Test Environment

**For backend-only ({{test_type}} == "backend-only"):**

Identify from project context:
- Base API URL: {{base_url}}
- Authentication method (if any)
- Test credentials or seed command

**IF test credentials needed:**
- Look for test user credentials in project context
- OR identify seed command to create test data
- Document: "Using test user: {{test_user}} or running seed: {{seed_command}}"

**For frontend-e2e ({{test_type}} == "frontend-e2e"):**

Identify from project context:
- Frontend URL: {{frontend_url}}
- Test credentials for login
- Seed data requirements

**Prepare Playwright:**
- Verify Playwright MCP is available
- Note browser to use (chromium default)

### 6. Summary and Proceed

Output preparation summary:

```
**Validation Checklist Prepared**

Story: {{story_title}}
Test Type: {{test_type}}

Checklist Summary:
- Functional Requirements: {{fr_count}}
- Non-Functional Requirements: {{nfr_count}}
- Acceptance Criteria: {{ac_count}}
- TOTAL ITEMS TO TEST: {{total_count}}

Test Environment:
- URL: {{base_url}} / {{frontend_url}}
- Credentials: {{credential_status}}

Ready to begin validation loop...
```

### 7. Auto-Proceed to Validation

**This step auto-proceeds (no menu).**

Display: "**Proceeding to validation loop...**"

Immediately load, read entirely, then execute {nextStepFile}.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- ALL FRs extracted and numbered
- ALL NFRs extracted with thresholds
- ALL ACs extracted
- Complete checklist compiled
- Test environment identified
- Credentials/seed ready

### ❌ SYSTEM FAILURE:

- Missing any FR, NFR, or AC from story
- Checklist incomplete
- Test environment not verified
- Proceeding without complete preparation

**Master Rule:** Every testable item must be in the checklist before validation begins.
