# Budget Compass Backend

Minimal FastAPI skeleton for Budget Compass.

## Prerequisites

- Python 3.12 (see `.python-version`)
- `uv` installed

## Install dependencies

```bash
cd backend
uv sync
```

## Run the API (development)

```bash
cd backend
uv run uvicorn app.main:app --reload
```

## Health check

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{"status":"ok","service":"budget-compass","version":"v0"}
```

## Configuration

Environment variables are prefixed with `BC_` (see `app/core/config.py`).

- `BC_SERVICE_NAME` (default: `budget-compass`)
- `BC_VERSION` (default: `v0`)
- `BC_ENVIRONMENT` (default: `local`)
