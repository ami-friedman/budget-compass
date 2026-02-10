import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideLayoutDashboard,
  lucideReceiptText,
  lucidePieChart,
  lucideTarget,
  lucideSettings,
  lucideLogOut,
  lucidePlusCircle
} from '@ng-icons/lucide';
import { LogoComponent } from '../logo/logo.component';
import { NavItem } from '../nav-item.interface';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent, LogoComponent],
  viewProviders: [
    provideIcons({
      lucideLayoutDashboard,
      lucideReceiptText,
      lucidePieChart,
      lucideTarget,
      lucideSettings,
      lucideLogOut,
      lucidePlusCircle
    })
  ],
  template: `
    <!-- Desktop Sidebar -->
    <div class="hidden lg:flex flex-col h-full w-64 bg-white border-r border-gray-200 p-4">
      <div class="mb-6 flex justify-center">
        <app-logo [className]="'w-32 h-32'" [iconOnly]="true" />
      </div>

      <nav class="flex-1 space-y-1">
        @for (item of menuItems; track item.id) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-blue-50 text-blue-600"
            [routerLinkActiveOptions]="{ exact: false }"
            class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          >
            <ng-icon
              [name]="item.icon"
              size="20"
              class="transition-colors"
            ></ng-icon>
            <span class="font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="mt-auto space-y-1 pt-4 border-t border-gray-100">
        <button class="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
          <ng-icon name="lucideSettings" size="20"></ng-icon>
          <span class="font-medium">Settings</span>
        </button>
        <button class="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
          <ng-icon name="lucideLogOut" size="20"></ng-icon>
          <span class="font-medium">Sign Out</span>
        </button>

        <div class="flex items-center gap-3 px-4 py-4 mt-2">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm">
            AR
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-gray-900">Alex Rivers</span>
            <span class="text-xs text-gray-500">Premium Plan</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SidebarComponent {
  readonly menuItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'lucideLayoutDashboard', route: '/app/dashboard' },
    { id: 'transactions', label: 'Transactions', icon: 'lucideReceiptText', route: '/app/transactions' },
    { id: 'budgets', label: 'Budgets', icon: 'lucidePieChart', route: '/app/budgets' },
    { id: 'goals', label: 'Savings Goals', icon: 'lucideTarget', route: '/app/goals' }
  ];
}
