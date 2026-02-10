import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-icon-tile',
  standalone: true,
  templateUrl: './icon-tile.component.html'
})
export class IconTileComponent {
  readonly label = input.required<string>();
  readonly description = input.required<string>();
  readonly tone = input<'cash' | 'monthly' | 'savings'>('cash');
  readonly icon = input.required<string>();
}
