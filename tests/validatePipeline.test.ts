import { spawnSync } from 'node:child_process';
import { test, expect } from '@playwright/test';

test.describe('Canários de pipeline @mocked', () => {
  test('validate-pipeline-local cobre extração de UFs, lotes e ci-select', () => {
    const result = spawnSync(process.execPath, ['scripts/validate-pipeline-local.mjs'], {
      encoding: 'utf8',
    });
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(result.stdout).toContain('validate-pipeline-local: canários locais aprovados');
  });
});
