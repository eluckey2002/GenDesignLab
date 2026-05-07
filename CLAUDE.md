@AGENTS.md

# Emergence Design Framework (EDF) — Project Contract for Claude Code

## Tech Stack

- **Language:** JavaScript (ES modules, no build step)
- **Styling:** CSS (custom properties, no preprocessor)
- **Markup:** HTML5 (semantic)
- **Linting:** ESLint
- **Formatting:** Prettier
- **Package manager:** npm
- **Deployment:** Static hosting (GitHub Pages)
- **Testing:** None yet

## Pre-Push Checklist

Run both commands before pushing. All must exit 0:

```bash
npm run lint
npm run format:check
```

## Golden Rules

1. **No secrets in the repo.** `.env*` is gitignored. Use deployment-platform secret management.
2. **No bundlers or transpilers without an ADR.** This is a no-build-step project. Do not introduce Webpack, Vite, esbuild, Babel, or similar without a documented decision.
3. **No TypeScript without an ADR.** Vanilla JS only. Use JSDoc annotations if types are needed for tooling.
4. **ADR required for architectural changes.** See "ADR Triggers" below.
5. **Linear history on `main`.** Rebase-only workflow. See `docs/branch-protection.md`.
6. **Prettier is enforced.** All code must pass `format:check`.
7. **Every module/recipe file must carry the 6-field metadata block.** No file enters the repo without `type`, `status`, `audience`, `framework`, `component_id`, and `depends_on`. See `docs/metadata-convention.md`.
8. **Glossary is the naming source of truth.** All `component_id` values and vocabulary must come from `docs/glossary.md`. Whimsical or aesthetic names (`pulse-v1`, `wake-v1`) are prohibited — use behavior-descriptive names (`chaotic-attractor-v1`, `energy-scarcity-pressure-v1`).
9. **Module boundaries are clean.** Each module owns its own business logic. One module must not reach into another's internals without an explicit API surface.
10. **New modules and recipe modifications require scientific documentation.** Before a PR that adds a new pattern-maker/world/pressure/readout is merged: fill `docs/studies/` study template. After the work is done: fill the findings/post-mortem section. See `docs/study-template.md`.

## Testing

No test runner is currently configured. When tests are introduced, write an ADR documenting the runner and conventions before adding test files.

### Principles (for when tests are added)

1. **Co-locate tests with source.** `src/lib/foo.js` → `src/lib/foo.test.js`.
2. **Test behavior, not implementation.** Assert what a function returns, not internal state.
3. **No snapshot tests.**
4. **Every module with logic gets a test.**
5. **Don't test the platform.** Test YOUR code.
6. **Test the unhappy path.** Cover error cases and edge cases.
7. **No coverage thresholds.** Coverage % creates bad incentives.
8. **Run tests in CI and pre-push** (once a runner is configured).

### File Naming

- Unit tests: `*.test.js` (co-located next to source)

## Branch Workflow

See `docs/branch-protection.md` for the full ruleset and merge conflict runbook.

- `main` is protected: PRs required, linear history, must be up-to-date before merge.
- Feature branches → PR → squash merge to `main`.
- Rebase, never merge: `git rebase origin/main`, then `git push --force-with-lease`.

## CI Feedback

The CI workflow posts three sticky comments on every PR:

1. **CI Summary** — lint and format check results.
2. **PR Validation** — checks that agent PRs have properly filled-out reflection sections and no Golden Rule violations. Hard fail.
3. **Change Reminders** — advisory notes about files you changed. Not blocking.

- **When a comment addresses "Hey Claude —"**, treat the failures listed as direct instructions to fix.
- Fix the issues, commit, and push. Comments auto-update on each push.

## Creating PRs

When you create a PR:

