import { expect, Locator, Page } from '@playwright/test';
import { HeaderComponent } from './common/headerComponent';
import { MenuAsideComponent } from './common/menuAsideComponent';
import { gotoApp, hideThirdPartyOverlays, waitForAuthenticatedShellIdle } from '../support/navigation';

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

  /**
   * Clica o atalho da home sem `force`. O router Angular só honra o clique depois
   * do shell autenticado assentar — o flake VA-1774 era `force: true` nesse intervalo.
   */
  async abrirAtalho(title: string, expectedUrl: RegExp): Promise<void> {
    await hideThirdPartyOverlays(this.page);
    await waitForAuthenticatedShellIdle(this.page);

    const atalho = this.quickAccess(title);
    await atalho.scrollIntoViewIfNeeded();
    await expect(atalho).toBeVisible();
    await expect(atalho).toBeEnabled();
    await atalho.click();

    const chegou = await this.page
      .waitForURL(expectedUrl, { timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    if (chegou) {
      return;
    }

    await waitForAuthenticatedShellIdle(this.page);
    await hideThirdPartyOverlays(this.page);
    await expect(atalho).toBeEnabled();
    await atalho.click();
    await this.page.waitForURL(expectedUrl, { timeout: 15_000 });
  }
}
