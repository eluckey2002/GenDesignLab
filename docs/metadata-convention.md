# EDF Metadata Convention

Every EDF component file (pattern-maker, world, pressure, readout, outcome) must carry a 6-field metadata block. This is how agents classify, index, and reason about components without reading the full file.

**LLMs weight opening tokens disproportionately.** A file opening with metadata gets classified as a technical component on first parse. One opening with prose gets classified as creative output and that classification tends to persist.

---

## The 6 Fields

| Field | Required values | Purpose |
| ----- | --------------- | ------- |
| `type` | `pattern-maker`, `world`, `pressure`, `readout`, `outcome`, `spec`, `narrative`, `audit`, `glossary` | What role this file plays in the framework |
| `status` | `draft`, `working`, `stable`, `deprecated` | Maturity — agents treat `draft` as experimental |
| `audience` | One or more of: `agent`, `engineer`, `designer`, `researcher`, `reviewer` | Who should read this |
| `framework` | Always `emergent-design-framework` | Constant — scopes the component to this project |
| `component_id` | kebab-case, behavior-descriptive, ends with `-vN` | Unique identifier — see naming rules below |
| `depends_on` | List of other `component_id` values, or `[]` | Explicit dependency graph — keep accurate |

---

## Format by File Type

### JavaScript (`.js`)

```js
/**
 * @metadata
 * type: pattern-maker
 * status: working
 * audience: [agent, engineer]
 * framework: emergent-design-framework
 * component_id: branching-growth-v1
 * depends_on: [energy-scarcity-pressure-v1]
 */
```

Place immediately after any `"use strict"` declaration, before all imports.

### HTML (`.html`)

```html
<head>
  <meta name="framework:type"         content="world">
  <meta name="framework:status"       content="working">
  <meta name="framework:audience"     content="agent,designer">
  <meta name="framework:id"           content="emergent-design-framework">
  <meta name="framework:component_id" content="curved-substrate-v1">
  <meta name="framework:depends_on"   content="branching-growth-v1">
</head>
```

### CSS (`.css`)

```css
/*
 * @metadata
 * type: readout
 * status: draft
 * audience: [designer]
 * framework: emergent-design-framework
 * component_id: lineage-readout-v1
 * depends_on: []
 */
```

### Markdown (`.md`) — for specs, audits, narratives

```yaml
---
type: spec
status: stable
audience: [agent, researcher]
framework: emergent-design-framework
component_id: energy-scarcity-pressure-v1
depends_on: []
---
```

---

## `component_id` Naming Rules

The ID must describe the **behavior or function**, not the aesthetic experience.

**Good — behavior-descriptive:**
- `branching-growth-v1`
- `curved-substrate-v1`
- `energy-scarcity-pressure-v2`
- `lineage-readout-v1`
- `swarm-movement-v1`

**Bad — aesthetic/poetic:**
- `slow-frill-v1` ❌
- `pulse-v1` ❌
- `wake-v1` ❌
- `morph-v1` ❌

**Test:** Would a research engineer recognize this as a class of behavior, or does it sound like the title of a piece?

**Versioning:** Increment `-vN` only when the component's external API or behavior changes in a way that could break dependents. Internal refactors don't require a version bump. Document the reason for the version bump in the study document.

---

## `depends_on` Accuracy

This field is not decorative. CI uses it to trace dependency graphs and flag drift when depended-on components change.

- List every `component_id` this file references by import or API call
- Use `[]` (not blank, not `none`) when there are no dependencies
- When you add or remove a dependency, update this field in the same commit

---

## What Counts as a "Component File"

Files that must have metadata:
- Any `.js` file implementing a pattern-maker, world, pressure, readout, or outcome
- Any `.html` file that is a recipe demonstration or world entry point
- Any `.md` spec, audit, or narrative in `docs/knowledge-repo/` or `docs/studies/`

Files that do NOT need metadata:
- Utility helpers that are not EDF components (e.g., a `dom-utils.js` helper)
- Config files (`package.json`, `.eslintrc`, etc.)
- This file and other convention/process docs
- `README.md` files

**When in doubt, add it.** The overhead is 6 lines. The cost of missing metadata is misclassification.
