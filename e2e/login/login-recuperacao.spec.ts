import { test, expect } from '@playwright/test';
import { LoginFactory } from '../../factories/loginFactory';
import { mockLoginApis, mockRecuperacaoSenha } from '../../support/auth';
import { LoginPage } from '../../pages/loginPage';
import { RecuperacaoSenhaComponent } from '../../pages/recuperacaoSenhaPage';

test.describe('Login — recuperação de senha @regression @login', () => {
  test('abre a etapa Redefinir senha a partir de Esqueceu a senha?', async ({ page }) => {
    const login = new LoginPage(page);
    const recuperacao = new RecuperacaoSenhaComponent(page);

    await login.goto();
    await login.forgotPassword.click();
    await recuperacao.expectVisible();
    await expect(
      page.getByText('Informe o nome de usuário para receber as instruções de redefinição.'),
    ).toBeVisible();
    await expect(recuperacao.submit()).toBeDisabled();
  });

  test('mostra erro obrigatório ao tocar no campo de usuário vazio', async ({ page }) => {
    const login = new LoginPage(page);
    const recuperacao = new RecuperacaoSenhaComponent(page);

    await login.goto();
    await login.forgotPassword.click();
    await recuperacao.usuario().focus();
    await recuperacao.usuario().blur();

    await expect(page.getByText('Informe o usuário.')).toBeVisible();
  });

  test('envia o link e exibe mensagem de sucesso', async ({ page }) => {
    await mockLoginApis(page);
    await mockRecuperacaoSenha(page, 'success');
    const login = new LoginPage(page);
    const recuperacao = new RecuperacaoSenhaComponent(page);

    await login.goto();
    await login.forgotPassword.click();
    await recuperacao.usuario().fill(LoginFactory.credentials('admin').username);
    await expect(recuperacao.submit()).toBeEnabled();
    await recuperacao.submit().click();

    await expect(recuperacao.sucesso()).toBeVisible();
    await expect(recuperacao.sucesso()).toHaveText(
      /Um link com as instruções de redefinição da sua senha foi enviado para o seu e-mail cadastrado/,
    );

    await expect(login.heading).toBeVisible({ timeout: 8_000 });
  });

  test('informa usuário inválido quando a API retorna 500', async ({ page }) => {
    test.fixme(
      true,
      'GET /auth/{usuario}/recuperarSenha com 500 não atualiza a UI no newfront (botão permanece desabilitado e a mensagem de usuário inválido não aparece). O Vitest do componente cobre este comportamento.',
    );

    await mockLoginApis(page);
    await mockRecuperacaoSenha(page, 'invalidUser');
    const login = new LoginPage(page);
    const recuperacao = new RecuperacaoSenhaComponent(page);

    await login.goto();
    await login.forgotPassword.click();
    await recuperacao.usuario().fill(LoginFactory.credentials('invalid').username);

    const recovery = page.waitForResponse(
      (response) =>
        response.url().includes('recuperarSenha') && response.request().method() === 'GET',
    );
    await recuperacao.submit().click();
    expect((await recovery).status()).toBe(500);

    await expect(page.getByText('Por favor, tente colocar um usuário válido.')).toBeVisible();
    await expect(recuperacao.sucesso()).toHaveCount(0);
  });

  test('volta para o login pelo botão Voltar', async ({ page }) => {
    const login = new LoginPage(page);
    const recuperacao = new RecuperacaoSenhaComponent(page);

    await login.goto();
    await login.forgotPassword.click();
    await recuperacao.voltar().click();
    await expect(login.heading).toBeVisible();
  });
});
