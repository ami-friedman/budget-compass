# Coding guidelines — Python (high standard)

## 1) Style & readability (make it boring on purpose)
- Follow PEP 8 conventions for layout, naming, imports, and general readability. :contentReference[oaicite:0]{index=0}
- Write docstrings consistently (what it does, key args/returns, important exceptions). Use PEP 257 conventions. :contentReference[oaicite:1]{index=1}
- Prefer small, single-purpose functions and modules. Keep side-effects obvious (DB/network/time).

## 2) Formatting & linting (automate the arguments away)
- Use an auto-formatter (Black) for deterministic formatting. :contentReference[oaicite:2]{index=2}
- Use a fast linter (Ruff) and enable rules that catch correctness + maintainability issues (imports, unused vars, risky patterns, docstring rules, upgrades). :contentReference[oaicite:3]{index=3}
- Treat lint/format/type checks as CI gates (fail the build).

## 3) Types (prevent “works on my machine”)
- Add type hints broadly (public functions, boundaries like API handlers, DB layer). PEP 484 is the base spec. :contentReference[oaicite:4]{index=4}
- Enforce a type checker (mypy or pyright) at least in “strict-ish” mode for your core packages.

## 4) Errors & exceptions
- Use exceptions for truly exceptional situations, not as control flow. Keep error boundaries clear (API layer catches, domain layer raises). :contentReference[oaicite:5]{index=5}
- Raise specific exceptions; don’t swallow errors silently; log with context. :contentReference[oaicite:6]{index=6}

## 5) Testing (confidence beats cleverness)
- Use pytest and lean on parametrization to cover many cases without copy/paste. :contentReference[oaicite:7]{index=7}
- Prefer fixtures for consistent, reliable setup/teardown. :contentReference[oaicite:8]{index=8}
- Test boundaries: parsing/validation, domain logic, DB transactions, and “money math” edge cases.

### Unit test strategy for new functionality (pytest, unit tests only)

**Expectation:** Every new domain behavior or business rule ships with unit tests that run fast and do **not** depend on the DB or FastAPI.

Checklist:
- [ ] Write unit tests for the **domain layer** behavior you added/changed (pure Python, no I/O).
- [ ] Keep tests **deterministic** (no time, random, or network unless controlled via fixtures).
- [ ] Use **pytest fixtures** to build domain objects and reuse setup without global state.
- [ ] Use **parametrization** to cover edge cases (money math, validation boundaries, invariants).
- [ ] Assert on **behavior and invariants**, not implementation details.

Non-goals for unit tests:
- No DB sessions, migrations, or real repositories.
- No FastAPI `TestClient` or HTTP calls.
- No dependency injection wiring tests (belongs to integration/contract tests).

## 6) Project hygiene (keeps the repo scalable)
- Keep dependencies pinned (lockfile), separate dev vs prod deps, and run security scanning.
- Keep configuration out of code (env vars), and keep secrets out of git (rotate if leaked). :contentReference[oaicite:9]{index=9}


---

# Coding guidelines — Backend for a financial web application

## 1) Money handling (correctness first)
- Never use floating-point for currency amounts. Use `decimal.Decimal` (or store integer minor units like cents) to avoid binary float issues. :contentReference[oaicite:10]{index=10}
- Define a single “Money” representation (currency + amount) and enforce it everywhere (DB schema, API, domain).
- Round explicitly using a documented policy (e.g., bankers rounding vs half-up) and test it.

## 2) Data model & integrity
- Use DB transactions for any operation that moves/allocates money. Keep updates atomic.
- Make invariants explicit (e.g., balances never negative if your product requires it).
- Prefer immutable financial events (append-only ledger style) over “update-in-place” when feasible; always be able to explain how a balance was derived.

## 3) Idempotency (avoid double-charging / duplicate writes)
- For write endpoints (especially POST), support idempotency keys so clients can safely retry requests. :contentReference[oaicite:11]{index=11}
- Persist the idempotency key + request hash + resulting resource ID, and return the same result for repeats.

## 4) API security (treat every endpoint as an attack surface)
- Enforce object-level authorization on every resource access (classic API #1 risk: BOLA). :contentReference[oaicite:12]{index=12}
- Harden authentication (rate limit auth endpoints, anti-bruteforce, strong session/token handling). :contentReference[oaicite:13]{index=13}
- Prevent over-posting / mass assignment (property-level authorization). :contentReference[oaicite:14]{index=14}
- Use OWASP ASVS as a security requirements checklist for your backend (auth, access control, logging, data protection, etc.). :contentReference[oaicite:15]{index=15}

## 5) Sensitive data protection (reduce what you store)
- Don’t store sensitive data unless you must; if you can outsource (payments/tokenization), do it. :contentReference[oaicite:16]{index=16}
- Passwords must be hashed (not encrypted) using strong password hashing guidance. :contentReference[oaicite:17]{index=17}
- Encrypt sensitive data at rest and in transit; use modern cryptography patterns and key management. :contentReference[oaicite:18]{index=18}
- Manage secrets properly (no secrets in logs, code, or git; rotate regularly). :contentReference[oaicite:19]{index=19}

## 6) Logging, audit, and traceability (financial apps need receipts)
- Implement security-aware logging: include request IDs, actor/user IDs, action names, and outcomes; avoid logging secrets/PII. :contentReference[oaicite:20]{index=20}
- Maintain audit logs for all financial mutations (who/what/when/from-where) and protect them from tampering.

## 7) Error handling & API contracts (predictable + safe)
- Standardize error responses (e.g., RFC 7807 “problem details”) so clients can handle failures consistently. :contentReference[oaicite:21]{index=21}
- Don’t leak internals (stack traces, SQL errors) to clients; log details server-side.

## 8) Concurrency & consistency
- Design for concurrent requests: use DB constraints, proper isolation, optimistic locking/version columns where needed.
- Make “transfer” operations safe under retries + concurrency (transaction + idempotency + constraints).

## 9) Operational excellence
- Rate limit and protect endpoints that can be abused (login, exports, heavy reports). :contentReference[oaicite:22]{index=22}
- Use health checks, metrics, and tracing; alert on auth anomalies and suspicious access patterns.

## 10) Minimal baseline checklist (practical)
- [ ] Decimal/minor-units money model everywhere :contentReference[oaicite:23]{index=23}
- [ ] DB transactions around all monetary mutations
- [ ] Idempotency keys on POST writes :contentReference[oaicite:24]{index=24}
- [ ] Object-level auth checks on every resource :contentReference[oaicite:25]{index=25}
- [ ] Password hashing per OWASP :contentReference[oaicite:26]{index=26}
- [ ] Encryption at rest + TLS in transit :contentReference[oaicite:27]{index=27}
- [ ] Security-aware logging + audit trail :contentReference[oaicite:28]{index=28}
- [ ] Standard error format (RFC 7807) :contentReference[oaicite:29]{index=29}
