import { test, expect } from '@playwright/test';
import { LoginFactory } from '../../factories/loginFactory';
import { mockLoginApis } from '../../support/auth';
import { HomePage } from '../../pages/homePage';
import { LoginPage } from '../../pages/loginPage';
import { isLoginUrl } from '../../support/navigation';

test.describe('Login — fluxos autenticados @regression @login', () => {
  test('abre verificação em duas etapas quando a API solicita 2FA', async ({ page }) => {
    const twoFactor = LoginFactory.credentials('twoFactor');
    await mockLoginApis(page, 'twoFactor');
    const login = new LoginPage(page);

    await login.goto();
    await login.login(twoFactor);

    await expect(page.getByRole('heading', { name: 'Verificação em duas etapas' })).toBeVisible();
    await expect(page.getByTestId('email-destino')).toContainText(twoFactor.email ?? '');
    await expect(page.locator('#codigo-segunda-etapa')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled();
  });

  test('abre alteração de senha quando a senha está expirada', async ({ page }) => {
    await mockLoginApis(page, 'expired');
    const login = new LoginPage(page);

    await login.goto();
    await login.login(LoginFactory.credentials('expired'));

    await expect(page.getByRole('heading', { name: 'Alterar senha' })).toBeVisible();
  });

  test('alerta tentativas e bloqueia na quinta falha', async ({ page }) => {
    const invalid = LoginFactory.credentials('invalid');
    await mockLoginApis(page, 'unauthorized');
    const login = new LoginPage(page);
    await login.goto();

    await login.login(invalid);
    await expect(page.getByText('Usuário ou senha inválidos')).toBeVisible();

    await login.login(invalid);
    await expect(page.getByText('Você tentou acessar 2 vezes')).toBeVisible();

    await login.login(invalid);
    await expect(page.getByText('Você tentou acessar 3 vezes')).toBeVisible();

    await login.login(invalid);
    await expect(page.getByText('Após mais uma tentativa, seu acesso será bloqueado.')).toBeVisible();

    await login.login(invalid);
    await expect(page.getByText('Usuário bloqueado')).toBeVisible();
  });

  test('exibe instabilidade quando a API de login falha de rede', async ({ page }) => {
    await mockLoginApis(page, 'offline');
    const login = new LoginPage(page);

    await login.goto();
    await login.fillCredentials(LoginFactory.credentials('offline'));
    await login.submitLogin();

    await expect(
      page.getByText(
        'Estamos passando por uma instabilidade no momento.. tente novamente em alguns instantes',
      ),
    ).toBeVisible();
  });

  test('encerra a sessão pelo menu Sair e retorna ao login', async ({ page }) => {
    await mockLoginApis(page, 'success');
    const login = new LoginPage(page);
    const home = new HomePage(page);

    await login.goto();
    await login.login(LoginFactory.credentials('admin'));
    await home.expectLoaded();
    await home.header.logout();

    await expect(page).toHaveURL(isLoginUrl);
    await expect(login.heading).toBeVisible();
  });

  test('envia usuário e senha sem espaços nas extremidades', async ({ page }) => {
    const admin = LoginFactory.credentials('admin');
    await mockLoginApis(page, 'success');
    const login = new LoginPage(page);

    await login.goto();

    const tokens = page.waitForRequest((request) => {
      return request.url().includes('/auth/tokens') && request.method() === 'POST';
    });

    await login.fillCredentials(LoginFactory.padded('admin'));
    await login.submitLogin();

    const request = await tokens;
    const body = JSON.parse(request.postData() ?? '{}') as { username?: string; password?: string };
    expect(body.username).toBe(admin.username);
    expect(body.password).toBe(admin.password);
  });
});
