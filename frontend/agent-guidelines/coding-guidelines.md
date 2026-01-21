# Frontend development guidelines  
## Budgeting app — Angular 19 (modern patterns)

These guidelines focus on **how to build and structure the frontend**, not on visual design.  
They assume **Angular 19**, standalone APIs, signals, and the new template control flow.

---

## 1) Core principles

- Prefer **clarity over cleverness**
- Keep **business logic out of templates**
- Make **state explicit and predictable**
- Treat money, dates, and categories as **domain concepts**, not raw values

Angular’s modern APIs exist to reduce hidden behavior — use them intentionally.

---

## 2) Project structure (feature-first)

Organize by **feature**, not by technical type.

src/app/
  features/
    accounts/
      components/
      services/
      state/
      routes.ts
    budgets/
      components/
      services/
      state/
      routes.ts
    transactions/
      components/
      services/
      state/
      routes.ts

  shared/
    ui/
      components/
    api/
      generated/
    utils/
      money/
      dates/

  core/
    auth/
    error-handling/
    config/

  app.component.ts
  app.routes.ts



Each feature owns:
- its components
- its state
- its API usage
- its routing (if any)

Avoid global “components” or “services” folders.

---

## 3) Components: standalone & focused

- Use **standalone components only**
- One component = one responsibility
- Prefer **composition over inheritance**

Rules:
- Smart (stateful) components at feature boundaries
- Dumb (presentational) components in `shared/ui`

Components should orchestrate state — not compute it.

---

## 4) State management with signals

### Use signals as the default state primitive
- Component state → `signal`
- Derived state → `computed`
- Side effects → `effect`

Rules:
- Signals represent **state**, not events
- No hidden mutations
- No business rules inside templates

Signals should describe *what is*, not *what happened*.

---

## 5) Services: domain-facing, not UI-facing

Services should:
- encapsulate domain logic
- talk to the backend
- expose **signals or observables**, not mutable fields

Avoid:
- services as global state dumps
- services that manipulate the DOM
- services that leak HTTP shapes directly into components

Think of services as **frontend domain adapters**.

---

## 6) API integration

- Use **generated OpenAPI clients only**
- Never hand-write HTTP calls for domain APIs
- Treat API DTOs as **external contracts**

Rules:
- Map API responses into frontend domain models
- Never let raw API shapes leak into templates
- Handle API errors centrally, not per component

Frontend and backend should evolve together — not drift.

---

## 7) Templates: modern control flow only

Use Angular’s new control flow syntax:
- `@if`
- `@for`
- `@switch`

Rules:
- No logic-heavy expressions in templates
- No function calls from templates
- Track lists explicitly in `@for`

Templates should express **structure**, not behavior.

---

## 8) Forms & user input (financial safety)

- Use **Reactive Forms**
- Validate early and explicitly
- Never trust UI-only validation

Rules:
- No implicit number parsing
- Treat money input as strings until validated
- Prevent invalid intermediate states (e.g. partial decimals)

User input is untrusted until proven otherwise.

---

## 9) Styling with Tailwind

- Use Tailwind utilities directly in templates
- Avoid component-specific CSS unless necessary
- Centralize design tokens (spacing, colors, typography)

Rules:
- No logic-driven styling
- No inline style calculations
- Prefer semantic grouping via components, not CSS abstraction

---

## 10) Error handling & UX consistency

- Surface errors consistently across features
- Distinguish between:
  - validation errors
  - network errors
  - business rule errors

Rules:
- No silent failures
- No raw backend messages shown to users
- Errors are part of the UI contract

---

## 11) Performance & change detection

- Use signals to minimize change detection
- Avoid unnecessary subscriptions
- Prefer `computed` over recalculation in templates

If performance problems require manual tuning, the architecture is usually the cause.

---

## 12) Testing expectations

- Component tests validate behavior, not implementation
- Services are tested independently of the UI
- Critical money-related flows must have coverage

If a component is hard to test, it’s doing too much.

---

## 13) What “good” looks like

You should be able to:
- read a feature folder and understand its behavior end-to-end
- change backend contracts with predictable frontend impact
- reason about budgets and transactions without inspecting templates
- refactor UI without touching domain logic

---

## One-line summary

> **Signals manage state, templates render structure,  
> services translate domains, and features own behavior.**

If you want next, we can:
- align FE features with backend domains
- define frontend domain models for money & dates
- review a sample Angular 19 feature and refactor it to this standard
