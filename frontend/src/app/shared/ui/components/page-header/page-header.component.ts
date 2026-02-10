import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-page-header',
  imports: [CommonModule],
  template: `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ title() }}</h1>
      @if (subtitle()) {
        <p class="text-gray-500 mt-1">{{ subtitle() }}</p>
      }
    </div>
  `
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