1. Fill in all visible sections (Summary, Changes, Test Plan, ADR Impact).
2. **Uncomment and fill the Agent Reflection sections** (below the `AGENT REFLECTION` marker). Remove the `<!-- -->` wrappers so the content renders.
3. In **Task Fidelity**: quote the original task verbatim under "Task as Given" — do not paraphrase. Describe what you built under "Task as Delivered". Be honest about the delta.
4. In **Deferred / Declined**: list anything you considered but chose not to do. "Nothing deferred" is valid but think first.
5. In **Confidence**: pick a rating. If 🟡 or 🔴, you MUST list specific uncertain areas with file paths.
6. In **Drift Risk**: check if files you changed appear as touchpoints in any ADR (`docs/adr/`). For each affected ADR, verify its invariants still hold and note whether you updated or confirmed it. CI will flag touchpoint overlaps automatically, but semantic drift requires your judgment.
7. Check **Session Hygiene** boxes only if you actually performed each step.
8. In **Suggested Squash Commit Message**: write a copy-pasteable commit message for the repo owner. Title line under 72 chars with PR number, blank line, bulleted body summarizing the changes.
9. After creating the PR, **subscribe to PR activity** so you receive review comments and CI results. You are responsible for responding to review comments on PRs you create. Do not create a PR and walk away.
10. **Never merge your own PR.** Only the repo owner squashes and merges to `main`.

## PR Takeover

When taking over an existing PR:

1. Read the **"Agent Instructions"** section in the PR description first.
2. Follow any constraints listed there (e.g., "autofix lint only", "do not touch src/lib/auth/**").
3. If no Agent Instructions section exists, proceed with standard judgment.

## ADR Triggers

Write a new ADR in `docs/adr/` when any of these happen:

- Adding a new top-level dependency
- Introducing a build tool, bundler, or transpiler
- Introducing TypeScript
- Adding a test runner or testing framework
- Changing directory structure conventions
- Modifying CI/CD pipeline behavior
- Changing the metadata convention (6-field block format or required fields)
- Changing the 5-category taxonomy (pattern-maker / world / pressure / readout / outcome)

**Recipe definitions and modifications are NOT ADR triggers.** New recipes and component work are documented as studies in `docs/studies/`. If a study's findings produce changes to module structure, boundaries, or cross-module APIs — that specific change may trigger an ADR.

Use the template at `docs/adr/template.md`. Update the index at `docs/adr/README.md`.

## Framework Reference

- **Core concepts, recipe formula, vocabulary:** `docs/framework-concepts.md` — read this before working in the codebase
- **Canonical glossary (naming source of truth):** `docs/glossary.md`
- **Metadata convention (6-field block):** `docs/metadata-convention.md`
- **Study protocol (hypothesis + findings):** `docs/study-template.md`

## Session Notes

Session notes capture discoveries, dead ends, and codebase gotchas that don't fit in ADRs or code comments. They are the "lab notebook" of the repo.

- **Before starting work**, check `.claude/sessions/` for notes related to your area.
- **When creating a PR**, write a session note at `.claude/sessions/PR-<number>.md` if you discovered anything non-obvious. See `.claude/sessions/README.md` for the format.
- Not every PR needs a session note. Skip it if you have nothing to report.

## Codebase Map

`CODEBASE.md` is the quick-orientation file. It describes what exists so you don't need to scan the file tree.

- **Read `CODEBASE.md` at session start** alongside this file. It tells you _what exists_; this file tells you _how to behave_.
- **When creating a PR that adds, removes, or moves source files**, update `CODEBASE.md` to reflect the change.
- **Deferred items in session notes are context, not your task.** Your task comes from the current prompt.
- **Verify local is current with remote before starting.** Run `git fetch origin main` and check if local main is behind.

## Meta-Improvement Cadence

Periodically (every 6–10 feature PRs, or when friction accumulates), pause feature work and ship a meta-improvement PR. This PR touches no product code — only the agentic workflow itself.

See `docs/meta-improvement-template.md` for the five-activity protocol: **audit → cleanup → retrospective → update → improve**.
