import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { UFS_ESTRUTURAIS } from '../config/destinosEstruturais';
import { LIVE_INVENTORY_PATH } from '../support/repoPaths';
import { loadUfUiProfile } from '../support/ufUiProfile';
import { camposCascaAssertaveis } from '../support/uiFormMock';
import {
  liveOracleFindings,
  mockedOracleFindings,
  runStructuralMutations,
  summarizeSurvivors,
} from '../support/structuralMutation';

test.describe('Mutation testing estrutural PAGE-02 @mocked', () => {
  test('não altera o inventário live versionado', () => {
    expect(existsSync(LIVE_INVENTORY_PATH)).toBe(true);
    const before = readFileSync(LIVE_INVENTORY_PATH, 'utf8');
    runStructuralMutations(['BA', 'MA', 'TO']);
    expect(readFileSync(LIVE_INVENTORY_PATH, 'utf8')).toBe(before);
  });

  test('oráculo live detecta remoção de obrigatório, TG indevido e Zero km', () => {
    const ba = loadUfUiProfile('BA');
    const semNumero = {
      ...ba,
      fields: ba.fields.filter((field) => field.id !== 'numeroContrato'),
    };
    expect(liveOracleFindings(ba, semNumero).some((item) => item.startsWith('missing-required'))).toBe(true);

    const comTg = {
      ...ba,
      terceiroGarantidor: { visivel: true, campoCount: 1, campos: [{ label: 'Nome', id: 'terceiroNome', requiredVisual: false }] },
    };
    expect(liveOracleFindings(ba, comTg)).toContain('unexpected-tg');

    const zeroKm = {
      ...ba,
      veiculo: { ...ba.veiculo, zeroKm: { ...ba.veiculo.zeroKm, default: 'Não' } },
    };
    expect(liveOracleFindings(ba, zeroKm)).toContain('zero-km-default');
  });

  test('oráculo mocked detecta asterisco e campo obrigatório de casca', () => {
    const to = loadUfUiProfile('TO');
    const alvo = camposCascaAssertaveis(to).find((field) => field.requiredVisual && field.id);
    expect(alvo?.id).toBeTruthy();

    const semAsterisco = {
      ...to,
      fields: to.fields.map((field) => (field.id === alvo!.id ? { ...field, requiredVisual: false } : field)),
    };
    expect(mockedOracleFindings(to, semAsterisco).some((item) => item.startsWith('asterisk-removed'))).toBe(true);

    const semCampo = {
      ...to,
      fields: to.fields.filter((field) => field.id !== alvo!.id),
    };
    expect(mockedOracleFindings(to, semCampo).some((item) => item.startsWith('missing-required'))).toBe(true);

    const comTg = {
      ...to,
      terceiroGarantidor: { visivel: true, campoCount: 1, campos: [{ label: 'Nome', id: 'terceiroNome', requiredVisual: false }] },
    };
    expect(mockedOracleFindings(to, comTg)).toContain('unexpected-tg');
  });

  test('score das 21 UFs detecta o catálogo válido; erros não inflacionam o score', () => {
    const score = runStructuralMutations([...UFS_ESTRUTURAIS]);
    const survivors = summarizeSurvivors(score);
    expect(score.error).toBe(0);
    expect(score.invalid).toBe(42);
    expect(score.survived).toBe(0);
    expect(survivors).toEqual([]);
    expect(score.detected).toBe(420);
    expect(score.score).toBe(1);
    expect(score.cases.filter((item) => item.kind === 'alter-asterisk' && item.suite === 'mocked' && item.verdict === 'detected')).toHaveLength(21);
    expect(score.cases.filter((item) => item.kind === 'remove-required-field' && item.suite === 'mocked' && item.verdict === 'detected')).toHaveLength(21);
  });

  test('SE fica fora do denominador: formulário indisponível', () => {
    const se = runStructuralMutations(['SE']);
    expect(se.detected).toBe(0);
    expect(se.survived).toBe(0);
    expect(se.error).toBe(0);
    expect(se.invalid).toBeGreaterThan(0);
    expect(se.score).toBe(0);
  });
});
