import { expect, Locator, Page } from '@playwright/test';
import { gotoApp } from '../support/navigation';

export class ContratoConsultarPage {
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Consultar Contratos e Aditivos' });
  }

  async acessar(): Promise<void> {
    await gotoApp(this.page, '/vbconnection/contrato/consultar');
    await expect(this.heading).toBeVisible();
  }

  pesquisar(): Locator {
    return this.page.getByRole('button', { name: 'Pesquisar' });
  }

  filtrar(): Locator {
    return this.page.getByRole('button', { name: 'Filtrar' });
  }

  emptyMessage(): Locator {
    return this.page.getByText('Nenhum contrato encontrado');
  }
}
