import { DETRAN_CONFIG, DETRAN_UFS, DetranUf, detranConfig } from './detransIds';
import detransJson from '../fixtures/detrans.json';
import detransIgnoradosJson from '../fixtures/detransIgnorados.json';

export { DETRAN_CONFIG, DETRAN_UFS, detranConfig };
export type { DetranUf };
export type { DetranConfig } from './detransIds';

export const detrans = detransJson;
export const detransIgnorados = detransIgnoradosJson;

export function normalizarUf(detranOuUf: string): string {
  return String(detranOuUf || '')
    .replace(/^DETRAN-/i, '')
    .toUpperCase();
}

export function nomeFantasia(uf: DetranUf): string {
  return detranConfig(uf).nomeFantasia;
}

export function obterDetransIgnorados(extras: string[] = []): string[] {
  return [...Object.values(detransIgnorados).flat(), ...extras];
}

/**
 * Lista DETRANs da fixture Cypress. Nos testes mockados do newfront
 * não aplica os ignorados de HMG (WebPKI/PR, SE, MS).
 */
export function listarDetransElegiveis(opcoes: { filtro?: string; ignorados?: string[] } = {}): string[] {
  const ignorados = opcoes.ignorados ?? [];
  return detrans.detrans
    .filter((detran) => !ignorados.includes(detran))
    .filter((detran) => !opcoes.filtro || detran === opcoes.filtro);
}

export function listarUfsElegiveis(opcoes: { filtro?: string; ignorados?: string[] } = {}): DetranUf[] {
  return listarDetransElegiveis(opcoes).map((detran) => normalizarUf(detran) as DetranUf);
}
