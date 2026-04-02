---

# No nextStepFile - this is the final step
---

# Step 5: Update Story and Sprint Status

## STEP GOAL:

To document the QA Review findings in the story file, update the story status, and synchronize the sprint-status.yaml tracking file.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER skip updating the story or sprint-status
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A QA ENGINEER completing the review process
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- 💾 PRESERVE existing content when editing files

### Role Reinforcement:

- ✅ You are a QA Engineer finalizing documentation
- ✅ Accurate record-keeping is essential
- ✅ Clear communication of outcomes

### Step-Specific Rules:

- 🎯 Focus ONLY on updating files with QA Review results
- 🚫 FORBIDDEN to modify test results - only document them
- 💾 Preserve ALL existing story content
- 📝 Add QA Review section, update Status field

## EXECUTION PROTOCOLS:

- 🎯 Update story with {{qa_review_section}}
- 💾 Update story Status to {{new_status}}
- 📖 Sync sprint-status.yaml
- 🚫 This is the FINAL step - complete the workflow

## CONTEXT BOUNDARIES:

- Available: {{qa_review_section}} from step-04
- Available: {{new_status}} from step-04
- Available: {{story_path}}, {{story_key}} from step-01
- Target: story file and sprint-status.yaml

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Load Current Story

Read the COMPLETE story file at {{story_path}}.

Preserve ALL existing content.

### 2. Add/Update QA Review Section

**IF "## QA Review" section exists:**
- Replace the existing section with {{qa_review_section}}

**IF "## QA Review" section does NOT exist:**
- Add {{qa_review_section}} after "## Code Review Findings" (if exists)
- OR add at the end of the story before any changelog

### 3. Update Story Status Field

Find the Status field in story frontmatter or header.

Update: `Status: {{new_status}}`

**Valid status values:**
- `done` - Story completed, all validations passed or only non-blocking issues
- `in-progress` - Story needs corrections, blocking issues found

### 4. Update Story Change Log

**IF story has a Change Log section:**

Add entry:
```markdown
| {{date}} | QA Review | {{decision}} - Status → {{new_status}} |
```

### 5. Save Story File

Write the updated story file, preserving:
- All original content
- Formatting and structure
- Other sections unchanged

Confirm: "✅ Story updated with QA Review section. Status: {{new_status}}"

### 6. Check Sprint Status Tracking

Look for sprint-status.yaml at: {{sprint_status_path}}

**IF file exists:**
- Set {{sprint_tracking}} = "enabled"
- Proceed to step 7

**IF file does NOT exist:**
- Set {{sprint_tracking}} = "disabled"
- Output: "⚠️ Sprint status file not found. Skipping sprint sync."
- Proceed to step 8

### 7. Update Sprint Status (If Enabled)

Load the COMPLETE sprint-status.yaml file.

Find the story entry by {{story_key}} in `development_status` section.

**Update the status:**

```yaml
development_status:
  # ... other stories ...
  {{story_key}}: {{new_status}}  # Updated by QA Review
```

**PRESERVE:**
- All comments in the file
- All other entries
- File structure and formatting

Save sprint-status.yaml.

Confirm: "✅ Sprint status synced: {{story_key}} → {{new_status}}"

### 8. Present Final Summary

**This is the FINAL step - present completion summary:**

```
════════════════════════════════════════════════════════════
                  QA REVIEW COMPLETE
════════════════════════════════════════════════════════════

Story: {{story_title}}
File: {{story_path}}

VALIDATION RESULTS
──────────────────
Total Tested: {{total_tested}}
Passed: {{passed_count}}
Failed: {{failed_count}} ({{blocking_count}} blocking, {{non_blocking_count}} non-blocking)

DECISION: {{decision}}

UPDATES MADE
────────────
✅ Story file updated with QA Review section
✅ Story status updated: {{new_status}}
{{if sprint_tracking == "enabled"}}
✅ Sprint status synced: {{story_key}} → {{new_status}}
{{else}}
⚠️ Sprint status: Not configured (skipped)
{{/if}}

{{if new_status == "done"}}
────────────────────────────────────────────────────────────
🎉 STORY COMPLETE - Ready for release!
{{if non_blocking_count > 0}}
   Note: {{non_blocking_count}} non-blocking issues documented for tracking.
{{/if}}
────────────────────────────────────────────────────────────
{{/if}}

{{if new_status == "in-progress"}}
────────────────────────────────────────────────────────────
🔧 CORRECTIONS REQUIRED

{{blocking_count}} blocking issue(s) must be fixed:
{{for each blocking issue}}
  • {{item_id}}: {{brief_description}}
{{/for}}

Next Steps:
1. Developer fixes blocking issues
2. Run code-review again (optional)
3. Run qa-review again to validate fixes
────────────────────────────────────────────────────────────
{{/if}}

════════════════════════════════════════════════════════════
```

### 9. Workflow Complete

**No menu - workflow ends here.**

The QA Review workflow is complete.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Story file updated with complete QA Review section
- Story status correctly updated to {{new_status}}
- Sprint status synced (if file exists)
- All changes preserved existing content
- Clear final summary presented

### ❌ SYSTEM FAILURE:

- Story not updated
- Status field not changed
- Existing content lost or corrupted
- Sprint status not synced when file exists
- Incomplete summary

**Master Rule:** All documentation must be updated accurately. The QA Review record is the official quality checkpoint.
