import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarComponent, BottomNavComponent],
  template: `
    <div class="flex h-screen bg-gray-50">
      <app-sidebar />
      <main class="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 scroll-smooth">
        <div class="max-w-6xl mx-auto pb-24 lg:pb-0">
          <router-outlet />
        </div>
      </main>
      <app-bottom-nav />
    </div>
  `
})
export class AppShellComponent {}
