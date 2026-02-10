import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-section-header',
  standalone: true,
  templateUrl: './section-header.component.html'
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>();
  readonly kicker = input<string | undefined>();
  readonly align = input<'left' | 'center'>('left');
}
