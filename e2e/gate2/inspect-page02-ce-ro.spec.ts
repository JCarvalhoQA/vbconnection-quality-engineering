import { test, expect, Locator, Page } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { LoginPage } from '../../pages/loginPage';
import { ContratoPage } from '../../pages/contratoPage';
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

const GATE2 = process.env.PLAYWRIGHT_GATE2_LIVE === '1';

/**
 * Gate 2 — inspeção live-readonly PAGE-02 CE e RO (não é regressão).
 * Não clica em Salvar / Registrar. Não inclui CE/RO na suíte.
 */
test.describe('Gate 2 — inspeção PAGE-02 CE e RO @live-readonly', () => {
  test.skip(!GATE2, 'Gate 2 live exige PLAYWRIGHT_GATE2_LIVE=1 e autorização explícita.');
  test.describe.configure({ timeout: 240_000, retries: 0, mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    test.info().annotations.push({ type: 'mode', description: 'live-readonly' });
    await installPersistGuard(page, { mode: 'live-readonly' });
  });

  test('inspeciona PAGE-02 CE sem persistir', async ({ page }) => {
    await inspecionarUf(page, { uf: 'CE', destino: 'DETRAN-CE' });
  });

  test('inspeciona PAGE-02 RO sem persistir', async ({ page }) => {
    await inspecionarUf(page, { uf: 'RO', destino: 'DETRAN-RO' });
  });
});

