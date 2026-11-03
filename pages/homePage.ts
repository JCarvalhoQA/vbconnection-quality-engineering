import { expect, Locator, Page } from '@playwright/test';
import { HeaderComponent } from './common/headerComponent';
import { MenuAsideComponent } from './common/menuAsideComponent';
import { gotoApp } from '../support/navigation';

export class HomePage {
  readonly header: HeaderComponent;
  readonly menu: MenuAsideComponent;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.menu = new MenuAsideComponent(page);
  }

  async acessar(): Promise<void> {
    await gotoApp(this.page, '/vbconnection/home');
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/vbconnection\/home/);
    await expect(this.page.getByRole('heading', { name: /Bem-vindo,/ })).toBeVisible();
  }

  kpiCard(label: string): Locator {
    return this.page.locator('article.kpi-card').filter({
      has: this.page.locator('.kpi-label', { hasText: label }),
    });
  }

  kpiValue(label: string): Locator {
    return this.kpiCard(label).locator('.kpi-value');
  }

  quickAccess(title: string): Locator {
    return this.page.locator('button').filter({
      has: this.page.locator('strong', { hasText: new RegExp(`^${title}$`) }),
    });
  }

  skipToContent(): Locator {
    return this.page.getByRole('link', { name: 'Pular para o conteúdo' });
  }
}
