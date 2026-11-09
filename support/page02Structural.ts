import { expect, Page } from '@playwright/test';
import { ContratoPage } from '../pages/contratoPage';
import {
  campoObrigatorio,
  loadMatrizFixture,
  SECAO_AGENTE,
  SECAO_CONTRATO,
  SECAO_DEVEDOR,
} from './matrizLoader';
import { installPersistAttemptLog, PersistAttemptLog } from './persistGuard';
import { assertCampoUnicoVisivel } from './ngZorroField';
import {
  camposObrigatoriosVisuais,
  isStableFieldId,
  labelSemAsterisco,
  loadUfUiProfile,
  UfUiProfile,
} from './ufUiProfile';
import { camposCascaAssertaveis, headingRenderizavelNoMock } from './uiFormMock';

export type Page02Mode = 'mocked' | 'live-readonly';

const SECOES_MINIMAS_MOCK = ['Registrar contrato', 'Destino', 'Agente financeiro', 'Veículos', 'Contrato', 'Devedor'];

export function rastrearMutacoes(page: Page): PersistAttemptLog {
  return installPersistAttemptLog(page);
}

export async function assertSecoes(page: Page, headings: readonly string[]): Promise<void> {
  for (const heading of headings) {
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
}

export async function assertSecoesMinimasMockadas(page: Page): Promise<void> {
  await assertSecoes(page, SECOES_MINIMAS_MOCK);
}

export async function assertSecoesInventarioMockadas(page: Page, profile: UfUiProfile): Promise<void> {
  await assertSecoesMinimasMockadas(page);
  const extras = profile.headings.filter(
    (heading) => headingRenderizavelNoMock(heading) && !(SECOES_MINIMAS_MOCK as readonly string[]).includes(heading),
  );
  await assertSecoes(page, extras);
}

export async function assertObrigatoriosVisuaisMockados(page: Page, contrato: ContratoPage, profile: UfUiProfile): Promise<void> {
  for (const field of camposCascaAssertaveis(profile)) {
    await assertCampoUnicoVisivel(page, field);
    await assertCampoVisual(contrato, field);
  }
}

/**
 * Casca mocked alinhada ao inventário live: seções, campos mapeados, `*` e TG/credor.
 * Não usa a matriz Java como fonte visual.
 */
export async function assertCascaMockadaPorInventario(
  page: Page,
  contrato: ContratoPage,
  profile: UfUiProfile,
): Promise<void> {
  await assertSecoesInventarioMockadas(page, profile);
  await assertObrigatoriosVisuaisMockados(page, contrato, profile);
  await assertTerceiroGarantidor(page, contrato, profile);
  await assertCredorDocumentosMockados(page, profile);
  if (profile.uf === 'CE') {
    await assertEspecificosCe(page, contrato, profile);
  }
  if (profile.uf === 'MA') {
    await assertEspecificosMa(page, contrato, profile);
  }
  if (profile.uf === 'RO') {
    await assertEspecificosRo(page, contrato, profile);
  }
}

export async function assertObrigatoriosVisuaisLive(contrato: ContratoPage, profile: UfUiProfile): Promise<void> {
  for (const field of camposObrigatoriosVisuais(profile)) {
    await expect(contrato.marcaObrigatorioCampo(field)).toBeVisible();
  }
}

export async function assertObrigatoriosVisuaisJavaBa(contrato: ContratoPage): Promise<void> {
  const matriz = loadMatrizFixture('BA');
  if (campoObrigatorio(matriz, SECAO_AGENTE, 'NOME') || campoObrigatorio(matriz, SECAO_AGENTE, 'NUMERO_DOCUMENTO')) {
    await expect(contrato.marcaObrigatorio('Agente financeiro')).toBeVisible();
  }
  if (campoObrigatorio(matriz, SECAO_CONTRATO, 'NUMERO')) {
    await expect(contrato.marcaObrigatorio('Número do Contrato')).toBeVisible();
  }
  if (campoObrigatorio(matriz, SECAO_DEVEDOR, 'NUMERO_DOCUMENTO')) {
    await expect(contrato.marcaObrigatorio('CPF / CNPJ')).toBeVisible();
  }
  if (campoObrigatorio(matriz, SECAO_DEVEDOR, 'NOME')) {
    await expect(contrato.marcaObrigatorio('Nome completo')).toBeVisible();
  }
}

export async function assertLinhaVeiculoEstrutural(contrato: ContratoPage, profile: UfUiProfile): Promise<void> {
  await contrato.veiculos.identificarSecao();
  await contrato.veiculos.abrirLinha();
  await contrato.veiculos.expectCamposIniciais(profile);
  await contrato.veiculos.expectNovoUsado(profile.veiculo.novoUsado.visivel, profile.veiculo.novoUsado.obrigatorioVisual);

  await contrato.veiculos.definirZeroKm('Não');
  await contrato.veiculos.expectCamposPlaca(true);

  await contrato.veiculos.definirZeroKm('Sim');
  await contrato.veiculos.expectCamposPlaca(false);

  await expect(contrato.veiculos.salvar).toBeVisible();
  await contrato.veiculos.descartarLinha();
}

export async function assertSemPersistenciaDefinitiva(
  page: Page,
  contrato: ContratoPage,
  log: PersistAttemptLog,
): Promise<void> {
  await expect(contrato.submit).toBeVisible();
  await expect(page).toHaveURL(/\/vbconnection\/contrato\/inserir/);
  const definitivas = log.tentativas.filter((item) =>
    /contratos\/registrar|upload|imagens|gravames|enviodocumento|salvar|gravar/i.test(item),
  );
  expect(definitivas, `mutações definitivas: ${definitivas.join(' | ')}`).toEqual([]);
}

export function perfilVisualUf(uf: string): UfUiProfile {
  const profile = loadUfUiProfile(uf);
  if (!profile.formularioDisponivel) {
    throw new Error(`${uf} deveria ter formulário no inventário live.`);
  }
  return profile;
}

export function perfilVisualBa(): UfUiProfile {
  return perfilVisualUf('BA');
}

export async function assertTerceiroGarantidor(page: Page, contrato: ContratoPage, profile: UfUiProfile): Promise<void> {
  const heading = page.getByRole('heading', { name: /terceiro garantidor/i });
  if (!profile.terceiroGarantidor.visivel) {
    await expect(heading).toHaveCount(0);
    return;
  }
  await expect(heading).toBeVisible();
  for (const campo of profile.terceiroGarantidor.campos) {
    const field =
      profile.fields.find((item) => item.id && item.id === campo.id) ?? {
        id: campo.id,
        label: campo.label,
        tag: 'input',
        secao: 'Terceiro garantidor',
      };
    await assertCampoUnicoVisivel(page, field);
    const asterisco = isStableFieldId(campo.id)
      ? page.locator(`#${campo.id}-label`).getByText('*')
      : contrato.marcaObrigatorio(labelSemAsterisco(campo.label), 'Terceiro garantidor');
    if (campo.requiredVisual) {
      await expect(asterisco).toBeVisible();
    } else {
      await expect(asterisco).toHaveCount(0);
    }
  }
}

export async function assertCredorDocumentos(page: Page, profile: UfUiProfile): Promise<void> {
  const credor = page.getByRole('heading', { name: 'Credor', exact: true });
  const documentos = page.getByRole('heading', { name: 'Documentos', exact: true });
  if (profile.credor) {
    await expect(credor).toBeVisible();
  } else {
    await expect(credor).toHaveCount(0);
  }
  if (profile.documentos) {
    await expect(documentos).toBeVisible();
  } else {
    await expect(documentos).toHaveCount(0);
  }
}

/**
 * Mocked: Credor segue o inventário via `/form/credor`.
 * Documentos não tem endpoint `/form` — no Angular mocked aparece em CE e some em BA.
 * Live continua assertando o heading do inventário; mocked não trata isso como sinal estável.
 */
export async function assertCredorDocumentosMockados(page: Page, profile: UfUiProfile): Promise<void> {
  const credor = page.getByRole('heading', { name: 'Credor', exact: true });
  if (profile.credor) {
    await expect(credor).toBeVisible();
  } else {
    await expect(credor).toHaveCount(0);
  }
}

export async function assertCampoVisual(
  contrato: ContratoPage,
  field: { label: string; secao: string; id: string | null; requiredVisual: boolean },
): Promise<void> {
  const marca = contrato.marcaObrigatorioCampo(field);
  if (field.requiredVisual) {
    await expect(marca).toBeVisible();
    return;
  }
  await expect(marca).toHaveCount(0);
}

const CAMPOS_PAGAMENTO_JUROS = new Set([
  'taxaJurosMes',
  'dataPagamento',
  'epocaPagamento',
  'ufLocalPagamento',
  'cidadeLocalPagamento',
  'devedorCelular',
]);

export async function assertCamposInventarioPorIds(
  page: Page,
  contrato: ContratoPage,
  profile: UfUiProfile,
  ids: ReadonlySet<string>,
): Promise<void> {
  for (const field of profile.fields.filter((item) => item.id && ids.has(item.id))) {
    await assertCampoUnicoVisivel(page, field);
    await assertCampoVisual(contrato, field);
  }
}

export async function assertEspecificosCe(page: Page, contrato: ContratoPage, profile: UfUiProfile): Promise<void> {
  await assertCamposInventarioPorIds(page, contrato, profile, CAMPOS_PAGAMENTO_JUROS);
}

export async function assertEspecificosMa(page: Page, contrato: ContratoPage, profile: UfUiProfile): Promise<void> {
  await assertCamposInventarioPorIds(page, contrato, profile, CAMPOS_PAGAMENTO_JUROS);
  expect(profile.terceiroGarantidor.visivel).toBe(true);
  expect(profile.veiculo.camposZeroKmSim.some((campo) => campo.formControl === 'tipoEspecie')).toBe(true);
}

export async function assertEspecificosRo(page: Page, contrato: ContratoPage, profile: UfUiProfile): Promise<void> {
  await expect(contrato.veiculos.novoUsado).toHaveCount(0);
  const ids = new Set(['dataContrato', 'parcelas', 'totalFinanciamento']);
  for (const field of profile.fields.filter((item) => item.id && ids.has(item.id))) {
    await assertCampoUnicoVisivel(page, field);
    await assertCampoVisual(contrato, field);
  }
}

export async function assertCascaPorInventario(page: Page, contrato: ContratoPage, profile: UfUiProfile): Promise<void> {
  await assertSecoes(page, profile.headings);
  await assertObrigatoriosVisuaisLive(contrato, profile);
  await assertTerceiroGarantidor(page, contrato, profile);
  await assertCredorDocumentos(page, profile);
  if (profile.uf === 'CE') {
    await assertEspecificosCe(page, contrato, profile);
  }
  if (profile.uf === 'MA') {
    await assertEspecificosMa(page, contrato, profile);
  }
  if (profile.uf === 'RO') {
    await assertEspecificosRo(page, contrato, profile);
  }
}
