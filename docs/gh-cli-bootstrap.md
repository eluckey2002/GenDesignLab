# GitHub CLI Bootstrap

One-time commands to configure the GitHub side of the repo after the agentic-project-init skill has stamped the files.

**Run these manually.** The skill stamps files; you run the GitHub configuration. This separation keeps the skill from needing GitHub auth or org-level permissions.

## Prerequisites

- [`gh` CLI](https://cli.github.com/) installed and authenticated (`gh auth login`)
- The repo exists on GitHub and you've pushed the initial commit
- You have admin access to the repo

## 1. Branch Protection on `main`

Required PRs, linear history, up-to-date check, and the CI `checks` job as a required status check:

```bash
gh api -X PUT repos/eluckey2002/GenDesignLab/branches/main/protection \
  -F required_status_checks.strict=true \
  -F required_status_checks.contexts[]="checks" \
  -F enforce_admins=false \
  -F required_pull_request_reviews.required_approving_review_count=0 \
  -F required_pull_request_reviews.dismiss_stale_reviews=false \
  -F required_pull_request_reviews.require_code_owner_reviews=false \
  -F required_linear_history=true \
  -F allow_force_pushes=false \
  -F allow_deletions=false \
  -F restrictions=
```

**Notes:**

- `required_approving_review_count=0` because solo / agent-driven repos don't need human approval; CI is the gate. Bump to `1` if you have a team that should review.
- `enforce_admins=false` lets you bypass in genuine emergencies. Set `true` if you want zero exceptions.
- `restrictions=` (empty) means no user/team restriction on who can push to PRs.

## 2. Repo Settings

Squash merge only, with PR title and body as the squash defaults:

```bash
gh api -X PATCH repos/eluckey2002/GenDesignLab \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=false \
  -F squash_merge_commit_title=PR_TITLE \
  -F squash_merge_commit_message=PR_BODY \
  -F delete_branch_on_merge=true \
  -F allow_auto_merge=true
```

**Notes:**

- `squash_merge_commit_message=PR_BODY` lets the agent's "Suggested Squash Commit Message" body show up as the squash default — copy-paste-friendly.
- `delete_branch_on_merge=true` keeps the branch list clean.
- `allow_auto_merge=true` lets you queue auto-merge once CI passes.

## 3. Labels (Optional)

Standard label set for triage:

```bash
gh label create "agent-pr"          -c "#5319e7" -d "PR created by a Claude Code agent"
gh label create "meta-improvement"  -c "#0e8a16" -d "Improves the agentic workflow itself, not product code"
gh label create "needs-adr"         -c "#fbca04" -d "Reviewer thinks this PR should add or update an ADR"
gh label create "drift-detected"    -c "#d93f0b" -d "CI flagged ADR touchpoint overlap; verify ADRs"
```

## 4. Verify

```bash
# Branch protection should show all the rules above
gh api repos/eluckey2002/GenDesignLab/branches/main/protection | jq '.'

# Repo settings should show squash-only with PR_BODY default
gh api repos/eluckey2002/GenDesignLab | jq '{squash: .allow_squash_merge, merge: .allow_merge_commit, rebase: .allow_rebase_merge, squash_msg: .squash_merge_commit_message, delete: .delete_branch_on_merge}'
```

## 5. Test the Full Loop

The fastest way to verify everything works is to ship one trivial PR through the system:

1. Create a feature branch: `git checkout -b test/loop-check`
2. Make a tiny edit (e.g., add a sentence to README.md)
3. Push and create a PR via `gh pr create` — the template should populate
4. Fill in the visible sections; uncomment the agent reflection block
5. Wait for the three sticky comments to appear (CI Summary, PR Validation, Change Reminders)
6. If anything is off, fix it in this PR — that's the meta-improvement loop in action

If the three stickies don't appear, the most common causes are:

- Workflow file has a syntax error → check Actions tab
- `pull-requests: write` permission missing → already set in the workflow
- Repo doesn't allow Actions to comment on PRs → Settings → Actions → General → Workflow permissions
