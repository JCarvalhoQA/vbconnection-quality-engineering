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
    const legacy = this.page.locator('app-consult-filter-field').filter({ hasText: label });
    if ((await legacy.count()) > 0 && (await legacy.locator('input').first().isVisible().catch(() => false))) {
      await legacy.locator('input').fill(value);
      return;
    }

    const named = this.page.getByRole('textbox', { name: new RegExp(label, 'i') });
    await named.first().fill(value);
  }

  articleByHeading(name: string | RegExp): Locator {
    return this.page.locator('article').filter({ has: this.page.getByRole('heading', { name }) });
  }

  async fillNamed(
    scope: Locator,
    name: string | RegExp,
    value: string,
    role: 'textbox' | 'combobox' = 'textbox',
  ): Promise<boolean> {
    const field = scope.getByRole(role, { name }).first();
    if ((await field.count()) === 0) {
      return false;
    }
    await field.scrollIntoViewIfNeeded().catch(() => undefined);
    if (!(await field.isVisible().catch(() => false))) {
      return false;
    }
    if (role === 'combobox') {
      await this.selectOption(field, value);
      return true;
    }
    const pickerHost = field.locator('xpath=ancestor::nz-date-picker[1]');
    if ((await pickerHost.count()) > 0) {
      await this.fillNzDatePicker(pickerHost, value);
      return true;
    }
    await field.click();
    await field.fill(value);
    await field.press('Tab');
    return true;
  }

  async fillDate(selector: string, value: string): Promise<void> {
    const host = this.page.locator(selector).first();
    await this.fillNzDatePicker(host, value);
  }

  /**
   * ng-zorro DatePicker: fill()+Tab fecha o overlay sem commitar o FormControl
   * (valor volta vazio). Digita dd/MM/yyyy, confirma com Enter e, se necessário,
   * clica a célula do dia no painel visível.
   */
  async fillNzDatePicker(picker: Locator, value: string): Promise<void> {
    const nested = picker.locator('input');
    const input = (await nested.count()) > 0 ? nested.first() : picker;
    await picker.scrollIntoViewIfNeeded().catch(() => undefined);
    await expect(input).toBeVisible();
    await input.click();

    const overlay = this.page.locator('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)').last();
    await overlay.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => undefined);

    const readonly = await input.getAttribute('readonly');
    if (!readonly) {
      await input.press('ControlOrMeta+A');
      await input.pressSequentially(value, { delay: 25 });
      await input.press('Enter');
    }

    const atual = await input.inputValue();
    if (atual !== value && (await overlay.isVisible().catch(() => false))) {
      await this.confirmarDiaNoCalendario(overlay, value);
    }

    await expect(input).toHaveValue(value);
  }

  private async confirmarDiaNoCalendario(overlay: Locator, value: string): Promise<void> {
    const dia = String(Number.parseInt(value.split('/')[0] ?? '', 10));
    const hoje = overlay.locator('td.ant-picker-cell-in-view.ant-picker-cell-today:not(.ant-picker-cell-disabled)');
    if ((await hoje.count()) > 0 && (await hoje.first().isVisible().catch(() => false))) {
      const textoHoje = (await hoje.locator('.ant-picker-cell-inner').innerText()).trim();
      if (textoHoje === dia) {
        await hoje.first().click();
        return;
      }
    }

    const cell = overlay
      .locator('td.ant-picker-cell-in-view:not(.ant-picker-cell-disabled)')
      .filter({ has: this.page.locator('.ant-picker-cell-inner', { hasText: new RegExp(`^${dia}$`) }) })
      .first();
    await expect(cell).toBeVisible();
    await cell.click();
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
