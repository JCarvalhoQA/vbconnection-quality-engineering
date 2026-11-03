import { expect, Page } from '@playwright/test';
import { LoaderComponent } from './common/loaderComponent';

export class RecuperacaoSenhaComponent {
  readonly loader: LoaderComponent;

  constructor(private readonly page: Page) {
    this.loader = new LoaderComponent(page);
  }

  heading() {
    return this.page.getByRole('heading', { name: 'Redefinir senha' });
  }

  usuario() {
    return this.page.locator('#recuperacao-usuario');
  }

  submit() {
    return this.page.getByRole('button', { name: 'Enviar link de recuperação' });
  }

  voltar() {
    return this.page.getByRole('button', { name: 'Voltar' });
  }

  sucesso() {
    return this.page.getByTestId('recuperacao-sucesso');
  }

  async expectVisible(): Promise<void> {
    await expect(this.heading()).toBeVisible();
    await expect(this.usuario()).toBeVisible();
  }
}
