import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-model-card',
  standalone: true,
  templateUrl: './model-card.component.html'
})
export class ModelCardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly accent = input<'accounts' | 'categories'>('accounts');
}
