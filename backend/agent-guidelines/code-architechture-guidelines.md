# Backend architecture guidelines  
## FastAPI + SQLModel (production-grade)

These guidelines focus on **structure and responsibilities**, not code style. The goal is to keep the backend understandable, testable, and safe as it grows.

---

## 1) Core architectural principle

**Separate concerns by responsibility, not by framework.**

FastAPI should handle **HTTP**, SQLModel should handle **persistence**, and your **domain logic** should live independently of both.

If business logic depends on FastAPI or the database session, the architecture is already leaking.

---

## 2) Recommended high-level structure

Organize by **feature/domain**, not by technical layer only.

app/
main.py
core/ # cross-cutting concerns
db/ # engine, session, migrations
domains/ # will contain accounts/, transactions/ etc


Each domain owns:
- its models
- its rules
- its API surface

Avoid a single global `models.py`, `crud.py`, or `routes.py`.

---

## 3) Clear layer boundaries (non-negotiable)

### API layer (FastAPI)
Responsible for:
- HTTP details (status codes, headers)
- request parsing & validation
- authentication context
- translating domain errors → HTTP errors

Not responsible for:
- business rules
- money logic
- database decisions

---

### Domain layer (pure Python)
Responsible for:
- business rules
- invariants
- workflows (e.g. “create transaction”, “transfer funds”)

Rules:
- No FastAPI imports
- No DB session imports
- Accepts and returns domain objects

This is the **most important layer**.

---

### Persistence layer (SQLModel)
Responsible for:
- mapping domain concepts to tables
- queries
- transactions

Rules:
- No HTTP concepts
- No request/response objects
- No business decisions

---

## 4) SQLModel usage guidelines

- Use SQLModel **only** for persistence models  
- Avoid mixing API schemas and DB models when logic diverges
- Keep relationships explicit and intentional
- Prefer explicit queries over “magic” ORM behavior

SQLModel is a convenience layer — not your domain.

---

## 5) Dependency Injection (FastAPI style)

- Use dependencies for:
  - DB sessions
  - auth context
  - request-scoped services
- Do **not** inject business logic directly into routes
- Dependencies should assemble objects, not perform logic

Routes should look thin and boring.

---

## 6) Transactions & unit of work

- The API layer controls transaction boundaries
- One request → one transaction (in most cases)
- Domain logic should assume it runs inside a transaction
- Rollbacks happen at the boundary, not deep inside logic

Never let random helper functions commit to the DB.

---

## 7) Error handling strategy

- Domain raises **domain errors**
- API layer maps them to HTTP responses
- DB errors are caught and translated early

Never leak:
- raw SQL errors
- stack traces
- internal identifiers

Errors are part of the contract.

---

## 8) Configuration & environment

- Centralize config (env vars → config object)
- No environment checks scattered in code
- Config is injected, not imported globally

This makes testing and deployment predictable.

---

## 9) Testing architecture (by layer)

- Domain logic: pure unit tests (no DB, no FastAPI)
- Persistence: integration tests (real DB)
- API: contract tests (request → response)

If tests require spinning up the whole app for simple logic, the architecture is wrong.

---

## 10) What “good” looks like

You should be able to:
- change FastAPI → another framework with minimal impact
- change SQLModel → another ORM with contained impact
- test business logic without HTTP or DB
- reason about money flows by reading domain code only

---

