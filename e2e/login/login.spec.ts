import { test, expect } from '@playwright/test';
import { LoginFactory } from '../../factories/loginFactory';
import { mockLoginApis } from '../../support/auth';
import { HomePage } from '../../pages/homePage';
import { LoginPage } from '../../pages/loginPage';
import { gotoApp, isLoginUrl } from '../../support/navigation';

test.describe('Login — tela no newfront @smoke @login @critical', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('exibe o formulário de login do newfront', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await expect(page.getByRole('img', { name: 'VB Connection' }).first()).toBeVisible();
    await expect(page.getByText('Faça o login para acessar.')).toBeVisible();
    await expect(login.username).toBeVisible();
    await expect(login.password).toBeVisible();
    await expect(login.submit).toBeEnabled();
    await expect(login.forgotPassword).toBeVisible();
    await expect(login.certificate).toBeVisible();
  });

  test('recusa submit vazio e exibe mensagens obrigatórias', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.username.click();
    await login.password.click();
    await login.submitLogin();

    await expect(page.locator('.login-input--error').first()).toBeVisible();
    await expect(page.getByText('Digite o seu nome de usuário.')).toBeVisible();
    await expect(page.getByText('Digite a sua senha.')).toBeVisible();
    await expect(page).toHaveURL(isLoginUrl);
  });

  test('exibe erro de autenticação quando usuário ou senha são inválidos', async ({ page }) => {
    await mockLoginApis(page, 'unauthorized');
    const login = new LoginPage(page);
    await login.goto();
    await login.login(LoginFactory.credentials('invalid'));

    await expect(page.getByText('Usuário ou senha inválidos')).toBeVisible();
    await expect(page).toHaveURL(isLoginUrl);
    await expect(login.submit).toBeEnabled();
  });

  test('autentica administrador e abre a home', async ({ page }) => {
    await mockLoginApis(page, 'success');
    const login = new LoginPage(page);
    const home = new HomePage(page);

    await login.goto();
    await login.login(LoginFactory.credentials('admin'));
    await home.expectLoaded();
  });

  test('redireciona visitante sem sessão de /vbconnection/home para o login', async ({ page }) => {
    await gotoApp(page, '/vbconnection/home');
    await expect(page).toHaveURL(isLoginUrl);
    await expect(new LoginPage(page).heading).toBeVisible();
  });
});
