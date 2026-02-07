import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/ui/components/section-header/section-header.component';
import { BcButtonComponent } from '../../shared/ui/components/bc-button/bc-button.component';
import { IconTileComponent } from '../../shared/ui/components/icon-tile/icon-tile.component';
import { ModelCardComponent } from '../../shared/ui/components/model-card/model-card.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    SectionHeaderComponent,
    BcButtonComponent,
    IconTileComponent,
    ModelCardComponent
  ],
  templateUrl: './landing.page.html'
})
export class LandingPage {
  protected readonly metaCategories = [
    {
      label: 'Cash',
      description: 'Everyday discretionary spending.',
      tone: 'cash' as const,
      icon: '💵'
    },
    {
      label: 'Monthly',
      description: 'Recurring obligations.',
      tone: 'monthly' as const,
      icon: '📅'
    },
    {
      label: 'Savings',
      description: 'Less-than-monthly goals.',
      tone: 'savings' as const,
      icon: '🧭'
    }
  ];

  protected readonly proofPoints = [
    'No double-counting between accounts and categories.',
    'Savings carry over month to month.',
    'Clear negative/zero balance signals.'
  ];
}
