/**
 * Arquivos artificiais para PAGE-07/08. Não são documentos de cliente.
 * Gerados em memória — nada é enviado a backend real (persistGuard aborta POST).
 */
export const PDF_MINIMO_SINTETICO = Buffer.from(
  '%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n',
  'utf8',
);

export function arquivoVazio(): Buffer {
  return Buffer.alloc(0);
}

export function arquivoComExtensaoProibida(): { nome: string; bytes: Buffer } {
  return { nome: 'e2e-sintetico.exe', bytes: Buffer.from('MZ', 'utf8') };
}

export function pdfAcimaDoLimiteMb(limiteMb: number): Buffer {
  const bytes = Math.floor(limiteMb * 1024 * 1024) + 1;
  const cabecalho = PDF_MINIMO_SINTETICO;
  return Buffer.concat([cabecalho, Buffer.alloc(bytes - cabecalho.length)]);
}

export function zipSinteticoMinimo(): Buffer {
  return Buffer.from([
    0x50, 0x4b, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);
}
