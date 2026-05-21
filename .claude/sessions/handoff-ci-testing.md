# Agent Handoff — CI Check Verification

## Date
2026-05-21

## Why This Document Exists
The agentic workflow methodology for EDF was just stamped into this repo in a single session. The CI checks are the enforcement backbone — they're what keeps the codebase high quality and ensures standards and best practices are actually followed, not just documented. Before this methodology is used in real feature work, every check needs to be verified end-to-end.

**Your job: test every CI check. Make them fail intentionally. Confirm they catch what they're supposed to catch. Fix anything that misfires.**

---

## Current State

### Branch
`feat/agentic-workflow-init` — local only, not yet pushed. The previous agent hit a 403 on push (credential mismatch: `evan-firebrand` vs `eluckey2002`). You need to resolve this before testing.

```bash
# Check which credential is active
gh auth status

# If wrong account, re-authenticate
gh auth login

# Then push
cd C:/Users/eluck/CoWorkPrrojcets/NewMath/NewSystem/.claude/worktrees/stupefied-kalam-589e2c
git push -u origin feat/agentic-workflow-init
```

### What Was Built (18 files in one commit)
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project contract — 10 golden rules, 4 EDF-specific |
| `AGENTS.md` | Agent source-of-truth redirect for vanilla JS |
| `CODEBASE.md` | Orientation map |
| `.github/pull_request_template.md` | PR form with Study field + agent reflection |
| `.github/workflows/ci.yml` | **The thing you are testing** — 3 jobs |
| `docs/adr/0001-...md` | Seed ADR |
| `docs/glossary.md` | EDF canonical vocabulary |
| `docs/framework-concepts.md` | Recipe formula, portability principle |
| `docs/metadata-convention.md` | 6-field block spec |
| `docs/study-template.md` | Hypothesis + findings template |
| `docs/studies/README.md` | Studies index |
| `docs/branch-protection.md` | Rebase runbook |
| `docs/gh-cli-bootstrap.md` | One-time GitHub setup commands |
| `docs/meta-improvement-template.md` | 5-activity meta-PR protocol |
| `.claude/sessions/README.md` | Session notes format |

### Repo
`https://github.com/eluckey2002/GenDesignLab`

---

## Your Task: Test Every CI Check

The CI has **3 jobs**. Each job has multiple checks. Test them by creating deliberate test PRs — make them fail, confirm the right message appears, then fix and confirm clean pass.

Use the branch naming convention: `test/<check-name>`.

---

## Job 1: `checks` — Lint and Format

**What it does:** Runs `npm run lint` and `npm run format:check`. Posts a sticky "Hey Claude —" comment if either fails. Hard fails the PR.

### Test 1a — Lint failure
1. Create `test/lint-check` branch
2. Add a `.js` file with a lint error (e.g., `var x = 1` if `no-var` is configured, or an unused variable)
3. Open PR
4. Expected: sticky comment listing `` `npm run lint` `` as failed

### Test 1b — Format failure
1. Create `test/format-check` branch
2. Add a `.js` file with bad formatting (wrong indentation, missing semicolons — whatever Prettier would flag)
3. Open PR
4. Expected: sticky comment listing `` `npm run format:check` `` as failed

### Test 1c — Clean pass
1. Add a properly linted and formatted `.js` file
2. Expected: "✅ All checks passed" sticky comment

---

## Job 2: `pr-validation` — Golden Rules + PR Description + Study File

**What it does:** Validates golden rule violations (bash script) and PR description structure (GitHub Script). Hard fails. Posts sticky "Hey Claude —" comment with a checklist of issues.

### Test 2a — Golden rule: bundler config
1. Add `webpack.config.js` to a PR
2. Expected: violation "No bundlers without an ADR — `webpack.config.js` requires an ADR"

### Test 2b — Golden rule: TypeScript
1. Add a `.ts` file
2. Expected: violation "No TypeScript without an ADR"

### Test 2c — Golden rule: .env file
1. Add a `.env` file (not `.env.example`)
2. Expected: violation "No secrets in the repo"

