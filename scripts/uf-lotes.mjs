/** Lotes estruturais PAGE-02. Espelha `config/destinosEstruturais.ts` — manter sincronizado. */

export const STRUCTURAL_UFS_IMPLEMENTED = [
  'AC',
  'AP',
  'BA',
  'CE',
  'DF',
  'ES',
  'MG',
  'MS',
  'MT',
  'PB',
  'PE',
  'PR',
  'RJ',
  'RN',
  'RO',
];

export const LOTE_MEMBERS = {
  baseline: ['BA', 'CE', 'RO'],
  'batch-01': ['AC', 'AP', 'DF', 'ES'],
  'batch-02': ['MG', 'MS', 'MT', 'PB'],
  'batch-03': ['PE', 'PR', 'RJ', 'RN'],
  'batch-04': ['RR', 'RS', 'SC', 'SP'],
  'batch-05': ['MA', 'TO'],
  excecao: ['SE'],
};

const LOTE_ORDER = ['baseline', 'batch-01', 'batch-02', 'batch-03', 'batch-04', 'batch-05', 'excecao'];

export function loteOf(uf) {
  const code = String(uf || '').toUpperCase();
  for (const name of LOTE_ORDER) {
    if (LOTE_MEMBERS[name].includes(code)) {
      return name;
    }
  }
  return 'nao-planejado';
}

export function describeLotes(ufs) {
  const list = [...new Set((ufs || []).map((item) => String(item || '').toUpperCase()).filter(Boolean))];
  if (!list.length) {
    return 'n/d';
  }
  const present = new Set(list.map(loteOf));
  const named = LOTE_ORDER.filter((name) => present.has(name));
  return named.length ? named.join(' + ') : 'n/d';
}

export function formatUfList(ufs) {
  const list = [...new Set((ufs || []).map((item) => String(item || '').toUpperCase()).filter(Boolean))].sort();
  return list.length ? list.join(', ') : 'n/d';
}
