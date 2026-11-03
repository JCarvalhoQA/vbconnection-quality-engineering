export type DetranUf =
  | 'AC'
  | 'AP'
  | 'BA'
  | 'DF'
  | 'ES'
  | 'MG'
  | 'MS'
  | 'MT'
  | 'PB'
  | 'PE'
  | 'PR'
  | 'RJ'
  | 'RN'
  | 'RR'
  | 'RS'
  | 'SC'
  | 'SE'
  | 'SP'
  | 'TO';

export interface DetranConfig {
  readonly uf: DetranUf;
  readonly id: number;
  readonly nomeFantasia: string;
  readonly razaoSocial: string;
  readonly alertaDevedor?: string;
  readonly travaUfDevedor?: boolean;
  readonly requerWebPki: boolean;
  readonly anoFabricacaoObrigatorio: boolean;
}

/**
 * IDs alinhados ao `DetranNumeroEnum` da UX (HMG quando diverge de PRD).
 * SE não possui enum no produto — ID sintético só para o combo mockado.
 */
export const DETRAN_CONFIG: Record<DetranUf, DetranConfig> = {
  SP: detran('SP', 1),
  PE: detran('PE', 3),
  SC: detran('SC', 4),
  MG: detran('MG', 9),
  PR: detran('PR', 10, {
    alertaDevedor: 'Atenção, no DETRAN PR é aceito apenas devedores que residam no Paraná.',
    travaUfDevedor: true,
    requerWebPki: true,
  }),
  RR: detran('RR', 11),
  PB: detran('PB', 13, {
    alertaDevedor: 'Atenção, no DETRAN PB é aceito apenas devedores que residam na Paraíba.',
    travaUfDevedor: true,
  }),
  BA: detran('BA', 14, { anoFabricacaoObrigatorio: false }),
  RJ: detran('RJ', 16, { requerWebPki: true }),
  AC: detran('AC', 17),
  TO: detran('TO', 122, { anoFabricacaoObrigatorio: false, requerWebPki: true }),
  AP: detran('AP', 225),
  MS: detran('MS', 226),
  RN: detran('RN', 228),
  ES: detran('ES', 230, { anoFabricacaoObrigatorio: false }),
  RS: detran('RS', 231, { anoFabricacaoObrigatorio: false }),
  DF: detran('DF', 232, { anoFabricacaoObrigatorio: false }),
  MT: detran('MT', 233, { anoFabricacaoObrigatorio: false }),
  SE: detran('SE', 27),
};

export const DETRAN_UFS = Object.keys(DETRAN_CONFIG) as DetranUf[];

export function detranConfig(uf: DetranUf): DetranConfig {
  return DETRAN_CONFIG[uf];
}

function detran(
  uf: DetranUf,
  id: number,
  extras: Partial<Pick<DetranConfig, 'alertaDevedor' | 'travaUfDevedor' | 'requerWebPki' | 'anoFabricacaoObrigatorio'>> = {},
): DetranConfig {
  return {
    uf,
    id,
    nomeFantasia: `DETRAN-${uf}`,
    razaoSocial: `DETRAN-${uf}`,
    requerWebPki: extras.requerWebPki ?? false,
    anoFabricacaoObrigatorio: extras.anoFabricacaoObrigatorio ?? true,
    alertaDevedor: extras.alertaDevedor,
    travaUfDevedor: extras.travaUfDevedor ?? false,
  };
}
