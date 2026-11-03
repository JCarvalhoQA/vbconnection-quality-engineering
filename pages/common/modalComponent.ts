import { Locator, Page } from '@playwright/test';

export class ModalComponent {
  readonly dialog: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.getByRole('dialog');
  }

  confirmButton(): Locator {
    return this.dialog.getByRole('button', { name: 'Sim' });
  }

  cancelButton(): Locator {
    return this.dialog.getByRole('button', { name: 'Não' });
  }
}
