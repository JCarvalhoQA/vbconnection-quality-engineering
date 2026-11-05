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
import {
  camposObrigatoriosVisuais,
  isStableFieldId,
  labelSemAsterisco,
  loadUfUiProfile,
  UfUiProfile,
} from './ufUiProfile';

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
    if (campo.id) {
      await expect(page.locator(`#${campo.id}`)).toBeVisible();
    }
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
  if (profile.credor) {
    await expect(page.getByRole('heading', { name: 'Credor', exact: true })).toBeVisible();
  }
  if (profile.documentos) {
    await expect(page.getByRole('heading', { name: 'Documentos', exact: true })).toBeVisible();
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

export async function assertEspecificosCe(page: Page, contrato: ContratoPage, profile: UfUiProfile): Promise<void> {
  const ids = new Set([
    'taxaJurosMes',
    'dataPagamento',
    'epocaPagamento',
    'ufLocalPagamento',
    'cidadeLocalPagamento',
    'devedorCelular',
  ]);
  for (const field of profile.fields.filter((item) => item.id && ids.has(item.id))) {
    await assertCampoVisual(contrato, field);
  }
}

export async function assertEspecificosRo(page: Page, contrato: ContratoPage, profile: UfUiProfile): Promise<void> {
  await expect(contrato.veiculos.novoUsado).toHaveCount(0);
  const ids = new Set(['dataContrato', 'parcelas', 'totalFinanciamento']);
  for (const field of profile.fields.filter((item) => item.id && ids.has(item.id))) {
    await expect(page.locator(`#${field.id}`)).toBeVisible();
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
  if (profile.uf === 'RO') {
    await assertEspecificosRo(page, contrato, profile);
  }
}
