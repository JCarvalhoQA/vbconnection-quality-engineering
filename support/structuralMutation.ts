import { UFS_ESTRUTURAIS } from '../config/destinosEstruturais';
import { loadUfUiProfile, UfUiProfile } from './ufUiProfile';

/**
 * Mutation testing estrutural: muta clones locais do perfil UI.
 * Não grava LIVE-FIELD-INVENTORY.json nem fixtures/matriz.
 * O oráculo espelha as assertions reais de `page02Structural` / `VeiculoSection`.
 */

export type MutationKind =
  | 'remove-required-field'
  | 'alter-asterisk'
  | 'remove-tg'
  | 'add-tg'
  | 'change-zero-km-default'
  | 'hide-placa'
  | 'hide-renavam'
  | 'remove-chassi'
  | 'remove-gravame'
  | 'remove-section'
  | 'swap-uf';

export type MutationVerdict = 'detected' | 'survived' | 'invalid';

export interface MutationCase {
  readonly id: string;
  readonly uf: string;
  readonly kind: MutationKind;
  readonly suite: 'live' | 'mocked';
  readonly verdict: MutationVerdict;
  readonly findings: readonly string[];
  readonly reason?: string;
}

export interface MutationScore {
  readonly detected: number;
  readonly survived: number;
  readonly invalid: number;
  readonly score: number;
  readonly cases: readonly MutationCase[];
}

function mutate(profile: UfUiProfile, patch: (draft: Record<string, unknown>) => void): UfUiProfile {
  const draft = JSON.parse(JSON.stringify(profile)) as Record<string, unknown>;
  patch(draft);
  return draft as unknown as UfUiProfile;
}

function fieldIds(profile: UfUiProfile): string[] {
  return profile.fields.map((field) => field.id).filter((id): id is string => !!id);
}

function requiredIds(profile: UfUiProfile): string[] {
  return profile.fields.filter((field) => field.requiredVisual && field.id).map((field) => field.id as string);
}

function hasVehicleControl(profile: UfUiProfile, control: string): boolean {
  return (
    profile.veiculo.camposZeroKmSim.some((campo) => campo.formControl === control) ||
    profile.veiculo.camposCondicionaisNaoZeroKm.some((campo) => campo.formControl === control)
  );
}

function removeVehicleControl(profile: UfUiProfile, control: string): UfUiProfile {
  return mutate(profile, (draft) => {
    const veiculo = draft.veiculo as UfUiProfile['veiculo'];
    draft.veiculo = {
      ...veiculo,
      camposZeroKmSim: veiculo.camposZeroKmSim.filter((campo) => campo.formControl !== control),
      camposCondicionaisNaoZeroKm: veiculo.camposCondicionaisNaoZeroKm.filter((campo) => campo.formControl !== control),
    };
  });
}

/**
 * Espelha `assertCascaPorInventario` + `assertLinhaVeiculoEstrutural` (live).
 * Extra de campo opcional fora de TG / CE-MA pagamento / espécie / motor não é coberto.
 */
