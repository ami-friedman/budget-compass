import { Component, computed, input } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'md' | 'lg';

@Component({
  selector: 'ui-bc-button',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './bc-button.component.html'
})
export class BcButtonComponent {
  readonly href = input<string | undefined>();
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly fullWidth = input<boolean>(false);

  readonly buttonClasses = computed(() =>
    [
      'bc-btn',
      `bc-btn--${this.variant()}`,
      this.size() === 'lg' ? 'bc-btn--lg' : '',
      this.fullWidth() ? 'w-full' : ''
    ].filter(Boolean)
  );
}
