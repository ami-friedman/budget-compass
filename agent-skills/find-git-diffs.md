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

## Inputs to request from the user
Ask **what branch to compare against**.

Offer common options:
- `main`
- `master`
- another branch name the user provides

If the user doesn’t know, suggest:
- compare against `main` if it exists, otherwise `master`

**User prompt:**
> What branch should I compare against? (common options: `main`, `master`, or another branch)

---

## Procedure

### 1) Confirm we’re in a git repo + identify current branch
Run:
```bash
git rev-parse --is-inside-work-tree
git branch --show-current
```

If not inside a git repo, stop and report that.

---

### 2) Fetch latest remote refs (safe read-only update)

Run:

```bash
git fetch --all --prune
```

Notes:

* This updates remote-tracking branches (e.g., `origin/main`) without changing local files.
* Fetching `--all` covers non-`origin` remotes too.

---

### 3) Resolve the comparison base ref

Given the user’s base branch choice (e.g., `main`), prefer remote-tracking first.

Use this resolution order:

1. `origin/<base>`
2. `<base>`

Verify existence (replace `<base>` accordingly):

```bash
git show-ref --verify --quiet "refs/remotes/origin/<base>" && echo "found origin/<base>"
git show-ref --verify --quiet "refs/heads/<base>" && echo "found <base>"
```

If neither exists:

1. list available branches
2. ask the user to choose an existing base

```bash
git branch -a
```

Set `<base_ref>` to the resolved ref (e.g., `origin/main`).

---

### 4) Show a quick, high-signal summary first

Run:

```bash
git status --porcelain=v1
git diff --stat <base_ref>
```

Interpretation:

* `git status --porcelain=v1` shows staged/unstaged/untracked succinctly
* `git diff --stat <base_ref>` summarizes file-level changes vs the base

---

### 5) Show the full diff vs the base (includes local uncommitted edits)

Run:

```bash
git diff <base_ref>
```

If output is huge, pivot to these first:

```bash
git diff --name-only <base_ref>
git diff --stat <base_ref>
```

Then narrow by path:

```bash
git diff <base_ref> -- path/to/folder
git diff <base_ref> -- path/to/file
```

---

### 6) Show staged-only diff vs the base (important for review)

Run:

```bash
git diff --cached <base_ref>
```

This separates what’s already staged from what remains only in the working tree.

---

### 7) Call out untracked files explicitly

Untracked files do not appear in `git diff`. List them:

```bash
git ls-files --others --exclude-standard
```

If the user needs content from untracked files:

* show only relevant sections, or the full file if small and clearly important

---

## Output format (how to present results)

Return results in this structure:

1. **Comparison base:** `<base_ref>`
2. **Current branch:** `<branch>`
3. **Working state summary:**

   * staged file count
   * unstaged file count
   * untracked file count
4. **Diff summary:** `git diff --stat <base_ref>`
5. **Key diffs:** highlight the most important files first
6. **Untracked files:** list (and optionally summarize content if needed)

---

## Common edge cases & handling

### Base branch ambiguity (main vs master)

If the user asks for a default and didn’t specify:

```bash
git show-ref --verify --quiet refs/remotes/origin/main && echo main
git show-ref --verify --quiet refs/remotes/origin/master && echo master
```

Choose the one that exists; if both exist, prefer `main` unless repo conventions indicate otherwise.

### Large diffs

Start with:

* `--stat`
* `--name-only`
  Then filter by path.

### Renames / binary changes

Use rename detection in summary:

```bash
git diff --stat --find-renames <base_ref>
```

Binary changes will show as binary; explicitly call them out.

### Submodules

Diffs may show only commit pointer changes:

```bash
git submodule status
```

Mention this and treat submodule pointer updates as meaningful changes.

---

## Safety / Do not do

* Do not run state-altering commands (`git reset`, `git checkout`, `git clean`, etc.) unless the user explicitly requests it.
* Do not assume the base branch without asking (unless the user requested “default,” in which case use main/master detection).

---

## Minimal command bundle (copy/paste)

```bash
git rev-parse --is-inside-work-tree
git branch --show-current
git fetch --all --prune

# After asking user, set base_ref, e.g.:
base_ref="origin/main"

git status --porcelain=v1
git diff --stat "$base_ref"
git diff "$base_ref"
git diff --cached "$base_ref"
git ls-files --others --exclude-standard
```

```
```