export function liveOracleFindings(expected: UfUiProfile, observed: UfUiProfile): string[] {
  const findings: string[] = [];

  for (const heading of expected.headings) {
    if (!observed.headings.includes(heading)) {
      findings.push(`missing-section:${heading}`);
    }
  }

  if (expected.terceiroGarantidor.visivel !== observed.terceiroGarantidor.visivel) {
    findings.push(expected.terceiroGarantidor.visivel ? 'missing-tg' : 'unexpected-tg');
  } else if (expected.terceiroGarantidor.visivel) {
    for (const campo of expected.terceiroGarantidor.campos) {
      const atual = observed.terceiroGarantidor.campos.find((item) => item.id === campo.id);
      if (!atual) {
        findings.push(`missing-tg-field:${campo.id ?? campo.label}`);
        continue;
      }
      if (atual.requiredVisual !== campo.requiredVisual) {
        findings.push(`tg-asterisk:${campo.id ?? campo.label}`);
      }
    }
  }

  for (const field of expected.fields.filter((item) => item.requiredVisual)) {
    const atual = observed.fields.find((item) => (field.id && item.id === field.id) || item.label === field.label);
    if (!atual) {
      findings.push(`missing-required:${field.id ?? field.label}`);
    } else if (!atual.requiredVisual) {
      findings.push(`asterisk-removed:${field.id ?? field.label}`);
    }
  }

  if (expected.credor !== observed.credor) {
    findings.push(expected.credor ? 'missing-credor' : 'unexpected-credor');
  }
  if (expected.documentos !== observed.documentos) {
    findings.push(expected.documentos ? 'missing-documentos' : 'unexpected-documentos');
  }

  const pagamento = ['taxaJurosMes', 'dataPagamento', 'epocaPagamento', 'ufLocalPagamento', 'cidadeLocalPagamento', 'devedorCelular'];
  if (expected.uf === 'CE' || expected.uf === 'MA') {
    for (const id of pagamento) {
      const exp = expected.fields.find((field) => field.id === id);
      if (!exp) {
        continue;
      }
      const atual = observed.fields.find((field) => field.id === id);
      if (!atual) {
        findings.push(`missing-payment:${id}`);
      } else if (atual.requiredVisual !== exp.requiredVisual) {
        findings.push(`payment-asterisk:${id}`);
      }
    }
  }
  if (expected.uf === 'MA' && !hasVehicleControl(observed, 'tipoEspecie')) {
    findings.push('missing-tipoEspecie');
  }
  if (expected.uf === 'RO' && observed.veiculo.novoUsado.visivel) {
    findings.push('unexpected-novo-usado');
  }

  if (expected.veiculo.zeroKm.default && expected.veiculo.zeroKm.default !== observed.veiculo.zeroKm.default) {
    findings.push('zero-km-default');
  }
  if (expected.veiculo.novoUsado.visivel !== observed.veiculo.novoUsado.visivel) {
    findings.push(expected.veiculo.novoUsado.visivel ? 'missing-novo-usado' : 'unexpected-novo-usado');
  }
  if (hasVehicleControl(expected, 'chassi') && !hasVehicleControl(observed, 'chassi')) {
    findings.push('missing-chassi');
  }
  if (hasVehicleControl(expected, 'restricao') && !hasVehicleControl(observed, 'restricao')) {
    findings.push('missing-gravame');
  }
  if (hasVehicleControl(expected, 'placa') && !hasVehicleControl(observed, 'placa')) {
    findings.push('missing-placa');
  }
  if (hasVehicleControl(expected, 'renavam') && !hasVehicleControl(observed, 'renavam')) {
    findings.push('missing-renavam');
  }
  if (hasVehicleControl(expected, 'tipoEspecie') !== hasVehicleControl(observed, 'tipoEspecie')) {
    findings.push(hasVehicleControl(expected, 'tipoEspecie') ? 'missing-tipoEspecie' : 'unexpected-tipoEspecie');
  }
  if (hasVehicleControl(expected, 'numeroMotor') && !hasVehicleControl(observed, 'numeroMotor')) {
    findings.push('missing-motor');
  }

  return [...new Set(findings)];
}

const MOCK_MIN_HEADINGS = ['Registrar contrato', 'Destino', 'Agente financeiro', 'Veículos', 'Contrato', 'Devedor'];

/**
 * Espelha o caminho mocked: seções mínimas + TG + linha de veículo.
 * Não cobre asteriscos de casca nem credor/documentos.
 */
