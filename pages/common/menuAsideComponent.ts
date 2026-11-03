import { expect, Locator, Page } from '@playwright/test';

export class MenuAsideComponent {
  constructor(private readonly page: Page) {}

  nav(): Locator {
    return this.page.getByRole('navigation', { name: 'Menu principal' });
  }

  labels(): Locator {
    return this.nav().locator('.menu-aside-label');
  }

  item(name: string): Locator {
    return this.nav().getByText(name, { exact: true });
  }

  async expectTopOrder(expected: readonly string[]): Promise<void> {
    await expect(this.nav()).toBeVisible();
    const texts = (await this.labels().allTextContents()).map((text) => text.trim());

    let previous = -1;
    for (const label of expected) {
      const index = texts.indexOf(label);
      expect(index, `menu sem "${label}"`).toBeGreaterThan(previous);
      previous = index;
    }
  }

  async openGroup(title: string): Promise<void> {
    const group = this.nav().locator('button').filter({ hasText: title }).first();
    await group.click();
  }
}
