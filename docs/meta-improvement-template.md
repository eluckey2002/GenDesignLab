# Meta-Improvement PR Template

## What This Is

A meta-improvement PR touches **no product code**. It improves the agentic workflow itself: the contract files (CLAUDE.md, AGENTS.md, CODEBASE.md), CI rules, ADR system, PR template, session note conventions.

This template gives meta-PRs a structured protocol so they actually _improve_ the system rather than drifting it.

## When to Run a Meta-Improvement PR

Triggers — any one is enough, two or more is overdue:

- **Cadence:** 6–10 feature PRs have shipped since the last meta-PR
- **Friction:** You've seen the same agent failure mode in 3+ recent PRs
- **Discovery:** Session notes have accumulated patterns worth promoting to ADRs or CODEBASE.md
- **Drift:** ADRs or CLAUDE.md describe behavior that no longer matches reality
- **Template fatigue:** You catch yourself skipping or hand-waving sections of the PR template
- **CI noise:** Reminders are firing on things that aren't actually risks (false positives)
- **CI silence:** Real problems are slipping through that the bots should have caught

## The Five Activities

A meta-improvement PR walks all five in order. Skipping is fine — but _explicitly_ skip with a one-line "no findings" rather than silently dropping the activity.

### 1. Audit

**Question:** What has actually been happening in the agentic workflow since the last meta-PR?

Inputs to read:

- All `.claude/sessions/PR-*.md` notes since the last meta-PR
- The last 5–10 closed PRs — specifically the **Deferred / Declined**, **Confidence**, and **Drift Risk** sections
- Recent **Hey Claude —** comments from CI: which fired most? Which got ignored or worked around?
- Any new ADRs and their actual usage (touchpoints firing? being honored?)

Output: A short list of _observed patterns_, not opinions. Examples:

- "Agents marked Confidence: Verify on 4/7 recent PRs — what's making them uncertain?"
- "Drift Risk escape phrase used on 8/9 PRs — is the touchpoint detection too narrow?"
- "Session notes mention a gotcha 3 times — promote to CODEBASE.md Key Patterns?"

### 2. Cleanup

**Question:** What's stale, duplicated, or vestigial?

Targets:

- Stale ADR touchpoints (files that no longer exist, or paths that have moved)
- Dead session notes (covered by ADRs now, or obsoleted by later changes)
- Duplicated utility functions discovered during audit
- Deprecated patterns still mentioned in CLAUDE.md or CODEBASE.md
- Outdated entries in CODEBASE.md tables (file moved, component renamed)
- Unused CI logic (a check that has never failed in N PRs may be dead code)

Output: A list of files to update or delete, with one-line reasons.

### 3. Retrospective

**Question:** Where did the system bend, and where did it work?

Failure modes — name them specifically:

- CI false positives (reminders that fired but weren't real risks)
- CI false negatives (real problems that slipped through)
- Template sections that got hand-waved (instruction unclear? section value-low?)
- Sentinel phrases that got worked around (agents using "Verify" as a hedge)
- ADRs that got drift-flagged but weren't actually affected (touchpoint over-broad)

Wins — also name specifically:

- Reminders that caught real issues
- Sentinel phrases that forced a useful conversation
- ADRs that got correctly updated because the system surfaced them
- Patterns from session notes that propagated cleanly

Output: A two-column "what bent / what worked" list. Be honest about both.

### 4. Update

**Question:** What needs to be brought into alignment with reality?

This is mechanical work driven by audit + cleanup + retrospective findings:

- Refresh CLAUDE.md golden rules to match how you actually work now
- Refresh CODEBASE.md inventory to match the current file tree
- Update ADR statuses (mark superseded ADRs, update Invariants, refresh Touchpoints)
- Update session note format if you've found a better one
- Update the PR template if a section has proven low-value or a new section is needed

**Important:** Updates trigger drift-risk against multiple ADRs by design. That's the system noticing its own contract is changing. Verify each flagged ADR.

### 5. Improve

**Question:** What new mechanism would prevent the failure modes you found?

This is the creative step. Examples:

- New CI reminder for a pattern you noticed slipping
- New sentinel phrase for a section that's been hand-waved
- New either-or escape hatch where blank sections kept happening
- New ADR documenting a pattern that's emerged from multiple session notes
- New template section that surfaces a question agents keep missing

**Important:** Each improvement should connect back to a finding from steps 1–3. "Improve" without "Audit" is just adding rules nobody asked for.

## PR Body Format for Meta-Improvement PRs

Use the standard PR template, but in the **Summary** field write `META-IMPROVEMENT` as the first line, and structure the **Changes** section with the five-activity headings:

```markdown
## Summary

META-IMPROVEMENT — [one-line description]

## Changes

### Audit findings

- ...

### Cleanup

- ...

### Retrospective

- What bent: ...
- What worked: ...

### Updates

- ...

### Improvements

- ...
```

This makes meta-PRs visually distinct in the PR list and gives future-you a structured trail of how the system evolved.

## Label

Tag with `meta-improvement` (created by `gh-cli-bootstrap.md`). Filter the PR list by this label to see the system's evolution as a separate stream from feature work.
