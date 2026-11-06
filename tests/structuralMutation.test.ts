import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { UFS_ESTRUTURAIS } from '../config/destinosEstruturais';
import { LIVE_INVENTORY_PATH } from '../support/repoPaths';
import { loadUfUiProfile } from '../support/ufUiProfile';
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

  test('oráculo mocked não cobre asterisco de casca; cobre TG e veículo', () => {
    const to = loadUfUiProfile('TO');
    const semAsterisco = {
      ...to,
      fields: to.fields.map((field) => (field.id === 'numeroContrato' ? { ...field, requiredVisual: false } : field)),
    };
    expect(mockedOracleFindings(to, semAsterisco)).toEqual([]);
    expect(liveOracleFindings(to, semAsterisco).some((item) => item.startsWith('asterisk-removed'))).toBe(true);

    const comTg = {
      ...to,
      terceiroGarantidor: { visivel: true, campoCount: 1, campos: [{ label: 'Nome', id: 'terceiroNome', requiredVisual: false }] },
    };
    expect(mockedOracleFindings(to, comTg)).toContain('unexpected-tg');
  });

  test('score das 21 UFs é reproduzível e mutações cobertas não sobrevivem no live', () => {
    const score = runStructuralMutations([...UFS_ESTRUTURAIS]);
    const survivors = summarizeSurvivors(score);
    const liveSurvivors = survivors.filter((item) => item.suite === 'live');
    expect(score.detected).toBe(378);
    expect(score.survived).toBe(42);
    expect(score.invalid).toBe(42);
    expect(score.score).toBeCloseTo(0.9, 4);
    const mockedAsterisk = score.cases.filter(
      (item) => item.kind === 'alter-asterisk' && item.suite === 'mocked' && item.verdict === 'survived',
    );

    expect(score.invalid).toBeGreaterThan(0);
    expect(score.detected).toBeGreaterThan(0);
    expect(score.score).toBeGreaterThan(0.7);
    expect(liveSurvivors.filter((item) => item.kind === 'remove-chassi')).toEqual([]);
    expect(liveSurvivors.filter((item) => item.kind === 'remove-gravame')).toEqual([]);
    expect(liveSurvivors.filter((item) => item.kind === 'hide-placa')).toEqual([]);
    expect(liveSurvivors.filter((item) => item.kind === 'change-zero-km-default')).toEqual([]);
    expect(liveSurvivors.filter((item) => item.kind === 'add-tg')).toEqual([]);
    expect(liveSurvivors.filter((item) => item.kind === 'remove-tg')).toEqual([]);
    expect(mockedAsterisk.length).toBeGreaterThan(0);
  });

  test('SE fica fora do denominador: formulário indisponível', () => {
    const se = runStructuralMutations(['SE']);
    expect(se.detected).toBe(0);
    expect(se.survived).toBe(0);
    expect(se.invalid).toBeGreaterThan(0);
    expect(se.score).toBe(0);
  });
});
