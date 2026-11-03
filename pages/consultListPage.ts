import { expect, Page } from '@playwright/test';
import { gotoApp } from '../support/navigation';

export class ConsultListPage {
  constructor(private readonly page: Page) {}

  async abrir(rota: string, titulo: string): Promise<void> {
    await gotoApp(this.page, rota);
    await expect(this.page).toHaveURL(new RegExp(rota.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    await expect(this.page.getByRole('heading', { name: titulo })).toBeVisible();
  }
}
