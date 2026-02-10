import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/components/page-header/page-header.component';

@Component({
  selector: 'app-transactions-page',
  imports: [PageHeaderComponent],
  template: `
    <ui-page-header
      title="Transactions"
      subtitle="Routed successfully"
    />
    <div class="mt-8 bg-white p-8 rounded-2xl border border-gray-200">
      <p class="text-gray-500">This is the Transactions page placeholder.</p>
    </div>
  `
})
export class TransactionsPage {}
