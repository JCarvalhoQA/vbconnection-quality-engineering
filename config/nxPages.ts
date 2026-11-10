/**
 * Rotas pedidas da Nova UX (histórico de cliente via gotoApp).
 * HTTP GET direto em /vbconnection/* devolve 404 no Apache — CONFIRMADO em support/navigation.ts.
 * Permissões são do legado v2 até inspeção NX autenticada (bloqueada).
 * pom=null: não inventar Page Object sem DOM comprovado.
 */
export type NxPageId =
  | 'PAGE-HOME'
  | 'PAGE-02'
  | 'PAGE-03'
  | 'PAGE-04'
  | 'PAGE-05'
  | 'PAGE-06'
  | 'PAGE-07'
  | 'PAGE-08';

export type NxDomEvidence = 'CONFIRMADO_TESTE' | 'NAO_MAPEADO';

export interface NxFuncionalPage {
  readonly id: NxPageId;
  readonly titulo: string;
  readonly rota: string;
  readonly permissaoV2: string;
  readonly pom: string | null;
  readonly nxDom: NxDomEvidence;
}

export const NX_FUNCIONAL_PAGES: readonly NxFuncionalPage[] = [
  {
    id: 'PAGE-HOME',
    titulo: 'Home',
    rota: '/vbconnection/home',
    permissaoV2: 'autenticada',
    pom: 'pages/homePage.ts',
    nxDom: 'CONFIRMADO_TESTE',
  },
  {
    id: 'PAGE-02',
    titulo: 'Registro de contrato',
    rota: '/vbconnection/contrato/inserir',
    permissaoV2: 'CONTRATO_EDITAR',
    pom: 'pages/contratoPage.ts',
    nxDom: 'CONFIRMADO_TESTE',
  },
  {
    id: 'PAGE-03',
    titulo: 'Registro de aditivo',
    rota: '/vbconnection/contrato/aditivo/inserir',
    permissaoV2: 'CONTRATO_EDITAR',
    pom: null,
    nxDom: 'NAO_MAPEADO',
  },
  {
    id: 'PAGE-04',
    titulo: 'Aditivo RS',
    rota: '/vbconnection/contrato/aditivo-rs/inserir',
    permissaoV2: 'CONTRATO_EDITAR',
    pom: null,
    nxDom: 'NAO_MAPEADO',
  },
  {
    id: 'PAGE-05',
    titulo: 'Contratos em lote',
    rota: '/vbconnection/contrato/lote',
    permissaoV2: 'CONTRATO_EDITAR',
    pom: null,
    nxDom: 'NAO_MAPEADO',
  },
  {
    id: 'PAGE-06',
    titulo: 'Aditivos em lote',
    rota: '/vbconnection/contrato/aditivo/lote',
    permissaoV2: 'CONTRATO_EDITAR',
    pom: null,
    nxDom: 'NAO_MAPEADO',
  },
  {
    id: 'PAGE-07',
    titulo: 'Imagens em lote',
    rota: '/vbconnection/registrar/imagem/lote',
    permissaoV2: 'IMAGEM_UPLOAD',
    pom: null,
    nxDom: 'NAO_MAPEADO',
  },
  {
    id: 'PAGE-08',
    titulo: 'Imagens por tela',
    rota: '/vbconnection/registrar/imagem/tela',
    permissaoV2: 'IMAGEM_UPLOAD',
    pom: null,
    nxDom: 'NAO_MAPEADO',
  },
];

export function nxPageById(id: NxPageId): NxFuncionalPage {
  const page = NX_FUNCIONAL_PAGES.find((item) => item.id === id);
  if (!page) {
    throw new Error(`Página NX desconhecida: ${id}`);
  }
  return page;
}