### Test 2d — Agent PR with uncommented reflection
1. Open a PR with `## Task Fidelity` visible (uncommented) and all required sections filled
2. Expected: "PR Validation Passed ✅"

### Test 2e — Agent PR with reflection still commented out
1. Include `## Task Fidelity` in a comment block `<!-- -->`
2. Expected: fail "Agent Reflection sections are still inside HTML comments"

### Test 2f — Missing required heading
1. Uncomment reflection but delete one heading (e.g., remove `### Delta`)
2. Expected: fail "Missing required heading: 'Delta'"

### Test 2g — Study file listed but missing
1. Put `docs/studies/test-component-v1.md` in the Study section of the PR
2. Do NOT create that file
3. Expected: fail "Study file `docs/studies/test-component-v1.md` listed in the PR does not exist"

### Test 2h — Study file listed and exists
1. Put `docs/studies/test-component-v1.md` in the Study section
2. Create that file (even a stub is fine)
3. Expected: study check passes

### Test 2i — Study "Not applicable"
1. Write "Not applicable" in the Study section
2. Expected: study check passes silently

---

## Job 3: `change-reminders` — Advisory Warnings (Non-blocking)

**What it does:** Analyzes changed files and posts advisory reminders. Does NOT fail the PR. Posts a sticky "Change-Aware Reminders" comment.

### Test 3a — Large PR
1. Make a change that adds/removes >500 lines
2. Expected: "📏 Large PR detected"

### Test 3b — New npm dependency
1. Add a dependency to `package.json` (e.g., `"lodash": "^4.17.21"`)
2. Expected: "📝 ADR trigger: new dependency detected"

### Test 3c — CI workflow changed
1. Modify `.github/workflows/ci.yml`
2. Expected: "🏗️ CI pipeline changed — this is an ADR trigger"

### Test 3d — Agent contract changed
1. Modify `CLAUDE.md` or `AGENTS.md`
2. Expected: "🤖 Agent contract changed"

### Test 3e — New .js file without `component_id`
1. Add a new `.js` file that does NOT contain `component_id` anywhere
2. Expected: "🏷️ New file without metadata block: `<filename>`"

### Test 3f — Existing .js file with metadata modified
1. Modify an existing `.js` file that has `component_id:` in it — change the value
2. Expected: "🏷️ Metadata changed in `<filename>` — was this intentional?"

### Test 3g — New source files without CODEBASE.md update
1. Add a new `.js` or `.html` file but do NOT touch `CODEBASE.md`
2. Expected: "🗺️ CODEBASE.md not updated"

### Test 3h — ADR touchpoint drift
1. Modify `CLAUDE.md` (it's a touchpoint in ADR-0001)
2. Expected: "🔗 ADR drift risk — changed files match ADR touchpoints" → ADR-0001

### Test 3i — ADR modified without updating README index
1. Modify `docs/adr/0001-...md` but do NOT modify `docs/adr/README.md`
2. Expected: "📚 ADR modified — did you update the ADR index?"

---

## Success Criteria

Every check must:
1. **Fire** when the condition it guards against is present
2. **Stay silent** when the condition is absent (no false positives)
3. **Use the right severity** — hard fail for golden rules and missing study files, advisory for reminders

Document your findings in `.claude/sessions/PR-<number>.md` after the test PR closes.

---

## After Testing

If any check misfires (false positive or false negative), fix it in `.github/workflows/ci.yml` and amend the test PR or open a follow-up `feat/ci-fixes` PR.

Once all checks are verified, the methodology is ready for real feature work.

---

## Context: Why These Checks Exist

EDF has unusually high documentation and process rigor because:
- The framework is scientific — every component addition is a hypothesis, not just a code change
- Agent sessions are stateless — the CI is the memory that enforces continuity across sessions
- The metadata convention is load-bearing — it's how agents classify components on first parse
- Portability claims need tracking — the study system is what makes "this component ports" a verifiable statement, not an assumption

The CI is not bureaucracy. It's the mechanism that makes the framework's scientific claims checkable.