async function inspecionarUf(
  page: Page,
  destino: { uf: string; destino: string },
): Promise<void> {
  const prefix = `gate2-${destino.uf.toLowerCase()}`;
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
  const capture: AuthCapture = {};
  await installAuthCapture(page, capture);

  await login.goto();
  await login.fillCredentials({ username: credenciais.username, password: credenciais.password });
  await login.submitLogin();
  await login.loader.waitUntilHidden();
  await expect.poll(() => capture.tokens?.status, { timeout: 30_000 }).toBe(200);
  const tokensResumo = summarizeAuthBody(capture.tokens?.body);
  if (tokensResumo.autenticaEmDuasEtapas || tokensResumo.passwordExpirado || !tokensResumo.hasToken) {
    throw new Error(`Gate 2 bloqueado: tokens ${JSON.stringify(tokensResumo)}`);
  }
  await expect.poll(() => capture.prefs2?.status, { timeout: 30_000 }).toBe(200);
  const perfil = assertMasterProfile(capture.prefs2?.body);
  await home.expectLoaded();

  await installDestinosCapture(page, capture);
  await contrato.acessar();
  await expect.poll(() => capture.destinos, { timeout: 20_000 }).toBeTruthy();
  const ufs = extractDestinoUfs(capture.destinos);
  writeGate0Json(`${prefix}-ufs.json`, { perfil, uf: destino.uf, ufs, destinoCombo: destino.destino });
  expect(ufs).toContain(destino.uf);

  await contrato.selectOption(contrato.destino, destino.destino);
  await expect(page.getByText('Carregando configuração do destino…')).toHaveCount(0, { timeout: 30_000 });
  await expect(page.getByRole('heading', { name: 'Agente financeiro' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Veículos' })).toBeVisible();
  await contrato.aguardarCarregamento();

  const pageInventory = await inventoryDeep(page);
  writeGate0Json(`${prefix}-page02-inventory.json`, {
    headings: pageInventory.headings,
    fields: pageInventory.fields,
    radios: pageInventory.radios,
    checkboxes: pageInventory.checkboxes,
    buttons: pageInventory.buttons.filter((label) => !/\d{1,2}:\d{2}|janderson|master/i.test(label)),
  });

  const headingTg = page.getByRole('heading', { name: /terceiro garantidor/i });
  const headingDocumentos = page.getByRole('heading', { name: /^Documentos$/i });
  const headingCredor = page.getByRole('heading', { name: /^Credor$/i });
  writeGate0Json(`${prefix}-secoes.json`, {
    uf: destino.uf,
    terceiroGarantidor: await headingTg.first().isVisible().catch(() => false),
    documentos: await headingDocumentos.first().isVisible().catch(() => false),
    credor: await headingCredor.first().isVisible().catch(() => false),
    headings: pageInventory.headings,
    requiredVisual: pageInventory.fields.filter((field) => field.requiredVisual).map((field) => ({
      label: field.label,
      secao: field.secao,
      formControl: field.formControl,
      id: field.id,
    })),
  });

  if (await headingTg.first().isVisible().catch(() => false)) {
    const tgFields = pageInventory.fields.filter((field) =>
      /garantidor|terceiro/i.test(`${field.secao} ${field.label} ${field.id}`),
    );
    writeGate0Json(`${prefix}-tg.json`, {
      visivel: true,
      campos: tgFields,
      persistencia: 'seção inspecionada sem preenchimento e sem Salvar',
    });
  } else {
    writeGate0Json(`${prefix}-tg.json`, { visivel: false, campos: [] });
  }

  const pageSelects: Record<string, string[]> = {
    destino: ['__omitido__', 'combo não reaberto após seleção; use destinos-combo / Alterar destino'],
  };
  pageSelects.agenteFinanceiro = await captureSelectOptions(
    page,
    page.getByRole('combobox', { name: /Agente financeiro/i }),
  );
  pageSelects.tipoRestricao = await captureSelectOptions(
    page,
    page.getByRole('combobox', { name: /Tipo de restrição/i }),
  );
  writeGate0Json(`${prefix}-page02-selects.json`, pageSelects);

  const secaoVeiculos = page.locator('article').filter({ has: page.getByRole('heading', { name: 'Veículos' }) });
  await expect(contrato.adicionarVeiculo).toBeVisible();
  await contrato.adicionarVeiculo.click();
  const chassi = secaoVeiculos.getByRole('textbox', { name: /^Chassi/i }).or(page.getByPlaceholder('Chassi'));
  await expect(chassi.first()).toBeVisible({ timeout: 15_000 });
  await captureSanitizedShot(page, `${prefix}-veiculo-form`);

  const formVeiculo = await inventoryDeep(page);
  writeGate0Json(`${prefix}-veiculo-default.json`, {
    tipo: 'formulario-inline-na-tabela',
    campos: camposDaSecaoVeiculos(formVeiculo.fields),
    radios: formVeiculo.radios,
    checkboxes: formVeiculo.checkboxes,
    adicionarDisabled: await contrato.adicionarVeiculo.isDisabled().catch(() => false),
  });

  const comboNovoUsado = secaoVeiculos.getByRole('combobox', { name: /Novo\s*\/\s*usado/i });
  const comboZeroKm = secaoVeiculos.getByRole('combobox', { name: /Veículo zero km/i });
  const radioSim = secaoVeiculos.getByRole('radio', { name: /^Sim$/i });
  const radioNao = secaoVeiculos.getByRole('radio', { name: /^Não$/i });
  const novoUsadoVisivel =
    (await comboNovoUsado.count()) > 0 && (await comboNovoUsado.first().isVisible().catch(() => false));
  const zeroKmEhCombo = (await comboZeroKm.count()) > 0 && (await comboZeroKm.first().isVisible().catch(() => false));
  const zeroKmEhRadio = (await radioSim.count()) > 0 && (await radioSim.first().isVisible().catch(() => false));

  await page.keyboard.press('Escape').catch(() => undefined);
  const veiculoSelects: Record<string, string[]> = {
    'Novo / usado': novoUsadoVisivel ? await captureSelectOptions(page, comboNovoUsado) : [],
    'Veículo zero km?': zeroKmEhCombo ? await captureSelectOptions(page, comboZeroKm) : [],
  };
  writeGate0Json(`${prefix}-indica-novo-usado.json`, {
    indicaTipo: novoUsadoVisivel ? 'combobox' : 'ausente',
    indicaVisible: novoUsadoVisivel,
    indicaObrigatorio: novoUsadoVisivel
      ? /\*/.test(
          (await secaoVeiculos.locator('label').filter({ hasText: /Novo\s*\/\s*usado/i }).first().innerText().catch(() => '')) ||
            '',
        )
      : false,
    zeroKmTipo: zeroKmEhCombo ? 'combobox' : zeroKmEhRadio ? 'radio' : 'ausente',
    zeroKmVisible: zeroKmEhCombo || zeroKmEhRadio,
    defaultZeroKm: await lerZeroKmDefault(comboZeroKm, radioSim, radioNao),
    options: veiculoSelects,
  });

  if (veiculoSelects['Novo / usado'].includes('Novo')) {
    await selectIfPresent(page, comboNovoUsado, 'Novo');
    writeGate0Json(`${prefix}-veiculo-novo.json`, {
      campos: camposDaSecaoVeiculos((await inventoryDeep(page)).fields),
    });
  }
  if (veiculoSelects['Novo / usado'].includes('Usado')) {
    await selectIfPresent(page, comboNovoUsado, 'Usado');
    writeGate0Json(`${prefix}-veiculo-usado.json`, {
      campos: camposDaSecaoVeiculos((await inventoryDeep(page)).fields),
    });
  }

  await setZeroKm(page, secaoVeiculos, 'Não', comboZeroKm, radioNao);
  writeGate0Json(`${prefix}-veiculo-nao-zerokm.json`, {
    campos: camposDaSecaoVeiculos((await inventoryDeep(page)).fields),
  });
  await setZeroKm(page, secaoVeiculos, 'Sim', comboZeroKm, radioSim);
  writeGate0Json(`${prefix}-veiculo-sim-zerokm.json`, {
    campos: camposDaSecaoVeiculos((await inventoryDeep(page)).fields),
  });

  const salvar = secaoVeiculos.getByRole('button', { name: /^Salvar$/i });
  const excluir = secaoVeiculos.getByRole('button', { name: /Excluir veículo/i });
  const cancelar = secaoVeiculos.getByRole('button', { name: /Cancelar/i });
  writeGate0Json(`${prefix}-veiculo-actions.json`, {
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
  await captureSanitizedShot(page, `${prefix}-page02-apos-descarte`);

  writeGate0Json(`${prefix}-status.json`, {
    status: 'OK',
    perfil,
    uf: destino.uf,
    abortados,
    persistencia: 'linha de veículo descartada; nenhum Salvar/Registrar',
  });
}

function camposDaSecaoVeiculos(
  fields: Array<{ secao: string | null; label: string; id: string | null; formControl: string | null }>,
) {
  return fields.filter(
    (field) =>
      field.secao === 'Veículos' ||
      /veículo|chassi|gravame|motor|novo|usado|zero km|placa|renavam|ano |marca|modelo|espécie|especie|remarcado/i.test(
        `${field.secao} ${field.label} ${field.id} ${field.formControl}`,
      ),
  );
}

async function lerZeroKmDefault(
  comboZeroKm: Locator,
  radioSim: Locator,
  radioNao: Locator,
): Promise<string | null> {
  if ((await comboZeroKm.count()) > 0 && (await comboZeroKm.first().isVisible().catch(() => false))) {
    const texto = (await comboZeroKm.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
    if (/não/i.test(texto)) {
      return 'Não';
    }
    if (/sim/i.test(texto)) {
      return 'Sim';
    }
    return texto || null;
  }
  if ((await radioSim.count()) > 0 && (await radioSim.first().isChecked().catch(() => false))) {
    return 'Sim';
  }
  if ((await radioNao.count()) > 0 && (await radioNao.first().isChecked().catch(() => false))) {
    return 'Não';
  }
  return null;
}

async function setZeroKm(
  page: Page,
  secaoVeiculos: Locator,
  valor: 'Sim' | 'Não',
  comboZeroKm: Locator,
  radioAlvo: Locator,
): Promise<void> {
  if ((await comboZeroKm.count()) > 0 && (await comboZeroKm.first().isVisible().catch(() => false))) {
    await selectIfPresent(page, comboZeroKm, valor);
    return;
  }
  const radio = secaoVeiculos.getByRole('radio', { name: new RegExp(`^${valor}$`, 'i') }).or(radioAlvo);
  if ((await radio.count()) > 0 && (await radio.first().isVisible().catch(() => false))) {
    await radio.first().click();
  }
}

async function selectIfPresent(page: Page, combobox: Locator, label: string): Promise<void> {
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
