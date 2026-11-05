import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { test, expect } from '@playwright/test';
import { loadMatrizFixture } from '../support/matrizLoader';

import { MATRIZ_FORM_PATH, REPO_ROOT } from '../support/repoPaths';

const sourcePath = MATRIZ_FORM_PATH;
const fixtureDir = join(REPO_ROOT, 'fixtures', 'matriz');

const JAVA_UFS = [
  'AC',
  'AP',
  'BA',
  'CE',
  'DF',
  'ES',
  'MG',
  'MS',
  'MT',
  'PB',
  'PE',
  'PR',
  'RJ',
  'RN',
  'RO',
  'RR',
  'RS',
  'SC',
  'SP',
  'TO',
] as const;

test.describe('E2-04 fixtures determinísticas @mocked', () => {
  test('20 UFs Java, hash estável, sem timestamp nem PII', () => {
    const sourceRaw = readFileSync(sourcePath);
    const expectedHash = createHash('sha256').update(sourceRaw).digest('hex').slice(0, 16);
    const source = JSON.parse(sourceRaw.toString('utf8'));
    const todas = JSON.parse(readFileSync(join(fixtureDir, 'todas.json'), 'utf8'));

    expect(Object.keys(todas).sort()).toEqual([...JAVA_UFS]);
    expect(source.ufs.sort()).toEqual([...JAVA_UFS]);

    for (const uf of JAVA_UFS) {
      const fixture = JSON.parse(readFileSync(join(fixtureDir, `${uf}.json`), 'utf8'));
      expect(fixture.fonteHash).toBe(expectedHash);
      expect(fixture.geradoEm).toBeUndefined();
      expect(todas[uf].fonteHash).toBe(expectedHash);
      const dump = JSON.stringify(fixture);
      expect(dump).not.toMatch(/password|secret|token|Bearer /i);
      expect(dump).not.toMatch(/@vbtech|@gmail|@hotmail/i);
    }

    expect(() => loadMatrizFixture('BA')).not.toThrow();
  });
});
