import { readFileSync } from 'fs';
import { LIVE_INVENTORY_PATH } from './repoPaths';

/**
 * Perfil visual da PAGE-02 por UF.
 *
 * Fonte: `docs/qa-mapping/etapa-5/LIVE-FIELD-INVENTORY.json` (evidência live versionada).
 * Não carrega a matriz Java. Regras de backend continuam em `matrizLoader`.
 */
export type RuleProvenance = 'LIVE_DOM' | 'LIVE_UI' | 'JAVA' | 'MOCK' | 'PENDENTE';

export type RuleConfidence = 'CONFIRMADA_LIVE' | 'CONFIRMADA_JAVA' | 'CONFIRMADA_MOCK' | 'PENDENTE';

export { LIVE_INVENTORY_PATH } from './repoPaths';

export interface LiveTgCampo {
  readonly label: string;
  readonly formControl?: string | null;
  readonly id: string | null;
  readonly requiredVisual: boolean;
}

export interface LiveField {
  readonly secao: string;
  readonly label: string;
  readonly tag: string;
  readonly formControl: string | null;
  readonly id: string | null;
  readonly requiredVisual: boolean;
  readonly maxlength: number | null;
  readonly placeholder: string | null;
  readonly disabled: boolean;
}

export interface LiveVeiculoCampo {
  readonly label: string;
  readonly formControl: string;
  readonly requiredVisual: boolean;
}

export interface LiveVeiculoProfile {
  readonly novoUsado: {
    readonly visivel: boolean;
    readonly obrigatorioVisual: boolean;
    readonly tipo: string;
    readonly opcoes: readonly string[];
  };
  readonly zeroKm: {
    readonly visivel: boolean;
    readonly tipo: string;
    readonly default: string | null;
    readonly opcoes: readonly string[];
  };
  readonly camposZeroKmSim: readonly LiveVeiculoCampo[];
  readonly camposCondicionaisNaoZeroKm: readonly LiveVeiculoCampo[];
}

export interface UfUiProfile {
  readonly uf: string;
  readonly origem: 'LIVE_FIELD_INVENTORY';
  readonly evidencia: string;
  readonly confianca: 'CONFIRMADA_LIVE';
  readonly idCombo: number;
  readonly formularioDisponivel: boolean;
  readonly matrizJava: boolean;
  readonly suitePlaywright: boolean;
  readonly headings: readonly string[];
  readonly fieldCount: number;
  readonly requiredVisualCount: number;
  readonly fields: readonly LiveField[];
  readonly veiculo: LiveVeiculoProfile;
  readonly terceiroGarantidor: {
    readonly visivel: boolean;
    readonly campoCount: number;
    readonly campos: readonly LiveTgCampo[];
  };
  readonly credor: boolean;
  readonly documentos: boolean;
}

interface LiveInventoryFile {
  readonly geradoEm?: string;
  readonly fonte?: string;
  readonly ufs: Record<string, RawUfInventory>;
}

interface RawUfInventory {
  readonly uf: string;
  readonly idCombo: number;
  readonly formularioDisponivel: boolean;
  readonly matrizJava: boolean;
  readonly suitePlaywright: boolean;
  readonly headings: string[];
  readonly fieldCount: number;
  readonly requiredVisualCount: number;
  readonly fields: LiveField[];
  readonly veiculo: LiveVeiculoProfile;
  readonly terceiroGarantidor: {
    visivel: boolean;
    campoCount: number;
    campos?: LiveTgCampo[];
  };
  readonly credor: boolean;
  readonly documentos: boolean;
  readonly evidencia?: string;
}

let cache: LiveInventoryFile | undefined;

export class UfUiProfileError extends Error {
  readonly uf: string;

  constructor(uf: string, message: string) {
    super(message);
    this.name = 'UfUiProfileError';
    this.uf = uf;
  }
}

export function liveInventoryPath(): string {
  return LIVE_INVENTORY_PATH;
}

export function loadLiveInventory(): LiveInventoryFile {
  if (cache) {
    return cache;
  }
  const raw = readFileSync(LIVE_INVENTORY_PATH, 'utf8');
  cache = JSON.parse(raw) as LiveInventoryFile;
  if (!cache.ufs || typeof cache.ufs !== 'object') {
    throw new Error(`LIVE-FIELD-INVENTORY.json inválido em ${LIVE_INVENTORY_PATH}`);
  }
  return cache;
}

export function hasUfUiProfile(uf: string): boolean {
  return Object.prototype.hasOwnProperty.call(loadLiveInventory().ufs, uf);
}

export function loadUfUiProfile(uf: string): UfUiProfile {
  const entry = loadLiveInventory().ufs[uf];
  if (!entry) {
    throw new UfUiProfileError(uf, `${uf}: sem perfil em LIVE-FIELD-INVENTORY.json`);
  }
  return {
    uf: entry.uf,
    origem: 'LIVE_FIELD_INVENTORY',
    evidencia: entry.evidencia ?? 'GATE3',
    confianca: 'CONFIRMADA_LIVE',
    idCombo: entry.idCombo,
    formularioDisponivel: entry.formularioDisponivel,
    matrizJava: entry.matrizJava,
    suitePlaywright: entry.suitePlaywright,
    headings: entry.headings,
    fieldCount: entry.fieldCount,
    requiredVisualCount: entry.requiredVisualCount,
    fields: entry.fields,
    veiculo: entry.veiculo,
    terceiroGarantidor: {
      visivel: entry.terceiroGarantidor.visivel,
      campoCount: entry.terceiroGarantidor.campoCount,
      campos: entry.terceiroGarantidor.campos ?? [],
    },
    credor: entry.credor,
    documentos: entry.documentos,
  };
}

export function labelSemAsterisco(label: string): string {
  return String(label || '')
    .replace(/\s*\*+\s*$/g, '')
    .trim();
}

export function escapeRegExp(valor: string): string {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function rotuloExato(label: string): RegExp {
  return new RegExp(`^${escapeRegExp(labelSemAsterisco(label))}\\s*\\*?$`);
}

export function isStableFieldId(id: string | null | undefined): boolean {
  if (!id) {
    return false;
  }
  return !/-veic-/i.test(id) && !/\d{10,}/.test(id);
}

export function camposObrigatoriosVisuais(profile: UfUiProfile): readonly LiveField[] {
  return profile.fields.filter((field) => field.requiredVisual);
}

export function sourcedLiveRule(
  profile: UfUiProfile,
  descricao: string,
): { origem: RuleProvenance; confianca: RuleConfidence; evidencia: string; descricao: string; uf: string } {
  return {
    origem: 'LIVE_DOM',
    confianca: profile.confianca,
    evidencia: profile.evidencia,
    descricao,
    uf: profile.uf,
  };
}
