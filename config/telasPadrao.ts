export interface TelaPadraoNovaUx {
  readonly jira: string;
  readonly titulo: string;
  readonly rota: string;
}

/**
 * Telas [NOVA UX] Padrão em Pronto para Deploy que abrem nos dois alvos
 * (Docker :8080 e newfront). Rotas que ainda caem no 404 do Angular
 * (ex.: Detrans, Tasks, B3, Despachante, Logs) ficam fora até o bundle publicado
 * registrar o path.
 *
 * Fora do smoke: VA-1783 e VA-1794 (Aberto), VA-1791 (In Progress I).
 */
export const TELAS_PADRAO_NOVA_UX: readonly TelaPadraoNovaUx[] = [
  { jira: 'VA-1747', titulo: 'Gerar Relatório Analítico', rota: '/vbconnection/relatorio/faturamento' },
  { jira: 'VA-1748', titulo: 'Relatório de Disponibilidade', rota: '/vbconnection/relatorio/monitoramento' },
  { jira: 'VA-1755', titulo: 'Ranking Marca / Modelo', rota: '/vbconnection/relatorio/marca-modelo' },
  { jira: 'VA-1758', titulo: 'Envio de Documentos ao DETRAN', rota: '/vbconnection/relatorio/envio-documento-detran' },
  { jira: 'VA-1760', titulo: 'Gravames — DETRAN-CE', rota: '/vbconnection/relatorio/gravames-ce' },
  { jira: 'VA-1761', titulo: 'Gravames Pendentes — DETRAN-CE', rota: '/vbconnection/relatorio/gravames-pendentes-ce' },
  { jira: 'VA-1762', titulo: 'Relatório Clientes Inativos', rota: '/vbconnection/relatorio/clientes-inativos' },
  { jira: 'VA-1763', titulo: 'Valores de Serviços', rota: '/vbconnection/relatorio/valores-servicos' },
  { jira: 'VA-1764', titulo: 'Area Segura de Documentos', rota: '/vbconnection/documentos-seguros' },
  { jira: 'VA-1765', titulo: 'Credenciais Detran', rota: '/vbconnection/credenciais-detran' },
  { jira: 'VA-1766', titulo: 'Relatório de NFSE', rota: '/vbconnection/relatorio/nfse' },
  { jira: 'VA-1784', titulo: 'Clientes', rota: '/vbconnection/cliente' },
  { jira: 'VA-1786', titulo: 'Parametrização de Taxas', rota: '/vbconnection/administracao/gerar-taxas' },
  { jira: 'VA-1788', titulo: 'Serviços', rota: '/vbconnection/servico' },
  { jira: 'VA-1789', titulo: 'Serviços Detran', rota: '/vbconnection/servico-detran' },
  { jira: 'VA-1796', titulo: 'Financeiro', rota: '/vbconnection/financeiro' },
];
