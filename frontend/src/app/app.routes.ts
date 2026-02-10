import { Routes } from '@angular/router';
import { AppShellComponent } from './core/layout/app-shell/app-shell.component';
import { DashboardPage } from './features/dashboard/dashboard.page';
import { TransactionsPage } from './features/transactions/transactions.page';
import { BudgetsPage } from './features/budgets/budgets.page';
import { GoalsPage } from './features/goals/goals.page';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'transactions', component: TransactionsPage },
      { path: 'budgets', component: BudgetsPage },
      { path: 'goals', component: GoalsPage }
    ]
  },
  { path: '**', redirectTo: '' }
];
