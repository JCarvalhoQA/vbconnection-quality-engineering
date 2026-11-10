import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { NX_FUNCIONAL_PAGES, nxPageById } from '../config/nxPages';

test.describe('Catálogo de rotas NX @mocked', () => {
  const inventario = readFileSync('docs/qa-mapping/PAGE-INVENTORY.md', 'utf8');

  test('PAGE-02 a PAGE-08 batem com PAGE-INVENTORY.md', () => {
    for (const page of NX_FUNCIONAL_PAGES) {
      if (page.id === 'PAGE-HOME') {
        continue;
      }
      expect(inventario, page.id).toContain(page.rota);
      expect(inventario, page.id).toContain(page.id);
    }
  });

  test('PAGE-HOME não colide com PAGE-08 e tem POM', () => {
    const home = nxPageById('PAGE-HOME');
    const imagens = nxPageById('PAGE-08');
    expect(home.rota).not.toBe(imagens.rota);
    expect(home.pom).toBe('pages/homePage.ts');
    expect(imagens.titulo).toMatch(/por tela/i);
  });

  test('PAGE-03 a PAGE-08 não têm POM até o DOM NX ser comprovado', () => {
    const ids = ['PAGE-03', 'PAGE-04', 'PAGE-05', 'PAGE-06', 'PAGE-07', 'PAGE-08'] as const;
    const semPom = NX_FUNCIONAL_PAGES.filter((page) => (ids as readonly string[]).includes(page.id));
    expect(semPom).toHaveLength(6);
    for (const page of semPom) {
      expect(page.pom, page.id).toBeNull();
      expect(page.nxDom, page.id).toBe('NAO_MAPEADO');
    }
  });
});