export function mockedOracleFindings(expected: UfUiProfile, observed: UfUiProfile): string[] {
  const findings: string[] = [];
  for (const heading of MOCK_MIN_HEADINGS) {
    if (!observed.headings.includes(heading)) {
      findings.push(`missing-section:${heading}`);
    }
  }
  if (expected.terceiroGarantidor.visivel !== observed.terceiroGarantidor.visivel) {
    findings.push(expected.terceiroGarantidor.visivel ? 'missing-tg' : 'unexpected-tg');
  }
  if (expected.veiculo.zeroKm.default && expected.veiculo.zeroKm.default !== observed.veiculo.zeroKm.default) {
    findings.push('zero-km-default');
  }
  if (expected.veiculo.novoUsado.visivel !== observed.veiculo.novoUsado.visivel) {
    findings.push(expected.veiculo.novoUsado.visivel ? 'missing-novo-usado' : 'unexpected-novo-usado');
  }
  if (hasVehicleControl(expected, 'chassi') && !hasVehicleControl(observed, 'chassi')) {
    findings.push('missing-chassi');
  }
  if (hasVehicleControl(expected, 'restricao') && !hasVehicleControl(observed, 'restricao')) {
    findings.push('missing-gravame');
  }
  if (hasVehicleControl(expected, 'placa') && !hasVehicleControl(observed, 'placa')) {
    findings.push('missing-placa');
  }
  if (hasVehicleControl(expected, 'renavam') && !hasVehicleControl(observed, 'renavam')) {
    findings.push('missing-renavam');
  }
  if (hasVehicleControl(expected, 'tipoEspecie') !== hasVehicleControl(observed, 'tipoEspecie')) {
    findings.push(hasVehicleControl(expected, 'tipoEspecie') ? 'missing-tipoEspecie' : 'unexpected-tipoEspecie');
  }
  if (hasVehicleControl(expected, 'numeroMotor') && !hasVehicleControl(observed, 'numeroMotor')) {
    findings.push('missing-motor');
  }
  return [...new Set(findings)];
}

function applyKind(profile: UfUiProfile, kind: MutationKind, swapUf?: string): { next: UfUiProfile; invalid?: string } {
  switch (kind) {
    case 'remove-required-field': {
      const alvo = profile.fields.find((field) => field.requiredVisual && field.id && field.id !== 'destino');
      if (!alvo) {
        return { next: profile, invalid: 'sem campo obrigatório removível' };
      }
      return {
        next: mutate(profile, (draft) => {
          draft.fields = (draft.fields as UfUiProfile['fields']).filter((field) => field.id !== alvo.id);
        }),
      };
    }
    case 'alter-asterisk': {
      const alvo = profile.fields.find((field) => field.requiredVisual && field.id && field.id !== 'destino');
      if (!alvo) {
        return { next: profile, invalid: 'sem asterisco alterável' };
      }
      return {
        next: mutate(profile, (draft) => {
          draft.fields = (draft.fields as UfUiProfile['fields']).map((field) =>
            field.id === alvo.id ? { ...field, requiredVisual: false } : field,
          );
        }),
      };
    }
    case 'remove-tg': {
      if (!profile.terceiroGarantidor.visivel) {
        return { next: profile, invalid: 'UF sem Terceiro Garantidor' };
      }
      return {
        next: mutate(profile, (draft) => {
          draft.terceiroGarantidor = { visivel: false, campoCount: 0, campos: [] };
          draft.headings = (draft.headings as string[]).filter((heading) => !/terceiro garantidor/i.test(heading));
        }),
      };
    }
    case 'add-tg': {
      if (profile.terceiroGarantidor.visivel) {
        return { next: profile, invalid: 'UF já possui Terceiro Garantidor' };
      }
      return {
        next: mutate(profile, (draft) => {
          draft.terceiroGarantidor = {
            visivel: true,
            campoCount: 1,
            campos: [{ label: 'Nome', id: 'terceiroNome', requiredVisual: false }],
          };
          const headings = draft.headings as string[];
          if (!headings.some((heading) => /terceiro garantidor/i.test(heading))) {
            draft.headings = [...headings, 'Terceiro garantidor'];
          }
        }),
      };
    }
    case 'change-zero-km-default': {
      if (!profile.veiculo.zeroKm.default) {
        return { next: profile, invalid: 'UF sem default de Zero km' };
      }
      return {
        next: mutate(profile, (draft) => {
          const veiculo = draft.veiculo as UfUiProfile['veiculo'];
          const invertido = veiculo.zeroKm.default === 'Sim' ? 'Não' : 'Sim';
          draft.veiculo = { ...veiculo, zeroKm: { ...veiculo.zeroKm, default: invertido } };
        }),
      };
    }
    case 'hide-placa': {
      if (!hasVehicleControl(profile, 'placa')) {
        return { next: profile, invalid: 'UF sem Placa condicional' };
      }
      return { next: removeVehicleControl(profile, 'placa') };
    }
    case 'hide-renavam': {
      if (!hasVehicleControl(profile, 'renavam')) {
        return { next: profile, invalid: 'UF sem RENAVAM condicional' };
      }
      return { next: removeVehicleControl(profile, 'renavam') };
    }
    case 'remove-chassi': {
      if (!hasVehicleControl(profile, 'chassi')) {
        return { next: profile, invalid: 'UF sem Chassi' };
      }
      return { next: removeVehicleControl(profile, 'chassi') };
    }
    case 'remove-gravame': {
      if (!hasVehicleControl(profile, 'restricao')) {
        return { next: profile, invalid: 'UF sem Gravame' };
      }
      return { next: removeVehicleControl(profile, 'restricao') };
    }
    case 'remove-section': {
      const alvo = profile.headings.find((heading) => heading === 'Devedor' || heading === 'Contrato');
      if (!alvo) {
        return { next: profile, invalid: 'sem seção Devedor/Contrato' };
      }
      return {
        next: mutate(profile, (draft) => {
          draft.headings = (draft.headings as string[]).filter((heading) => heading !== alvo);
        }),
      };
    }
    case 'swap-uf': {
      if (!swapUf || swapUf === profile.uf) {
        return { next: profile, invalid: 'troca de UF inválida' };
      }
      return { next: loadUfUiProfile(swapUf) };
    }
    default:
      return { next: profile, invalid: 'operador desconhecido' };
  }
}

