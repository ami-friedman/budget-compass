## Code Review Instructions

Get the diffs currently in this branch in order to understand what changes were made - use this to perform your code review as bellow

These instructions define what a reviewer must check when approving changes. Follow project guidelines in
[`backend/agent-guidelines/code-architechture-guidelines.md`](backend/agent-guidelines/code-architechture-guidelines.md)
and [`backend/agent-guidelines/coding-guidelines.md`](backend/agent-guidelines/coding-guidelines.md)
for backend work, and [`frontend/agent-guidelines/coding-guidelines.md`](frontend/agent-guidelines/coding-guidelines.md)
for frontend work.

---

## Backend Review — FastAPI + Python 3.12+

### Architecture & boundaries
- Confirm FastAPI routes are thin: HTTP parsing + dependency wiring only, no domain logic.
- Confirm domain logic is pure Python with no FastAPI or DB session imports.
- Confirm SQLModel models are only persistence models; API schemas are separated when shapes diverge.
- Verify feature/domain ownership is preserved (no global `models.py`, `crud.py`, or `routes.py`).

### Data integrity & money correctness
- Money uses `decimal.Decimal` or minor units consistently; no float math.
- Rounding policy is explicit and tested.
- Transactions wrap monetary mutations; no partial updates.
- Invariants (e.g., balance non-negative, ledger sums) are enforced at domain and/or DB constraints.

### API contracts & validation
- Request validation is explicit (Pydantic/SQLModel validation, no implicit coercion).
- Response models are stable and versioned by contract; no leaking internal DB fields.
- Errors use a consistent contract (prefer RFC 7807 style problem details).
- Sensitive errors are logged server-side but not returned to clients.

### Idempotency, concurrency, and safety
- Write endpoints support idempotency keys where retries are possible.
- Concurrency hazards are mitigated with transactions, isolation, and/or optimistic locking.
- Avoid side-effecting operations outside of DB transactions (e.g., external calls without compensations).

### Security & privacy
- Object-level authorization is enforced on every resource access (no BOLA risk).
- Over-posting/mass assignment is prevented by explicit field whitelists.
- Secrets and PII are not logged; sensitive data is encrypted at rest and in transit.
- Authentication and rate limiting are applied to high-risk endpoints.

### Observability & operability
- Logs include request IDs, actor IDs, and action names for auditability.
- Domain events or audit logs exist for financial mutations.
- Health checks and metrics changes are consistent with existing patterns.

### Code quality & tests
- Type hints are present at public boundaries; typing errors are not introduced.
- Linting/formatting compliance is preserved (Ruff/Black if configured).
- Tests cover money edge cases, validation, and domain invariants.
- Layered tests remain isolated: domain unit tests do not require DB or HTTP.

### Backend checklist
- [ ] FastAPI routes are thin and domain logic stays framework-free
- [ ] Money handling uses Decimal/minor units with explicit rounding
- [ ] Transactions protect monetary mutations and invariants are enforced
- [ ] Idempotency and concurrency hazards are addressed
- [ ] AuthZ is object-level, and errors/contracts are consistent
- [ ] Logging/audit/metrics are sufficient for financial actions
- [ ] Tests and typing cover critical paths without cross-layer coupling

---

## Frontend Review — Angular 21+

### Architecture & structure
- Features are organized by domain/feature; no global “services” or “components” grab-bags.
- Standalone components are used; feature boundaries are clear.
- Shared UI components live in shared UI folders and are reused.

### State management & logic placement
- Signals are the default state primitive (`signal`, `computed`, `effect`).
- Derived state is computed, not recalculated in templates.
- Business logic lives in services or feature state, not templates.

### Templates & rendering
- Uses modern control flow (`@if`, `@for`, `@switch`).
- No heavy expressions or function calls in templates.
- Lists use proper tracking for performance.

### API integration & domain mapping
- API calls go through generated OpenAPI clients only.
- DTOs are mapped into frontend domain models before use in templates.
- Error handling is centralized; UI doesn’t display raw backend errors.

### Forms & validation
- Reactive forms are used for user input.
- Money inputs are treated as strings until validated and parsed.
- Validation rules mirror backend constraints for consistency.

### Performance & change detection
- Signal usage avoids unnecessary subscriptions and change detection churn.
- Expensive computations are cached with `computed` or moved to services.

### Accessibility & UX consistency
- Inputs have labels, ARIA attributes where needed, and predictable focus flow.
- Error states are consistent across features; no silent failures.

### Code quality & tests
- ESLint and formatting rules are preserved.
- Unit tests cover key flows and money-related behaviors.
- Components are testable without complex setup (indicates good separation).

### Frontend checklist
- [ ] Feature structure, standalone components, and shared UI usage are consistent
- [ ] Signals manage state; templates are logic-light with new control flow
- [ ] API integration uses generated clients and maps DTOs to domain models
- [ ] Reactive forms and validation align with backend constraints
- [ ] Performance, accessibility, and error handling meet app standards
- [ ] Linting and tests cover critical UI flows
