# ADR-NNNN: Title

## Status

Proposed | Accepted | Superseded by [ADR-XXXX](./XXXX-title.md)

## Date

YYYY-MM-DD

## Context

What is the issue that we're seeing that motivates this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?

## Alternatives Considered

What other options were evaluated and why were they rejected?

---

## Agent-Specific Sections

### Invariants

Checkable statements that future agents MUST NOT break. Write these as assertions:

- [ ] Example: `package.json` has `"type": "module"` (ESM only)
- [ ] Example: No bundler config files exist at repo root

### Touchpoints

File paths that implement this decision. CI parses this section to detect drift — when a PR changes a file listed here, the change-reminders comment flags it. Use this exact format:

- `path/to/file.js` — description of relevance
- `path/to/directory/` — trailing slash for directory-level touchpoints

### Revisit Triggers

Conditions under which an agent should propose superseding this ADR:

- Example: "If the team decides to adopt a build step"
- Example: "If browser ESM support changes significantly"

### Related ADRs

- [ADR-XXXX](./XXXX-title.md) — relationship description
