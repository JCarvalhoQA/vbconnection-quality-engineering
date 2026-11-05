# Matriz de cenários

Particionamento: um feliz e um negativo genéricos por página; UFs só onde a matriz diverge (trava, TG, limites de upload, tipo aditivo, SE).

| ID | Página | UF | Título | Pré-condições | Massa | Passos | Resultado esperado | Prioridade | Tipo | Status | Automatizável | Evidência |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCN-LGN-01 | PAGE-01 | — | Exibe formulário de login | newfront no ar | nenhuma | Abrir / | heading, usuário, senha, Entrar, certificado | P0 | interface | Confirmado | Sim | CONFIRMADO_DOM |
| SCN-LGN-02 | PAGE-01 | — | Submit vazio | tela login | vazios | Clicar Entrar | msgs obrigatórias; permanece / | P0 | negativo | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-LGN-03 | PAGE-01 | — | Credencial inválida | mock 401 | invalid | Submeter | Usuário ou senha inválidos | P0 | negativo | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-LGN-04 | PAGE-01 | — | Bloqueio 5ª tentativa | mock 401 | invalid x5 | Cinco submits | Usuário bloqueado | P1 | negativo | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-LGN-05 | PAGE-01 | — | Login administrador (mock) | mock tokens | admin | Submeter | home Bem-vindo | P0 | positivo | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-LGN-06 | PAGE-01 | — | Deep link home sem sessão | sem token | — | gotoApp /vbconnection/home | volta ao login | P0 | segurança | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-LGN-07 | PAGE-01 | — | 2FA | mock twoFactor | persona 2FA | Submeter | heading verificação; Continuar disabled | P1 | positivo | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-LGN-08 | PAGE-01 | — | Logout | sessão mock | admin | Sair + Sim | URL login | P1 | positivo | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-LGN-09 | PAGE-01 | — | Senha expirada no newfront | massa e2e | admin real | Login real | Alterar senha; botão disabled; política 8/Aa/esp/núm | P0 | segurança | Confirmado | Sim | CONFIRMADO_UI |
| SCN-LGN-10 | PAGE-01 | — | Login Master | credencial Master | Master | Login | home + menus Master | P0 | segurança | Bloqueado | Depende | BLK-01 |
| SCN-LGN-11 | PAGE-01 | — | Falha de rede no token | mock abort | offline | Submeter | instabilidade | P2 | integração | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-LGN-12 | PAGE-01 | — | Certificado digital | Web PKI | cert | Clicar certificado | fluxo nativo | P3 | positivo | Hipótese | Não | NÃO_ANALISADO |
| SCN-CTR-01 | PAGE-02 | todas PW | Destino revela seções | sessão + mock combo | DETRAN-UF | Selecionar destino | headings Agente e Veículos; some loading | P0 | positivo | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-CTR-02 | PAGE-02 | todas PW | Obrigatórios vazios | destino selecionado | vazios | Registrar contrato | toasts veículo + obrigatórios; permanece na rota | P0 | negativo | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-CTR-03 | PAGE-02 | todas PW | Registro feliz mock | mock POST registrar | factory UF | Preencher recorte POM e enviar | protocolo RECEBIDO; toast sucesso | P0 | positivo | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-CTR-04 | PAGE-02 | — | Chassi ≠ 17 | modal veículo | 16/18 chars | Salvar | validação — **NÃO CONFIRMADO** na UI | P1 | negativo | Hipótese | Sim | INFERIDO |
| SCN-CTR-05 | PAGE-02 | — | CPF/CNPJ inválido | devedor | doc inválido | blur/submit | mensagem — **NÃO CONFIRMADO** | P1 | negativo | Hipótese | Sim | INFERIDO |
| SCN-CTR-06 | PAGE-02 | — | Data inválida / Enter no datepicker | contrato | data má | Enter vs Tab | Enter submete; usar Tab | P1 | interface | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-CTR-07 | PAGE-02 | — | POST registrar 5xx | mock 500 | massa válida | Enviar | erro visível, sem navegar | P1 | integração | Hipótese | Sim | candidato |
| SCN-CTR-08 | PAGE-02 | — | Timeout DETRAN | mock delay | massa | Enviar | não vazar conexão (VA-1585) | P1 | integração | Hipótese | Sim | spec I/O |
| SCN-CTR-09 | PAGE-02 | — | Acesso sem CONTRATO_EDITAR | roles vazias | — | goto inserir | redirect acessoNaoPermitido | P0 | segurança | Hipótese | Sim | INFERIDO v2 guard |
| SCN-CTR-10 | PAGE-02 | CE ES PR RJ | Seção terceiro garantidor | matriz | UF TG | Selecionar destino | seção visível | P1 | interface | Confirmado código | Depende | CONFIRMADO_CODIGO |
| SCN-CTR-AC-NOVO | PAGE-02 | AC | AC veículo novo | mock AC | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-AC-USADO | PAGE-02 | AC | AC veículo usado | mock AC | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-AP-NOVO | PAGE-02 | AP | AP veículo novo | mock AP | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-AP-USADO | PAGE-02 | AP | AP veículo usado | mock AP | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-BA-NOVO | PAGE-02 | BA | BA veículo novo | mock BA | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-BA-USADO | PAGE-02 | BA | BA veículo usado | mock BA | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-CE-NOVO | PAGE-02 | CE | CE veículo novo | mock CE | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-CE-USADO | PAGE-02 | CE | CE veículo usado | mock CE | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-DF-NOVO | PAGE-02 | DF | DF veículo novo | mock DF | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-DF-USADO | PAGE-02 | DF | DF veículo usado | mock DF | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-ES-NOVO | PAGE-02 | ES | ES veículo novo | mock ES | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-ES-USADO | PAGE-02 | ES | ES veículo usado | mock ES | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-MG-NOVO | PAGE-02 | MG | MG veículo novo | mock MG | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-MG-USADO | PAGE-02 | MG | MG veículo usado | mock MG | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-MS-NOVO | PAGE-02 | MS | MS veículo novo | mock MS | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-MS-USADO | PAGE-02 | MS | MS veículo usado | mock MS | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-MT-NOVO | PAGE-02 | MT | MT veículo novo | mock MT | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-MT-USADO | PAGE-02 | MT | MT veículo usado | mock MT | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-PB-NOVO | PAGE-02 | PB | PB veículo novo | mock PB | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-PB-USADO | PAGE-02 | PB | PB veículo usado | mock PB | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-PE-NOVO | PAGE-02 | PE | PE veículo novo | mock PE | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-PE-USADO | PAGE-02 | PE | PE veículo usado | mock PE | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-PR-NOVO | PAGE-02 | PR | PR veículo novo | mock PR | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-PR-USADO | PAGE-02 | PR | PR veículo usado | mock PR | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-RJ-NOVO | PAGE-02 | RJ | RJ veículo novo | mock RJ | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-RJ-USADO | PAGE-02 | RJ | RJ veículo usado | mock RJ | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-RN-NOVO | PAGE-02 | RN | RN veículo novo | mock RN | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-RN-USADO | PAGE-02 | RN | RN veículo usado | mock RN | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-RO-NOVO | PAGE-02 | RO | RO veículo novo | mock RO | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-RO-USADO | PAGE-02 | RO | RO veículo usado | mock RO | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-RR-NOVO | PAGE-02 | RR | RR veículo novo | mock RR | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-RR-USADO | PAGE-02 | RR | RR veículo usado | mock RR | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-RS-NOVO | PAGE-02 | RS | RS veículo novo | mock RS | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-RS-USADO | PAGE-02 | RS | RS veículo usado | mock RS | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-SC-NOVO | PAGE-02 | SC | SC veículo novo | mock SC | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-SC-USADO | PAGE-02 | SC | SC veículo usado | mock SC | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-SP-NOVO | PAGE-02 | SP | SP veículo novo | mock SP | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-SP-USADO | PAGE-02 | SP | SP veículo usado | mock SP | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-TO-NOVO | PAGE-02 | TO | TO veículo novo | mock TO | indica novo | Preencher | aceita sem placa se matriz ocultar placa | P1 | positivo | Hipótese se condicional | Sim | matriz |
| SCN-CTR-TO-USADO | PAGE-02 | TO | TO veículo usado | mock TO | placa/renavam | Preencher visíveis | valida formato se obrigatório | P1 | positivo | Hipótese | Sim | matriz |
| SCN-CTR-PR-UF | PAGE-02 | PR | Trava UF Paraná | alerta PR | CEP PR | Ver UF | alerta visível; UF travada | P0 | interface | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-CTR-PB-UF | PAGE-02 | PB | Trava UF Paraíba | alerta PB | CEP PB | Ver UF | alerta visível; UF travada | P0 | interface | Confirmado | Sim | CONFIRMADO_TESTE |
| SCN-CTR-SE-ID | PAGE-02 | SE | Destino SE no HMG | API real | SE | Abrir combo | existe ou não | P1 | integração | Bloqueado | Depende | BLK-05 |
| SCN-ADT-01 | PAGE-03 | — | Busca por protocolo existente | contrato elegível | prot. sintético | focusout protocolo | form aditivo visível | P0 | positivo | Hipótese | Depende | v2 |
| SCN-ADT-02 | PAGE-03 | — | Busca protocolo inexistente | — | prot. fake | consultar | mensagem sem persistir | P0 | negativo | Hipótese | Sim | v2 |
| SCN-ADT-03 | PAGE-03 | — | Alternar CHASSI/PROTOCOLO | tela | — | radio | campo correspondente | P1 | interface | Confirmado código | Sim | v2 |
| SCN-ADT-04 | PAGE-03 | RS PR SC AC AP RR | Tipo de aditivo visível | matriz | UF | abrir form | campo tipo visível | P1 | interface | Confirmado código | Sim | matriz |
| SCN-ADT-05 | PAGE-03 | SP MG RJ… | Tipo de aditivo oculto | matriz | UF | abrir form | campo ausente | P2 | interface | Confirmado código | Sim | matriz |
| SCN-ADTRS-01 | PAGE-04 | RS | Destino desabilitado | rota RS | — | abrir | destino disabled | P0 | interface | Confirmado código | Sim | v2 |
| SCN-ADTRS-02 | PAGE-04 | RS | Não registrar aditivo real | HMG | — | não clicar Registrar | auditoria sem POST | P0 | segurança | Confirmado | Não | limite operacional |
| SCN-LOT-01 | PAGE-05 | — | Recusa nome com espaço/hífen | tela lote | arquivo inválido | drop | orientação visível; não POST | P0 | negativo | Confirmado código | Sim | upload-filename.ts |
| SCN-LOT-02 | PAGE-05 | — | Aceita txt alfanumérico | tela | contratofinanciamento2026.txt | drop sem upload | item na lista percent 100 | P1 | positivo | Hipótese | Sim | v2 |
| SCN-LOT-03 | PAGE-05 | — | Arquivo vazio | tela | 0 bytes | drop/upload | erro — NÃO CONFIRMADO | P1 | negativo | Hipótese | Sim |  |
| SCN-LOT-04 | PAGE-05 | — | Extensão zip no lote contrato | tela | .zip | drop | accept deve recusar | P1 | negativo | Hipótese | Sim | nzAccept |
| SCN-ADTLOT-01 | PAGE-06 | — | Mesmas regras de nome | tela aditivo lote | nome inválido | drop | orientação | P1 | negativo | Hipótese | Sim | v2 |
| SCN-IMGL-01 | PAGE-07 | — | Só ZIP e limite 1 | tela | 2 zips / pdf | drop | limit 1; accept zip | P1 | negativo | Confirmado código | Sim | v2 |
| SCN-IMGT-01 | PAGE-08 | — | Busca por protocolo | contrato | prot. | Pesquisar | visualizar + upload | P0 | positivo | Hipótese | Depende | v2 |
| SCN-IMGT-02 | PAGE-08 | — | Switch contrato+chassi | tela | — | Mudar filtro | dois campos | P1 | interface | Confirmado código | Sim | v2 |
| SCN-IMGT-03 | PAGE-08 | MT | PDF > 3,5 MB | contrato MT | pdf 4MB | anexar | mensagem limite MT | P0 | negativo | Confirmado código | Sim | upload-limits.ts |
| SCN-IMGT-04 | PAGE-08 | SC | PDF > 5 MB | contrato SC | pdf 6MB | anexar | mensagem limite SC | P1 | negativo | Confirmado código | Sim | upload-limits.ts |
| SCN-IMGT-05 | PAGE-08 | — | Remover imagem e reanexar | arquivo local | pdf | remover da lista | não persistir; exigir novo arquivo se regra existir | P1 | interface | NÃO CONFIRMADO | Depende | proibido excluir persistido |
