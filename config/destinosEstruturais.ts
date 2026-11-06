/**
 * Destinos da inspeção estrutural PAGE-02.
 * A suíte de registro (`DetranUf`) não ganha UFs novas por este arquivo.
 * CE/RO/MA continuam fora do registro persistente.
 */
export interface DestinoEstrutural {
  readonly uf: string;
  readonly id: number;
  readonly nomeFantasia: string;
  readonly razaoSocial: string;
}

/** Specs estruturais já implementadas (baseline + lotes 1–4). */
export const UFS_ESTRUTURAIS = ['BA', 'CE', 'RO', 'AC', 'AP', 'DF', 'ES', 'MG', 'MS', 'MT', 'PB', 'PE', 'PR', 'RJ', 'RN', 'RR', 'RS', 'SC', 'SP'] as const;
export type UfEstrutural = (typeof UFS_ESTRUTURAIS)[number];

export const LOTE_BASELINE = ['BA', 'CE', 'RO'] as const;
export const LOTE_01 = ['AC', 'AP', 'DF', 'ES'] as const;
export const LOTE_02 = ['MG', 'MS', 'MT', 'PB'] as const;
export const LOTE_03 = ['PE', 'PR', 'RJ', 'RN'] as const;
export const LOTE_04 = ['RR', 'RS', 'SC', 'SP'] as const;
export const LOTE_05 = ['MA', 'TO'] as const;
export const LOTE_EXCECAO = ['SE'] as const;

export const DESTINOS_ESTRUTURAIS: Record<UfEstrutural, DestinoEstrutural> = {
  BA: destino('BA', 14),
  CE: destino('CE', 236),
  RO: destino('RO', 234),
  AC: destino('AC', 17),
  AP: destino('AP', 225),
  DF: destino('DF', 232),
  ES: destino('ES', 230),
  MG: destino('MG', 9),
  MS: destino('MS', 226),
  MT: destino('MT', 233),
  PB: destino('PB', 13),
  PE: destino('PE', 3),
  PR: destino('PR', 10),
  RJ: destino('RJ', 16),
  RN: destino('RN', 228),
  RR: destino('RR', 11),
  RS: destino('RS', 231),
  SC: destino('SC', 4),
  SP: destino('SP', 1),
};

function destino(uf: UfEstrutural, id: number): DestinoEstrutural {
  return { uf, id, nomeFantasia: `DETRAN-${uf}`, razaoSocial: `DETRAN-${uf}` };
}

export function isUfEstrutural(uf: string): uf is UfEstrutural {
  return (UFS_ESTRUTURAIS as readonly string[]).includes(uf);
}

export function destinoEstrutural(uf: string): DestinoEstrutural {
  if (!isUfEstrutural(uf)) {
    throw new Error(`${uf}: destino estrutural não implementado (lote atual: ${UFS_ESTRUTURAIS.join(',')}).`);
  }
  return DESTINOS_ESTRUTURAIS[uf];
}

export function destinosEstruturaisCombo(): DestinoEstrutural[] {
  return UFS_ESTRUTURAIS.map((uf) => DESTINOS_ESTRUTURAIS[uf]);
}

export function loteEstruturalDe(uf: string): string {
  if ((LOTE_BASELINE as readonly string[]).includes(uf)) {
    return 'baseline';
  }
  if ((LOTE_01 as readonly string[]).includes(uf)) {
    return '01';
  }
  if ((LOTE_02 as readonly string[]).includes(uf)) {
    return '02';
  }
  if ((LOTE_03 as readonly string[]).includes(uf)) {
    return '03';
  }
  if ((LOTE_04 as readonly string[]).includes(uf)) {
    return '04';
  }
  if ((LOTE_05 as readonly string[]).includes(uf)) {
    return '05';
  }
  if ((LOTE_EXCECAO as readonly string[]).includes(uf)) {
    return 'excecao';
  }
  return 'nao-planejado';
}
