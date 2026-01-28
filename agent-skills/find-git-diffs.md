# Skill: find-diffs

## Purpose
Find and present **all version control diffs for the current branch**, including:
- committed changes on the branch (relative to a chosen base branch)
- staged (indexed) changes not yet committed
- unstaged working-tree changes
- untracked files (listed, since `git diff` won’t show their content by default)

Use this skill any time an agent needs to understand “what changed in this branch.”

---


## When to use
- Before reviewing, testing, refactoring, or generating release notes for a branch
- When a user says “what changed?” / “show me the diff” / “what do I need to review?”
- Before creating or updating a PR/MR description

---

## Commands (run in this order)

### 1) Fetch latest remote refs
```bash
git fetch
```

### 2) Diff the feature branch against the target branch (feature-only changes)

Use three-dot syntax (compare feature branch changes that are not in target branch):

```bash
git diff master...HEAD
```


### 3) If changes might not yet be staged or committed (local-only)

Unstaged changes:

```bash
git diff
```

Staged (indexed) but not committed:

```bash
git diff --cached
```

