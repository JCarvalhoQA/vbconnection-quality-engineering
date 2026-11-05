import { test, expect, Locator } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { LoginPage } from '../../pages/loginPage';
import { ContratoPage } from '../../pages/contratoPage';
import { detranConfig } from '../../config/detransIds';
import { installPersistGuard } from '../../support/persistGuard';
import {
  assertMasterProfile,
  AuthCapture,
  captureSanitizedShot,
  captureSelectOptions,
  extractDestinoUfs,
  installAuthCapture,
  installDestinosCapture,
  inventoryDeep,
  requireMasterCredentials,
  summarizeAuthBody,
  writeGate0Json,
} from '../../support/liveInspect';

const GATE1 = process.env.PLAYWRIGHT_GATE1_LIVE === '1';

/**
 * Gate 1 — inspeção live-readonly PAGE-02 BA + formulário inline de veículo.
 * Não clica em Salvar / Registrar. Descarte: Excluir veículo na linha não persistida.
 */
test.describe('Gate 1 — inspeção PAGE-02 BA modal veículo @live-readonly', () => {
  test.skip(!GATE1, 'Gate 1 live exige PLAYWRIGHT_GATE1_LIVE=1 e autorização explícita.');
  test.describe.configure({ timeout: 180_000, retries: 0 });

  test.beforeEach(async ({ page }) => {
    test.info().annotations.push({ type: 'mode', description: 'live-readonly' });
    await installPersistGuard(page, { mode: 'live-readonly' });
  });

  test('abre modal de veículo BA, inventaria campos e cancela sem persistir', async ({ page }) => {
    const credenciais = requireMasterCredentials();
    const abortados: string[] = [];
    page.on('requestfailed', (request) => {
      const failure = request.failure()?.errorText || '';
      if (/blockedbyclient|ERR_BLOCKED/i.test(failure) && /POST|PUT|PATCH|DELETE/i.test(request.method())) {
        abortados.push(`${request.method()} ${request.url()}`);
      }
    });

    const login = new LoginPage(page);
    const home = new HomePage(page);
    const contrato = new ContratoPage(page);
    const ba = detranConfig('BA');
    const capture: AuthCapture = {};
    await installAuthCapture(page, capture);

    await login.goto();
    await login.fillCredentials({ username: credenciais.username, password: credenciais.password });
    await login.submitLogin();
    await login.loader.waitUntilHidden();
    await expect.poll(() => capture.tokens?.status, { timeout: 30_000 }).toBe(200);
    const tokensResumo = summarizeAuthBody(capture.tokens?.body);
    if (tokensResumo.autenticaEmDuasEtapas || tokensResumo.passwordExpirado || !tokensResumo.hasToken) {
      throw new Error(`Gate 1 bloqueado: tokens ${JSON.stringify(tokensResumo)}`);
    }
    await expect.poll(() => capture.prefs2?.status, { timeout: 30_000 }).toBe(200);
    const perfil = assertMasterProfile(capture.prefs2?.body);
    await home.expectLoaded();

    await installDestinosCapture(page, capture);
    await contrato.acessar();
    await expect.poll(() => capture.destinos, { timeout: 20_000 }).toBeTruthy();
    const ufs = extractDestinoUfs(capture.destinos);
    writeGate0Json('gate1-ufs.json', { perfil, ufs });
    expect(ufs).toContain('BA');

    await contrato.selecionarDetran(ba);
    await expect(page.getByRole('heading', { name: 'Agente financeiro' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Veículos' })).toBeVisible();
    await contrato.aguardarCarregamento();

    const pageInventory = await inventoryDeep(page);
    writeGate0Json('gate1-page02-inventory.json', pageInventory);

    const pageSelects: Record<string, string[]> = {
      destino: ['__omitido__', 'combo desabilitado após seleção; use destinos-combo'],
    };
    pageSelects.agenteFinanceiro = await captureSelectOptions(
      page,
      page.getByRole('combobox', { name: /Agente financeiro/i }),
    );
    pageSelects.tipoRestricao = await captureSelectOptions(
      page,
      page.getByRole('combobox', { name: /Tipo de restrição/i }),
    );
    writeGate0Json('gate1-page02-selects.json', pageSelects);

    const numero = page.getByRole('textbox', { name: /Número do Contrato/i }).first();
    if (await numero.isVisible()) {
      await numero.click();
      await numero.fill('');
      await numero.press('Tab');
    }
    const pageValidation = await inventoryDeep(page);
    writeGate0Json('gate1-page02-validation.json', {
      explains: pageValidation.fields.filter((field) => field.validation),
    });

    const secaoVeiculos = page.locator('article').filter({ has: page.getByRole('heading', { name: 'Veículos' }) });
    await expect(contrato.adicionarVeiculo).toBeVisible();
    await contrato.adicionarVeiculo.click();
    const chassi = secaoVeiculos.getByRole('textbox', { name: /^Chassi/i }).or(page.getByPlaceholder('Chassi'));
    await expect(chassi.first()).toBeVisible({ timeout: 15_000 });
    await captureSanitizedShot(page, 'gate1-veiculo-form');

    const formVeiculo = await inventoryDeep(page);
    const camposVeiculo = formVeiculo.fields.filter(
      (field) =>
        /veículo|chassi|gravame|motor|novo|usado|zero km|placa|renavam|ano /i.test(
          `${field.secao} ${field.label} ${field.id} ${field.formControl}`,
        ) || field.secao === 'Veículos',
    );
    writeGate0Json('gate1-veiculo-modal.json', {
      tipo: 'formulario-inline-na-tabela',
      naoEhDialog: true,
      campos: camposVeiculo,
      radios: formVeiculo.radios,
      checkboxes: formVeiculo.checkboxes,
      adicionarDisabled: await contrato.adicionarVeiculo.isDisabled().catch(() => false),
    });

    const comboNovoUsado = secaoVeiculos.getByRole('combobox', { name: /Novo\s*\/\s*usado/i });
    const comboZeroKm = secaoVeiculos.getByRole('combobox', { name: /Veículo zero km/i });
    const veiculoSelects: Record<string, string[]> = {
      'Novo / usado': await captureSelectOptions(page, comboNovoUsado),
      'Veículo zero km?': await captureSelectOptions(page, comboZeroKm),
    };
    writeGate0Json('gate1-indica-novo-usado.json', {
      indicaTipo: (await comboNovoUsado.count()) > 0 ? 'combobox' : 'ausente',
      indicaVisible: await comboNovoUsado.first().isVisible().catch(() => false),
      indicaObrigatorio: true,
      defaultZeroKm: 'Sim',
      options: veiculoSelects,
    });

    if (veiculoSelects['Novo / usado'].includes('Novo')) {
      await selectIfPresent(page, comboNovoUsado, 'Novo');
      writeGate0Json('gate1-veiculo-novo.json', {
        campos: (await inventoryDeep(page)).fields.filter((field) => field.secao === 'Veículos'),
      });
    }
    if (veiculoSelects['Novo / usado'].includes('Usado')) {
      await selectIfPresent(page, comboNovoUsado, 'Usado');
      writeGate0Json('gate1-veiculo-usado.json', {
        campos: (await inventoryDeep(page)).fields.filter((field) => field.secao === 'Veículos'),
      });
    }

    if (veiculoSelects['Veículo zero km?'].includes('Não')) {
      await selectIfPresent(page, comboZeroKm, 'Não');
      writeGate0Json('gate1-veiculo-nao-zerokm.json', {
        campos: (await inventoryDeep(page)).fields.filter((field) => field.secao === 'Veículos'),
      });
    }

    await chassi.first().click();
    await chassi.first().fill('A');
    await chassi.first().press('Tab');
    writeGate0Json('gate1-veiculo-validation.json', {
      fields: (await inventoryDeep(page)).fields.filter((field) => field.secao === 'Veículos' && field.validation),
    });
    writeGate0Json('gate1-veiculo-selects.json', veiculoSelects);

    const salvar = secaoVeiculos.getByRole('button', { name: /^Salvar$/i });
    const excluir = secaoVeiculos.getByRole('button', { name: /Excluir veículo/i });
    const cancelar = secaoVeiculos.getByRole('button', { name: /Cancelar/i });
    writeGate0Json('gate1-veiculo-actions.json', {
      salvarVisible: await salvar.isVisible().catch(() => false),
      cancelarVisible: await cancelar.first().isVisible().catch(() => false),
      excluirVisible: await excluir.first().isVisible().catch(() => false),
      persistencia: 'Salvar NÃO clicado; descarte via Excluir veículo na linha não persistida',
    });

    await expect(excluir.first()).toBeVisible();
    await excluir.first().click();
    const confirmar = page.getByRole('button', { name: /Sim|Confirmar|Excluir/i });
    if (await confirmar.first().isVisible().catch(() => false)) {
      await confirmar.first().click();
    }
    await expect(page.getByText(/Nenhum veículo/i)).toBeVisible({ timeout: 10_000 });
    await captureSanitizedShot(page, 'gate1-page02-apos-cancelar');

    writeGate0Json('gate1-status.json', {
      status: 'OK',
      perfil,
      abortados,
      ufs,
      persistencia: 'modal cancelado; nenhum Salvar/Registrar',
    });
  });
});

async function selectIfPresent(page: import('@playwright/test').Page, combobox: Locator, label: string): Promise<void> {
  if ((await combobox.count()) === 0 || !(await combobox.first().isVisible().catch(() => false))) {
    return;
  }
  await combobox.first().click();
  const option = page.locator('.cdk-overlay-pane').getByText(label, { exact: true }).last();
  if (await option.isVisible().catch(() => false)) {
    await option.click();
  } else {
    await page.keyboard.press('Escape');
  }
}
