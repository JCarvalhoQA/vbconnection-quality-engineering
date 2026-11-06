import { expect, Locator, Page } from '@playwright/test';
import { LoginCredentials } from '../fixtures/login';
import { LoaderComponent } from './common/loaderComponent';
import { gotoApp } from '../support/navigation';

export class LoginPage {
  readonly loader: LoaderComponent;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly forgotPassword: Locator;
  readonly certificate: Locator;
  readonly heading: Locator;
  readonly alterarSenhaHeading: Locator;

  constructor(private readonly page: Page) {
    this.loader = new LoaderComponent(page);
    this.username = page.locator('#login-username');
    this.password = page.locator('#login-password');
    this.submit = page.getByRole('button', { name: 'Entrar' });
    this.forgotPassword = page.getByRole('button', { name: 'Esqueceu a senha?' });
    this.certificate = page.getByRole('button', { name: 'Acessar com certificado digital' });
    this.heading = page.getByRole('heading', { name: 'Olá! Muito bom ter você aqui novamente.' });
    this.alterarSenhaHeading = page.getByRole('heading', { name: 'Alterar senha' });
  }

  async goto(): Promise<void> {
    await gotoApp(this.page, '/');
    await expect(this.heading).toBeVisible();
  }

  async fillCredentials(credentials: LoginCredentials): Promise<void> {
    await this.username.fill(credentials.username);
    await this.password.fill(credentials.password);
  }

  async submitLogin(): Promise<void> {
    await this.submit.click();
  }

  /**
   * Remove usuário/senha do DOM depois do POST. Evita dump no error-context/screenshot
   * se a SPA permanecer na tela de login.
   */
  async redactSensitiveFields(): Promise<void> {
    await this.password.fill('').catch(() => undefined);
    await this.username.fill('').catch(() => undefined);
    await this.password
      .evaluate((el) => {
        const input = el as HTMLInputElement;
        input.value = '';
        input.setAttribute('value', '');
      })
      .catch(() => undefined);
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.fillCredentials(credentials);
    const tokens = this.page.waitForResponse((response) => {
      return response.url().includes('/auth/tokens') && response.request().method() === 'POST';
    });
    await this.submitLogin();
    await tokens;
    await this.loader.waitUntilHidden();
  }

  authError(): Locator {
    return this.page.locator('form p.text-vb-danger, form .text-vb-danger').filter({
      hasText: /Usuário ou senha inválidos|Usuário bloqueado|Código inválido|instabilidade/,
    });
  }
}
