import { test, expect } from '@playwright/test';
import {
  PDF_MINIMO_SINTETICO,
  arquivoVazio,
  arquivoComExtensaoProibida,
  pdfAcimaDoLimiteMb,
  zipSinteticoMinimo,
} from '../fixtures/imagens/arquivosSinteticos';

test.describe('fixtures sintéticas de imagem @mocked', () => {
  test('PDF mínimo começa com %PDF e não é vazio', () => {
    expect(PDF_MINIMO_SINTETICO.subarray(0, 5).toString('utf8')).toBe('%PDF-');
    expect(PDF_MINIMO_SINTETICO.length).toBeGreaterThan(0);
  });

  test('arquivo vazio tem 0 bytes', () => {
    expect(arquivoVazio().length).toBe(0);
  });

  test('extensão proibida não usa nome de cliente', () => {
    const arquivo = arquivoComExtensaoProibida();
    expect(arquivo.nome).toBe('e2e-sintetico.exe');
    expect(arquivo.nome).not.toMatch(/testeimagem/i);
  });

  test('PDF acima do limite MT 3,5 MB ultrapassa o teto', () => {
    const limite = 3.5;
    const bytes = pdfAcimaDoLimiteMb(limite);
    expect(bytes.length).toBeGreaterThan(limite * 1024 * 1024);
    expect(bytes.subarray(0, 5).toString('utf8')).toBe('%PDF-');
  });

  test('ZIP sintético começa com PK', () => {
    expect(zipSinteticoMinimo().subarray(0, 2).toString('utf8')).toBe('PK');
  });
});
