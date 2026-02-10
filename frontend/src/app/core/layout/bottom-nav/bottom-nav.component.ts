import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideLayoutDashboard,
  lucideReceiptText,
  lucidePieChart,
  lucideTarget,
  lucidePlusCircle
} from '@ng-icons/lucide';
import { NavItem } from '../nav-item.interface';

@Component({
  selector: 'app-bottom-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent],
  viewProviders: [
    provideIcons({
      lucideLayoutDashboard,
      lucideReceiptText,
      lucidePieChart,
      lucideTarget,
      lucidePlusCircle
    })
  ],
  template: `
    <!-- Mobile Bottom Navigation -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-40 flex justify-between items-center safe-area-inset-bottom">
      @for (item of menuItems; track item.id) {
        <a
          [routerLink]="item.route"
          routerLinkActive="text-blue-600"
          [routerLinkActiveOptions]="{ exact: false }"
          class="flex flex-col items-center gap-1 transition-colors text-gray-400"
        >
          <ng-icon [name]="item.icon" size="24"></ng-icon>
          <span class="text-[10px] font-bold uppercase tracking-wider">{{ getShortLabel(item.label) }}</span>
        </a>
      }
      <button
        class="bg-blue-600 text-white p-3 rounded-full shadow-lg shadow-blue-200 -mt-12 border-4 border-white"
      >
        <ng-icon name="lucidePlusCircle" size="24"></ng-icon>
      </button>
    </div>
  `
})
export class BottomNavComponent {
  readonly menuItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'lucideLayoutDashboard', route: '/app/dashboard' },
    { id: 'transactions', label: 'Transactions', icon: 'lucideReceiptText', route: '/app/transactions' },
    { id: 'budgets', label: 'Budgets', icon: 'lucidePieChart', route: '/app/budgets' },
    { id: 'goals', label: 'Savings Goals', icon: 'lucideTarget', route: '/app/goals' }
  ];

  getShortLabel(label: string): string {
    return label.split(' ')[0];
  }
}
