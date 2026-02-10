import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-3 group">
      <img
        src="/logo.png"
        alt="Budget Compass Logo"
        [class]="className() + ' object-cover scale-150 group-hover:scale-[1.55] transition-transform duration-300'"
      />
      @if (!iconOnly()) {
        <div class="flex flex-col leading-none">
          <span class="text-xl font-black tracking-tight text-gray-900">
            Budget<span class="text-blue-600">Compass</span>
          </span>
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">
            Smart Finance
          </span>
        </div>
      }
    </div>
  `
})
export class LogoComponent {
  readonly className = input<string>('w-10 h-10');
  readonly iconOnly = input<boolean>(false);
}
