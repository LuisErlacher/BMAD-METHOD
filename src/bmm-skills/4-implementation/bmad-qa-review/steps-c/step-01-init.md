---

nextStepFile: './step-02-prepare.md'
workflowYaml: '../workflow.md'
checklistFile: '../checklist.md'
---

# Step 1: Initialize QA Review

## STEP GOAL:

To load the story and project context, identify the test type (backend/frontend), and verify the application is ready for testing.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER skip any validation or check
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A QA ENGINEER executing systematic validation
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL FALLBACK: If any tool is unavailable, document limitation and continue

### Role Reinforcement:

- ✅ You are a QA Engineer / Test Specialist
- ✅ You bring testing expertise and systematic validation
- ✅ Direct and objective communication
- ✅ Focus on quality and completeness

### Step-Specific Rules:

- 🎯 Focus ONLY on initialization and setup
- 🚫 FORBIDDEN to start testing yet - that's step-03
- 💬 Verify all prerequisites before proceeding
- 🚪 If prerequisites fail, STOP and report to user

## EXECUTION PROTOCOLS:

- 🎯 Load story and context systematically
- 💾 Store test_type and story_data for subsequent steps
- 📖 Verify application is testable
- 🚫 Do not proceed if critical prerequisites fail

## CONTEXT BOUNDARIES:

- This is the FIRST step - sets up everything
- Need: story_path (provided or ask user)
- Need: project context for testing standards
- Produce: test_type, story_data for next steps

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Obtain Story Path

**IF story_path was provided in workflow invocation:**
- Use the provided path

**IF story_path was NOT provided:**
- Ask user: "Which story would you like to QA review? Please provide the path to the story file."

### 2. Load and Parse Story

Read the COMPLETE story file at {{story_path}}.

Parse and extract:
- **Story metadata** (title, status, epic reference)
- **Story Key** from filename (e.g., "1-2-user-auth.md" → "1-2-user-auth")
- **Functional Requirements (FRs)** - look for FR sections or requirements
- **Non-Functional Requirements (NFRs)** - performance, security, etc.
- **Acceptance Criteria (ACs)** - the AC checklist
- **Tasks/Subtasks** - implementation details
- **File List** - files that were changed/created

Store as {{story_data}}.

### 3. Verify Story Status

Check the story's Status field.

**IF status == "qa-review":**
- ✅ Proceed normally

**IF status != "qa-review":**
- ⚠️ Warning: "Story status is '{{status}}', expected 'qa-review'."
- Ask: "Do you want to proceed anyway? [Y/N]"
- IF N: Stop workflow
- IF Y: Continue with warning noted

### 4. Load Project Context

Search for and load project context file:
- Pattern: `**/project-context.md`
- Contains: testing standards, credentials, URLs, patterns

**IF found:**
- Load and parse for testing configuration
- Extract: base URLs, test credentials location, seed commands

**IF not found:**
- ⚠️ Warning: "Project context not found. Testing will proceed with defaults."

### 5. Identify Test Type

Analyze the story content to determine test type:

**Indicators for BACKEND ONLY:**
- Changes only to: API routes, services, database, middleware
- No UI components, no frontend files
- Keywords: API, endpoint, service, repository, database

**Indicators for FRONTEND / E2E:**
- Changes to: components, pages, UI elements, styles
- User-facing features mentioned
- Keywords: UI, component, page, button, form, display

**Set {{test_type}}:**
- "backend-only" - Will use cURL for API testing
- "frontend-e2e" - Will use Playwright for E2E testing (includes backend)

Output: "**Test Type Identified:** {{test_type}}"

### 6. Verify Application Running

**For backend-only:**
- Check if API server is accessible
- Try: `curl -s -o /dev/null -w "%{http_code}" {{base_url}}/health` or similar
- IF accessible: ✅ "Backend server is running"
- IF not accessible: ❌ "Backend server not responding. Please start the application."

**For frontend-e2e:**
- Check if frontend is accessible
- Try: `curl -s -o /dev/null -w "%{http_code}" {{frontend_url}}`
- IF accessible: ✅ "Frontend application is running"
- IF not accessible: ❌ "Frontend not responding. Please start the application."

**IF application not running:**
- Provide instructions to start
- Wait for user confirmation before proceeding

### 7. Summary and Proceed

Output initialization summary:

```
**QA Review Initialized**

Story: {{story_title}}
Story Key: {{story_key}}
Status: {{story_status}}
Test Type: {{test_type}}

Requirements Found:
- FRs: {{fr_count}}
- NFRs: {{nfr_count}}
- ACs: {{ac_count}}

Application: ✅ Running

Proceeding to test preparation...
```

### 8. Auto-Proceed to Next Step

**This step auto-proceeds (no menu).**

Display: "**Proceeding to test preparation...**"

Immediately load, read entirely, then execute {nextStepFile}.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Story loaded and parsed completely
- Status verified (or warning acknowledged)
- Project context loaded (or warning noted)
- Test type identified (backend-only or frontend-e2e)
- Application verified as running
- All data stored for subsequent steps

### ❌ SYSTEM FAILURE:

- Story file not found and user doesn't provide valid path
- Application not running and user doesn't start it
- Cannot parse story to extract FRs/NFRs/ACs
- Skipping verification steps

**Master Rule:** Complete initialization is required before testing can begin.
