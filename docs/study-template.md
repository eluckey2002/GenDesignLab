# Module / Recipe Study Template

Every PR that introduces a new pattern-maker, world, pressure, or readout — or meaningfully modifies an existing one — must produce a study document in `docs/studies/`. Copy this template to `docs/studies/COMPONENT_ID.md` and fill both sections.

The study has two phases:

- **Pre-work (Hypothesis):** Written _before_ implementation. Forces you to define what you expect to happen.
- **Post-mortem (Findings):** Written _after_ the PR is done. Records what actually happened, what broke, and what generalizes.

---

## Part 1 — Hypothesis (fill before implementing)

### Component

```
component_id: <kebab-case-behavior-description-vN>
type: pattern-maker | world | pressure | readout
status: draft
```

### What This Does

_One sentence: what behavior does this component produce or enable?_

### Recipe Context

_Which recipe formula does this fit into?_

```
Pattern-maker:
World:
Pressure:
Readout:
→ Expected emergent behavior:
```

### Hypothesis

_What do you expect to observe when this runs? Be specific — name the visual or behavioral output you're predicting._

### Portability Claim

_Is this component designed to be portable (runnable in at least two distinct worlds)? If yes, what second world will you test it in?_

- [ ] Portability target: **\*\***\_\_\_**\*\***
- [ ] Portability test is included in this PR / planned for next PR

### Invariants This Component Must Preserve

_List the constraints this component must not violate. Cross-reference ADRs if relevant._

- [ ]
- [ ]

### Unknowns / Risks

_What are you uncertain about? What could break the hypothesis?_

---

## Part 2 — Findings (fill after the PR is done)

### What Actually Happened

_Describe the observed behavior. How does it compare to the hypothesis?_

### Hypothesis Verdict

- [ ] **Confirmed** — output matched prediction
- [ ] **Partially confirmed** — matched in X, diverged in Y
- [ ] **Refuted** — describe what happened instead

### Surprises

_Anything unexpected, non-obvious, or worth flagging for future agents?_

### Dead Ends

_Approaches tried that didn't work, and why. Future agents should not repeat these._

### Generalizable Rules

_Did this work surface a principle that applies beyond this specific component? If yes, propose it as a golden rule addition via meta-improvement PR._

### Portability Result

_If portability was tested: did the component run cleanly in the second world without modification? If not, what had to change and why?_

### Cache / Debug Notes

_Any cache markers, version tags, or debugging lessons specific to this session._

### Promote to CODEBASE.md?

- [ ] New Key Pattern discovered — add to `CODEBASE.md → Key Patterns`
- [ ] New module documented — update `CODEBASE.md` tables
