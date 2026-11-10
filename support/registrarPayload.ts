/**
 * Interpreta o corpo de POST contratos/registrar observado no browser.
 * Não inventa schema: JSON quando parseia; senão texto bruto.
 */
export interface RegistrarPayloadObservado {
  readonly method: string;
  readonly url: string;
  readonly bruto: string;
  readonly json: unknown;
}

export function interpretarPostData(postData: string | null | undefined): {
  bruto: string;
  json: unknown;
} {
  const bruto = postData ?? '';
  if (!bruto) {
    return { bruto: '', json: null };
  }
  try {
    return { bruto, json: JSON.parse(bruto) as unknown };
  } catch {
    return { bruto, json: null };
  }
}

export function payloadContemCampo(bruto: string, valor: string): boolean {
  return valor.length > 0 && bruto.includes(valor);
}
