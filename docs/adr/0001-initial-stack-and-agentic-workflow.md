# ADR-0001: Initial Stack and Agentic Workflow

## Status

Accepted

## Date

2026-05-07

## Context

<!--
  Why this project exists, what constraints shaped the initial choices.
  Be specific about: deployment target, primary user, autonomy level expected
  from agents, any pre-existing constraints (org standards, team familiarity).
-->

This is a port/rebuild of an existing generative design framework focused on emergent behaviors, deployed to GitHub Pages as a static site. The original system was built as quick single-page prototypes — fast to create, no overhead. The rebuild preserves that philosophy while adding structure for long-term agent-driven development. The repo needs to support autonomous Claude Code agents making PRs with high confidence. That requires:

- A conventional, well-tooled stack agents can reason about.
- Formatting enforcement so agent diffs are consistent.
- CI feedback that speaks directly to agents.
- Documentation that gives agents the constraints they need without reading every file.

## Decision

### Stack

- **Vanilla JavaScript** with ES modules, CSS custom properties, HTML5 semantic markup.
- **Prettier** for formatting.
- **ESLint** for linting.
- **npm** as the sole package manager.
- **GitHub Pages** for deployment (static files, no runtime).
- **No build step** — files are served directly without bundling or transpilation.

### Workflow

- **Linear history** on `main` (rebase-only, PRs required).
- **`CLAUDE.md`** as the project contract agents read on session start.
- **ADR system** with agent-specific sections (Invariants, Touchpoints, Revisit Triggers).
- **PR template** with an "Agent Instructions" section for human-to-agent directives.
- **CI workflow** that posts a sticky comment addressing agents directly on failures.

## Consequences

- Agents get a clear contract and fast feedback loop.
- Every PR runs lint and format check automatically.
- Formatting debates are eliminated — Prettier decides.
- No build tooling means simpler CI and zero compile-time complexity.
- New architectural decisions require an ADR, which adds process overhead but prevents knowledge loss.

## Alternatives Considered

- **React / component framework:** Rejected — adds build complexity, package overhead, and a required dev environment. The original prototypes were fast single-page files that ran directly in any browser; preserving that speed and simplicity is a core goal.
- **npm runtime dependencies:** Rejected — EDF must be openable directly by end users without running `npm install`. External dependencies introduce fragility and an installation barrier that conflicts with the "open in browser" invariant.
- **No ADR system:** Rejected — without it, agents lose context on prior decisions and re-evaluate from scratch each session.

---

## Agent-Specific Sections

### Invariants

- [ ] `package.json` exists at repo root with `"type": "module"` (ESM only)
- [ ] `main` branch has linear history (no merge commits)
- [ ] All code passes `npm run lint` and `npm run format:check`
- [ ] ADRs are required for architectural changes (see CLAUDE.md for triggers)
- [ ] npm is the only package manager (no other lockfiles)
- [ ] No bundler config files exist unless an ADR documents the decision
- [ ] All files open directly in a browser without a local server (`file://` compatible or served via simple static hosting — no dev server required)
- [ ] No runtime npm dependencies — end users must not need to run `npm install` to use EDF
- [ ] Module boundaries are protected — agents must not restructure module relationships unless explicitly tasked to do so, with documentation and approval

### Touchpoints

- `CLAUDE.md` — project contract for agents
- `package.json` — scripts, engines constraint, ESM declaration
- `.github/workflows/ci.yml` — CI pipeline
- `.github/pull_request_template.md` — PR template with Agent Instructions
- `docs/adr/` — architectural decision records

### Revisit Triggers

- GitHub Pages deprecates a feature this project depends on
- Team decides to adopt a build step or framework (requires superseding this ADR)
- Team decides to switch package managers
- ADR overhead becomes a bottleneck (simplify the template)
- Browser ESM support changes in a way that affects the no-build approach
- The generative/emergent system needs capabilities only achievable with a build step (e.g., WASM, shader compilation)
- Module count grows to the point where manual ESM management becomes untenable — at that point evaluate a lightweight bundler via ADR
- The modular architecture is formally specified — that definition should produce its own ADR and may revise the invariants here

### Related ADRs

_None yet — this is the seed ADR._
