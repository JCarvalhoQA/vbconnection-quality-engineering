import { expect, Locator, Page } from '@playwright/test';

export class LoaderComponent {
  readonly overlay: Locator;

  constructor(private readonly page: Page) {
    this.overlay = page.locator('div.fixed.inset-0').filter({ has: page.locator('nz-spin') });
  }

  async waitUntilHidden(): Promise<void> {
    await expect(this.overlay).toHaveCount(0, { timeout: 15_000 });
  }
}
