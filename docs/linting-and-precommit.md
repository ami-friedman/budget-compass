# Linting & pre-commit

## Overview
This repo uses **pre-commit** at the root to run linting/formatting on **staged files** with auto-fix where possible.
Backend tools run via **uv**.

## One-time setup
1) Install pre-commit (system-wide)
```
pipx install pre-commit
```
2) Install hooks
```
pre-commit install
```

## Run hooks manually
- Run on all files:
```
pre-commit run --all-files
```
- Run on staged files only (default on commit):
```
pre-commit run
```

## Backend (Python)
Configured in [`backend/pyproject.toml`](../backend/pyproject.toml:1) and run via `uv`.

Hooks:
- Ruff (lint + fix)
- Black (format)
- Pyright (type check)

Manual commands:
```
cd backend
uv run ruff check --fix
uv run black
uv run pyright --project pyproject.toml
```

## Frontend (Angular)
Configured in [`frontend/package.json`](../frontend/package.json:1).

Hooks:
- ESLint (lint + fix)
- Prettier (format)

Manual commands:
```
cd frontend
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## CI
- Frontend lint + prettier check runs in [`.github/workflows/lint.yml`](../.github/workflows/lint.yml:1).
- Backend typecheck runs in [`.github/workflows/backend-typecheck.yml`](../.github/workflows/backend-typecheck.yml:1).
