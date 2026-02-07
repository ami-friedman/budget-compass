---
name: angular-component
description: Use this skill whenever generating or refactoring Angular component TypeScript, templates, or styles.
---

## Signals for component inputs

Use Angular signal inputs as the default for component APIs.

### Rules
- Prefer `input()` / `input.required()` over `@Input()` for new code.
- Type every input explicitly.
- Keep inputs `readonly` and expose them as signal functions in templates.
- Do not mirror inputs into local state unless you need derived state (`computed`).
- For optional inputs, use `input<T | undefined>()`.
- Provide defaults via `input<T>(defaultValue)`.

### Examples

```ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-example',
  standalone: true,
  template: `{{ title() }}`
})
export class ExampleComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>();
  readonly align = input<'left' | 'center'>('left');
}
```

### Template usage
- Call the signal: `title()` not `title`.
- Use modern control flow with signal checks:

```html
@if (subtitle()) {
  <p>{{ subtitle() }}</p>
}
```
