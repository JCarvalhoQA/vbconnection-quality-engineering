import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test.describe('Quality gates PAGE-02 @mocked', () => {
  test('quality:gates aprova os invariantes de desenvolvimento sem credencial Master', () => {
    const result = spawnSync(process.execPath, ['scripts/quality-gates.mjs'], {
      encoding: 'utf8',
      env: { ...process.env, PLAYWRIGHT_MODE: 'mocked', QUALITY_GATES_REQUIRE_E2E: '' },
    });
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(result.stdout).toContain('gate-6-live');
    expect(result.stdout).toContain('PASS');
    expect(existsSync('test-results/quality-gates.json')).toBe(true);
    expect(existsSync('test-results/uf-quality-indicators.json')).toBe(true);
    const report = JSON.parse(readFileSync('test-results/quality-gates.json', 'utf8'));
    expect(report.ok).toBe(true);
    expect(report.indicators.counts.implemented).toBe(21);
    expect(report.indicators.maFixtureExists).toBe(false);
  });

  test('indicadores classificam MA/TO como LIVE_PENDING e 19 UFs como histórico', () => {
    const result = spawnSync(process.execPath, ['scripts/quality-gates.mjs'], {
      encoding: 'utf8',
      env: { ...process.env, PLAYWRIGHT_MODE: 'mocked', QUALITY_GATES_REQUIRE_E2E: '' },
    });
    expect(result.status, result.stderr || result.stdout).toBe(0);
    const indicators = JSON.parse(readFileSync('test-results/uf-quality-indicators.json', 'utf8'));
    expect(indicators.classification.LIVE_PENDING).toEqual(['MA', 'TO']);
    expect(indicators.classification.NOT_APPLICABLE).toEqual(['SE']);
    expect(indicators.classification.LIVE_PASSED).toEqual([]);
    expect(indicators.counts.livePassedHistorical).toBe(19);
    expect(indicators.ufs.MA.liveStatus).toBe('LIVE_PENDING');
    expect(indicators.ufs.TO.liveStatus).toBe('LIVE_PENDING');
    expect(indicators.ufs.BA.liveStatus).toBe('LIVE_PASSED_HISTORICAL');
    expect(indicators.ufs.SP.liveStatus).toBe('LIVE_PASSED_HISTORICAL');
    expect(indicators.ufs.BA.liveCoversCurrentSha).toBe(false);
    expect(indicators.credentialStatus).toBe('BLOCKED_SECURITY_CREDENTIAL_ROTATION');
    expect(indicators.liveOnCurrentSha).toBe(false);
    expect(indicators.se.liveStatus).toBe('NOT_APPLICABLE');
    expect(indicators.shaDiagnosis).toMatch(/não é aprovação/i);
    expect(indicators.headCatalogado).toMatch(/^d4c4aa6/);
  });
});
