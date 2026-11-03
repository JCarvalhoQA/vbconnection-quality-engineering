import { expect, Locator, Page } from '@playwright/test';
import { gotoApp } from '../support/navigation';

export class ClienteListPage {
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Clientes' });
  }

  async acessar(): Promise<void> {
    await gotoApp(this.page, '/vbconnection/cliente');
    await expect(this.heading).toBeVisible();
  }

  subtitle(): Locator {
    return this.page.getByText(/clientes cadastrados/);
  }

  metric(label: string): Locator {
    return this.page.locator('article.status-metric-card').filter({
      has: this.page.locator('.status-metric-card__label', { hasText: new RegExp(`^${label}$`) }),
    });
  }

  metricValue(label: string): Locator {
    return this.metric(label).locator('.status-metric-card__value');
  }
}
