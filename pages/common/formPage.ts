import { expect, Locator, Page } from '@playwright/test';
import { LoaderComponent } from './loaderComponent';

export class FormPage {
  readonly loader: LoaderComponent;

  constructor(protected readonly page: Page) {
    this.loader = new LoaderComponent(page);
  }

  normalizarTexto(texto: string): string {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  normalizarValorCampo(valor: string): string {
    return String(valor || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async aguardarCarregamento(): Promise<void> {
    await this.loader.waitUntilHidden();
  }

  toast(): Locator {
    return this.page.locator('.ant-message-notice-content').last();
  }

  async fillByLabel(label: string, value: string): Promise<void> {
    const field = this.page.locator('app-consult-filter-field').filter({ hasText: label });
    await field.locator('input').fill(value);
  }

  async fillDate(selector: string, value: string): Promise<void> {
    const input = this.page.locator(`${selector} input`).first();
    await input.click();
    await input.fill(value);
    await input.press('Tab');
    await expect(input).toHaveValue(value);
  }

  async selectOption(field: Locator, label: string): Promise<void> {
    await field.click();
    const search = field.locator('input').first();
    await expect(search).toBeVisible();
    await search.fill(label);

    const overlayOption = this.page
      .locator('.cdk-overlay-pane')
      .getByText(label, { exact: true })
      .last();
    await expect(overlayOption).toBeVisible();
    await overlayOption.click();
    await expect(field).toContainText(label);
  }
}