const KINDS: readonly MutationKind[] = [
  'remove-required-field',
  'alter-asterisk',
  'remove-tg',
  'add-tg',
  'change-zero-km-default',
  'hide-placa',
  'hide-renavam',
  'remove-chassi',
  'remove-gravame',
  'remove-section',
  'swap-uf',
];

function evaluate(
  expected: UfUiProfile,
  observed: UfUiProfile,
  suite: 'live' | 'mocked',
): string[] {
  return suite === 'live' ? liveOracleFindings(expected, observed) : mockedOracleFindings(expected, observed);
}

export function runStructuralMutations(ufs: readonly string[] = UFS_ESTRUTURAIS): MutationScore {
  const cases: MutationCase[] = [];

  for (const uf of ufs) {
    const expected = loadUfUiProfile(uf);
    if (!expected.formularioDisponivel) {
      for (const kind of KINDS) {
        for (const suite of ['live', 'mocked'] as const) {
          cases.push({
            id: `${uf}:${kind}:${suite}`,
            uf,
            kind,
            suite,
            verdict: 'invalid',
            findings: [],
            reason: 'formulário indisponível',
          });
        }
      }
      continue;
    }

    for (const kind of KINDS) {
      const swapUf = kind === 'swap-uf' ? (uf === 'BA' ? 'CE' : 'BA') : undefined;
      const applied = applyKind(expected, kind, swapUf);
      for (const suite of ['live', 'mocked'] as const) {
        const id = `${uf}:${kind}:${suite}`;
        if (applied.invalid) {
          cases.push({
            id,
            uf,
            kind,
            suite,
            verdict: 'invalid',
            findings: [],
            reason: applied.invalid,
          });
          continue;
        }
        const findings = evaluate(expected, applied.next, suite);
        cases.push({
          id,
          uf,
          kind,
          suite,
          verdict: findings.length ? 'detected' : 'survived',
          findings,
        });
      }
    }
  }

  const detected = cases.filter((item) => item.verdict === 'detected').length;
  const survived = cases.filter((item) => item.verdict === 'survived').length;
  const invalid = cases.filter((item) => item.verdict === 'invalid').length;
  const denom = detected + survived;
  return {
    detected,
    survived,
    invalid,
    score: denom === 0 ? 0 : detected / denom,
    cases,
  };
}

export function summarizeSurvivors(score: MutationScore): readonly MutationCase[] {
  return score.cases.filter((item) => item.verdict === 'survived');
}

export function fieldCoverageGap(profile: UfUiProfile): {
  readonly inventoried: number;
  readonly requiredAssertedLive: number;
  readonly optionalWithoutLiveAssert: number;
} {
  const inventoried = fieldIds(profile).length;
  const requiredAssertedLive = requiredIds(profile).length;
  return {
    inventoried,
    requiredAssertedLive,
    optionalWithoutLiveAssert: Math.max(0, inventoried - requiredAssertedLive),
  };
}
