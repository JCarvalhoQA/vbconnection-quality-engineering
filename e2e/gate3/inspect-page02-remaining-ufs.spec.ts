import { test, expect, Locator, Page } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { LoginPage } from '../../pages/loginPage';
import { ContratoPage } from '../../pages/contratoPage';
import { installPersistGuard } from '../../support/persistGuard';
import {
  assertMasterProfile,
  AuthCapture,
  captureSelectOptions,
  extractDestinoUfs,
  installAuthCapture,
  installDestinosCapture,
  inventoryDeep,
  requireMasterCredentials,
  summarizeAuthBody,
  writeGate0Json,
} from '../../support/liveInspect';

const GATE3 = process.env.PLAYWRIGHT_GATE3_LIVE === '1';

/** 19 UFs do combo live ainda sem inspeção PAGE-02 (BA/CE/RO já no Gate 1/2). */
const UFS_GATE3: Array<{ uf: string; destino: string }> = [
  { uf: 'AC', destino: 'DETRAN-AC' },
  { uf: 'AP', destino: 'DETRAN-AP' },
  { uf: 'DF', destino: 'DETRAN-DF' },
  { uf: 'ES', destino: 'DETRAN-ES' },
  { uf: 'MA', destino: 'DETRAN-MA' },
  { uf: 'MG', destino: 'DETRAN-MG' },
  { uf: 'MS', destino: 'DETRAN-MS' },
  { uf: 'MT', destino: 'DETRAN-MT' },
  { uf: 'PB', destino: 'DETRAN-PB' },
  { uf: 'PE', destino: 'DETRAN-PE' },
  { uf: 'PR', destino: 'DETRAN-PR' },
  { uf: 'RJ', destino: 'DETRAN-RJ' },
  { uf: 'RN', destino: 'DETRAN-RN' },
  { uf: 'RR', destino: 'DETRAN-RR' },
  { uf: 'RS', destino: 'DETRAN-RS' },
  { uf: 'SC', destino: 'DETRAN-SC' },
  { uf: 'SE', destino: 'DETRAN-SE' },
  { uf: 'SP', destino: 'DETRAN-SP' },
  { uf: 'TO', destino: 'DETRAN-TO' },
];

/**
 * Gate 3 — inspeção live-readonly das UFs restantes. Não é regressão.
 * Não clica em Salvar / Registrar. Não adiciona UFs à suíte.
 */
test.describe('Gate 3 — inspeção PAGE-02 UFs restantes @live-readonly', () => {
  test.skip(!GATE3, 'Gate 3 live exige PLAYWRIGHT_GATE3_LIVE=1 e autorização explícita.');
  test.describe.configure({ timeout: 720_000, retries: 0 });

  test.beforeEach(async ({ page }) => {
    test.info().annotations.push({ type: 'mode', description: 'live-readonly' });
    await installPersistGuard(page, { mode: 'live-readonly' });
  });

  test('inspeciona 19 UFs restantes sem persistir', async ({ page }) => {
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
      throw new Error(`Gate 3 bloqueado: tokens ${JSON.stringify(tokensResumo)}`);
    }
    await expect.poll(() => capture.prefs2?.status, { timeout: 30_000 }).toBe(200);
    const perfil = assertMasterProfile(capture.prefs2?.body);
    await home.expectLoaded();

    await installDestinosCapture(page, capture);
    const resumo: Array<Record<string, unknown>> = [];

    for (const destino of UFS_GATE3) {
      const item = await inspecionarUf(page, contrato, capture, perfil, abortados, destino);
      resumo.push(item);
    }

    writeGate0Json('gate3-index.json', {
      perfil,
      abortados,
      persistencia: 'nenhum Salvar/Registrar; linhas de veículo descartadas',
      ufs: resumo,
    });
  });
});

