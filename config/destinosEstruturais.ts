/**
 * Destinos usados só na inspeção estrutural PAGE-02.
 * Não entram em `DetranUf` / `DETRAN_UFS` — a suíte de registro permanece sem CE/RO.
 */
export interface DestinoEstrutural {
  readonly uf: string;
  readonly id: number;
  readonly nomeFantasia: string;
  readonly razaoSocial: string;
}

export const UFS_ESTRUTURAIS = ['BA', 'CE', 'RO'] as const;
export type UfEstrutural = (typeof UFS_ESTRUTURAIS)[number];

export const DESTINOS_ESTRUTURAIS: Record<UfEstrutural, DestinoEstrutural> = {
  BA: { uf: 'BA', id: 14, nomeFantasia: 'DETRAN-BA', razaoSocial: 'DETRAN-BA' },
  CE: { uf: 'CE', id: 236, nomeFantasia: 'DETRAN-CE', razaoSocial: 'DETRAN-CE' },
  RO: { uf: 'RO', id: 234, nomeFantasia: 'DETRAN-RO', razaoSocial: 'DETRAN-RO' },
};

export function isUfEstrutural(uf: string): uf is UfEstrutural {
  return (UFS_ESTRUTURAIS as readonly string[]).includes(uf);
}

export function destinoEstrutural(uf: string): DestinoEstrutural {
  if (!isUfEstrutural(uf)) {
    throw new Error(`${uf}: destino estrutural não mapeado (apenas BA/CE/RO).`);
  }
  return DESTINOS_ESTRUTURAIS[uf];
}

export function destinosEstruturaisCombo(): DestinoEstrutural[] {
  return UFS_ESTRUTURAIS.map((uf) => DESTINOS_ESTRUTURAIS[uf]);
}
