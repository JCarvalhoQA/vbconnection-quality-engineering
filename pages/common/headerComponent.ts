import { Locator, Page } from '@playwright/test';
import { ModalComponent } from './modalComponent';

export class HeaderComponent {
  readonly modal: ModalComponent;

  constructor(private readonly page: Page) {
    this.modal = new ModalComponent(page);
  }

  userMenu(): Locator {
    return this.page.getByRole('button', { name: /administrador/i });
  }

  async logout(): Promise<void> {
    await this.userMenu().click();
    await this.page.getByText('Sair', { exact: true }).click();
    await this.modal.confirmButton().click();
  }
}