async function inspecionarUf(
  page: Page,
  contrato: ContratoPage,
  capture: AuthCapture,
  perfil: string,
  abortados: string[],
  destino: { uf: string; destino: string },
): Promise<Record<string, unknown>> {
  const prefix = `gate3-${destino.uf.toLowerCase()}`;
  const resultado: Record<string, unknown> = {
    uf: destino.uf,
    destino: destino.destino,
    formulario: false,
    status: 'PENDENTE',
  };

  try {
    capture.destinos = undefined;
    await contrato.acessar();
    await expect.poll(() => capture.destinos, { timeout: 20_000 }).toBeTruthy();
    const ufsCombo = extractDestinoUfs(capture.destinos);
    writeGate0Json(`${prefix}-ufs.json`, { perfil, uf: destino.uf, ufs: ufsCombo });
    if (!ufsCombo.includes(destino.uf)) {
      resultado.status = 'BLOQUEADO';
      resultado.motivo = 'UF ausente no destinos-combo desta sessão';
      writeGate0Json(`${prefix}-status.json`, { ...resultado, abortados });
      return resultado;
    }

    await contrato.selectOption(contrato.destino, destino.destino);
    const agente = page.getByRole('heading', { name: 'Agente financeiro' });
    const veiculos = page.getByRole('heading', { name: 'Veículos' });
    const formVisivel = await agente
      .waitFor({ state: 'visible', timeout: 25_000 })
      .then(() => true)
      .catch(() => false);
    if (!formVisivel) {
      await contrato.aguardarCarregamento();
      const inventory = await inventoryDeep(page);
      resultado.status = 'SEM_FORMULARIO';
      resultado.formulario = false;
      resultado.headings = inventory.headings;
      writeGate0Json(`${prefix}-page02-inventory.json`, {
        headings: inventory.headings,
        fields: inventory.fields,
        buttons: inventory.buttons.filter((label) => !/\d{1,2}:\d{2}|janderson|master/i.test(label)),
      });
      writeGate0Json(`${prefix}-status.json`, { ...resultado, abortados });
      return resultado;
    }

    await expect(veiculos).toBeVisible({ timeout: 15_000 });
    await contrato.aguardarCarregamento();

    const pageInventory = await inventoryDeep(page);
    const requiredVisual = pageInventory.fields.filter((field) => field.requiredVisual);
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
    const secoes = {
      uf: destino.uf,
      terceiroGarantidor: await headingTg.first().isVisible().catch(() => false),
      documentos: await headingDocumentos.first().isVisible().catch(() => false),
      credor: await headingCredor.first().isVisible().catch(() => false),
      headings: pageInventory.headings,
      fieldCount: pageInventory.fields.length,
      requiredCount: requiredVisual.length,
      requiredVisual: requiredVisual.map((field) => ({
        label: field.label,
        secao: field.secao,
        formControl: field.formControl,
        id: field.id,
      })),
    };
    writeGate0Json(`${prefix}-secoes.json`, secoes);

    if (secoes.terceiroGarantidor) {
      writeGate0Json(`${prefix}-tg.json`, {
        visivel: true,
        campos: pageInventory.fields.filter((field) =>
          /garantidor|terceiro/i.test(`${field.secao} ${field.label} ${field.id}`),
        ),
      });
    } else {
      writeGate0Json(`${prefix}-tg.json`, { visivel: false, campos: [] });
    }

    const secaoVeiculos = page.locator('article').filter({ has: page.getByRole('heading', { name: 'Veículos' }) });
    const adicionarVisivel = await contrato.adicionarVeiculo.isVisible().catch(() => false);
    if (adicionarVisivel) {
      await contrato.adicionarVeiculo.click();
      const chassi = secaoVeiculos.getByRole('textbox', { name: /^Chassi/i }).or(page.getByPlaceholder('Chassi'));
      const linhaAberta = await chassi
        .first()
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (linhaAberta) {
        const formVeiculo = await inventoryDeep(page);
        writeGate0Json(`${prefix}-veiculo-default.json`, {
          tipo: 'formulario-inline-na-tabela',
          campos: camposDaSecaoVeiculos(formVeiculo.fields),
        });

        const comboNovoUsado = secaoVeiculos.getByRole('combobox', { name: /Novo\s*\/\s*usado/i });
        const comboZeroKm = secaoVeiculos.getByRole('combobox', { name: /Veículo zero km/i });
        const radioSim = secaoVeiculos.getByRole('radio', { name: /^Sim$/i });
        const radioNao = secaoVeiculos.getByRole('radio', { name: /^Não$/i });
        const novoUsadoVisivel =
          (await comboNovoUsado.count()) > 0 && (await comboNovoUsado.first().isVisible().catch(() => false));
        const zeroKmEhCombo =
          (await comboZeroKm.count()) > 0 && (await comboZeroKm.first().isVisible().catch(() => false));
        const zeroKmEhRadio =
          (await radioSim.count()) > 0 && (await radioSim.first().isVisible().catch(() => false));

        await page.keyboard.press('Escape').catch(() => undefined);
        const veiculoSelects = {
          'Novo / usado': novoUsadoVisivel ? await captureSelectOptions(page, comboNovoUsado) : [],
          'Veículo zero km?': zeroKmEhCombo ? await captureSelectOptions(page, comboZeroKm) : [],
        };
        writeGate0Json(`${prefix}-indica-novo-usado.json`, {
          indicaTipo: novoUsadoVisivel ? 'combobox' : 'ausente',
          indicaVisible: novoUsadoVisivel,
          indicaObrigatorio: novoUsadoVisivel
            ? /\*/.test(
                (await secaoVeiculos
                  .locator('label')
                  .filter({ hasText: /Novo\s*\/\s*usado/i })
                  .first()
                  .innerText()
                  .catch(() => '')) || '',
              )
            : false,
          zeroKmTipo: zeroKmEhCombo ? 'combobox' : zeroKmEhRadio ? 'radio' : 'ausente',
          zeroKmVisible: zeroKmEhCombo || zeroKmEhRadio,
          defaultZeroKm: await lerZeroKmDefault(comboZeroKm, radioSim, radioNao),
          options: veiculoSelects,
        });

        if (zeroKmEhCombo || zeroKmEhRadio) {
          await setZeroKm(page, secaoVeiculos, 'Não', comboZeroKm, radioNao);
          writeGate0Json(`${prefix}-veiculo-nao-zerokm.json`, {
            campos: camposDaSecaoVeiculos((await inventoryDeep(page)).fields),
          });
          await setZeroKm(page, secaoVeiculos, 'Sim', comboZeroKm, radioSim);
        }

        const excluir = secaoVeiculos.getByRole('button', { name: /Excluir veículo/i });
        if (await excluir.first().isVisible().catch(() => false)) {
          await excluir.first().click();
          const confirmar = page.getByRole('dialog').getByRole('button', { name: /Sim|Confirmar|Excluir/i });
          if (await confirmar.first().isVisible().catch(() => false)) {
            await confirmar.first().click();
          }
          await page.getByText(/Nenhum veículo/i).waitFor({ timeout: 8_000 }).catch(() => undefined);
        }
      }
    }

    resultado.formulario = true;
    resultado.status = 'OK';
    resultado.fieldCount = secoes.fieldCount;
    resultado.requiredCount = secoes.requiredCount;
    resultado.terceiroGarantidor = secoes.terceiroGarantidor;
    resultado.documentos = secoes.documentos;
    resultado.credor = secoes.credor;
    writeGate0Json(`${prefix}-status.json`, {
      ...resultado,
      perfil,
      abortados,
      persistencia: 'linha de veículo descartada; nenhum Salvar/Registrar',
    });
    return resultado;
  } catch (error) {
    resultado.status = 'BLOQUEADO';
    resultado.motivo = error instanceof Error ? error.message.slice(0, 240) : 'erro';
    writeGate0Json(`${prefix}-status.json`, { ...resultado, abortados });
    return resultado;
  }
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
