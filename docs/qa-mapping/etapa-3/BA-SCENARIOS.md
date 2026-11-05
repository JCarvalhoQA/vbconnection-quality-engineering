# Bahia — matriz de cenários PAGE-02 (documentação)

**Status:** RASCUNHO DE MAPEAMENTO — **não executado** como regressão  
**Data:** 2026-11-05  
**Restrição:** nenhum cenário abaixo autoriza POST/PUT/PATCH/DELETE, Salvar veículo, Registrar contrato, upload ou envio DETRAN/B3.

Legenda de evidência:

- LIVE = observado no Gate 1 (somente leitura)
- JAVA = `fixtures/matriz/BA.json`
- MOCK = `mockContratoCadastroApis` + fixture BA
- PENDENTE = ainda precisa de inspeção reversível ou decisão de produto

## Seleção de destino

| ID | Tipo | Cenário | Evidência | Automatizar agora? |
|---|---|---|---|---|
| BA-DST-01 | + | Master abre PAGE-02 e vê combo Destino obrigatório | LIVE | sim (já no inspect) |
| BA-DST-02 | + | Selecionar DETRAN-BA carrega Agente, Veículos, Contrato, Devedor, Credor, Complementares, Documentos | LIVE | sim |
| BA-DST-03 | + | Após selecionar, Destino fica disabled; **Alterar destino** permanece | LIVE | sim (sem persistir) |
| BA-DST-04 | − | Não selecionar destino: seções de formulário não completas / Registrar ausente ou inativo (Gate 0: botão só após BA) | LIVE Gate 0 | sim |
| BA-DST-05 | − | Tratar presença de MA/SE/CE/RO no combo como suporte de formulário | LIVE combo ≠ form | **não** — ver [LIVE-UF-STATUS.md](./LIVE-UF-STATUS.md) |

## Seleção de agente financeiro

| ID | Tipo | Cenário | Evidência | Automatizar agora? |
|---|---|---|---|---|
| BA-AGF-01 | + | Combo lista agentes do ambiente; CNPJ e Nome preenchidos e disabled | LIVE (11 opções, CNPJ redigido) | leitura sim; não gravar escolha se isso POST |
| BA-AGF-02 | − | Agente vazio mantém `*` visual | LIVE visual; funcional PENDENTE | só blur |
| BA-AGF-03 | − | Editar CNPJ/Nome manualmente | LIVE disabled | esperar bloqueio |

## Inclusão de veículo

| ID | Tipo | Cenário | Evidência | Automatizar agora? |
|---|---|---|---|---|
| BA-VEI-01 | + | Adicionar veículo abre **linha inline**, não dialog | LIVE | sim (inspect) |
| BA-VEI-02 | + | Com linha aberta, Adicionar veículo disabled | LIVE | sim |
| BA-VEI-03 | + | `INDICA_NOVO_USADO` visível e obrigatório (Novo / Usado) | LIVE + JAVA | sim |
| BA-VEI-04 | + | Zero km default Sim; Chassi*, Gravame*, Motor opcional | LIVE | sim |
| BA-VEI-05 | + | Zero km = Não revela UF da placa, Placa, RENAVAM | LIVE | sim (sem Salvar) |
| BA-VEI-06 | + | Novo vs Usado não muda o conjunto de campos | LIVE | sim |
| BA-VEI-07 | − | Chassi vazio / Gravame vazio: `*` visual; Salvar não clicado | LIVE visual | blur apenas |
| BA-VEI-08 | − | Chassi com I, O ou Q | ANGULAR (`pattern`); não disparado live | PENDENTE live-readonly |
| BA-VEI-09 | − | Gravame com mais de 8 caracteres | maxlength 8 LIVE | sim |
| BA-VEI-10 | − | Chassi > 21 | maxlength 21 LIVE | sim |
| BA-VEI-11 | − | Clicar Salvar | **fora de escopo** live-readonly | só mock |
| BA-VEI-12 | + | Excluir linha não salva restaura “Nenhum veículo” | LIVE | sim |
| BA-VEI-13 | − | Esperar botão Cancelar | LIVE ausente | atualizar cenários/POM depois de aprovação |
| BA-VEI-14 | − | Ano fabricação visível na BA | JAVA oculto; LIVE ausente | não preencher |

Não criar 40 cenários “usado” para outras UFs: `INDICA_NOVO_USADO` obrigatório **só BA** na Java.

## Tipo de restrição

| ID | Tipo | Cenário | Evidência |
|---|---|---|---|
| BA-RST-01 | + | Opções: Arrendamento mercantil, Reserva domínio, Alienação fiduciária, Penhor | LIVE |
| BA-RST-02 | − | Vazio com `*` | LIVE visual |
| BA-RST-03 | − | Valor fora da lista | overlay só as 4 — PENDENTE se o combo aceita typeahead livre |

## Dados contratuais

| ID | Tipo | Cenário | Evidência |
|---|---|---|---|
| BA-CTR-01 | + | Datas com placeholder `dd/mm/aaaa` (contrato, liberação, 1ª e última parcela) | LIVE |
| BA-CTR-02 | + | Valor total obrigatório; parcela/IOF/comissão/penalidade/taxas opcionais | LIVE visual = JAVA |
| BA-CTR-03 | + | UF e cidade de liberação obrigatórias | LIVE |
| BA-CTR-04 | − | Número do Contrato vazio + Tab | LIVE blur executado; copy da mensagem PENDENTE |
| BA-CTR-05 | − | Tipo de Contrato obrigatório na BA | JAVA oculto; LIVE ausente — **não** assertar |
| BA-CTR-06 | + | E-mail do contrato opcional | LIVE extra vs Java |
| BA-CTR-07 | − | Registrar contrato | **proibido** nesta gate |

## Dados do devedor

| ID | Tipo | Cenário | Evidência |
|---|---|---|---|
| BA-DEV-01 | + | CPF/CNPJ, nome (max 40), telefone máscara, endereço com `*` | LIVE |
| BA-DEV-02 | + | Cidade disabled até UF | LIVE |
| BA-DEV-03 | − | Nome > 40 | maxlength LIVE |
| BA-DEV-04 | − | Telefone localizado por `formcontrolname=numero` | COLISAO — cenário de automação frágil |
| BA-DEV-05 | − | Consulta CEP que persiste | **não executar** (GET externo; risco de efeito) |

## Endereço (devedor vs credor)

| ID | Tipo | Cenário | Evidência |
|---|---|---|---|
| BA-END-01 | + | Devedor: CEP/logradouro/número/bairro/UF/cidade obrigatórios visuais; complemento opcional | LIVE = JAVA |
| BA-END-02 | + | Credor: mesmos campos **sem** `*` e pré-preenchidos na sessão Master | LIVE vs JAVA obrigatório = INCOMPATÍVEL visual |
| BA-END-03 | − | Limpar credor para forçar validação | PENDENTE; pode ser reversível mas toca PII de sessão — não fazer sem autorização |

## Índice / complementares

| ID | Tipo | Cenário | Evidência |
|---|---|---|---|
| BA-IDX-01 | + | Índice obrigatório | LIVE + JAVA |
| BA-IDX-02 | + | Cota e grupo maxlength 6, opcionais | LIVE |
| BA-IDX-03 | − | Fundo de reserva visível | JAVA sim; LIVE não — não assertar presença |

## Documentos

| ID | Tipo | Cenário | Evidência |
|---|---|---|---|
| BA-DOC-01 | + | Seção Documentos visível na PAGE-02 | LIVE heading |
| BA-DOC-02 | − | Upload de arquivo | **proibido** |
| BA-DOC-03 | − | Controles internos da dropzone | PENDENTE (não capturados no inventory) |

## Campos condicionais

| ID | Tipo | Gatilho | Efeito | Evidência |
|---|---|---|---|---|
| BA-CND-01 | + | Destino BA | form completo | LIVE |
| BA-CND-02 | + | Zero km Não | UF placa + Placa + RENAVAM | LIVE |
| BA-CND-03 | + | Zero km Sim | esconde os três | LIVE default + código Angular |
| BA-CND-04 | + | Novo/Usado | nenhum campo extra | LIVE |
| BA-CND-05 | + | UF devedor | habilita cidade | LIVE (cidade começa disabled) |
| BA-CND-06 | − | TG visível na BA | JAVA `DADOS_TERCEIRO_GARANTIDOR: false`; LIVE sem heading | não criar cenário TG-BA |
| BA-CND-07 | − | Aditivo na PAGE-02 | JAVA seção true; LIVE página distinta | não assertar na PAGE-02 |

## Navegação e cancelamento

| ID | Tipo | Cenário | Evidência |
|---|---|---|---|
| BA-NAV-01 | + | PAGE-02 acessível ao Master | LIVE |
| BA-NAV-02 | + | Alterar destino (sem completar outro DETRAN nesta gate) | botão LIVE; troca de UF **não** exercitada além de BA |
| BA-NAV-03 | + | Descarte de veículo = Excluir, não Cancelar | LIVE |
| BA-NAV-04 | − | Logout pelo locator `/administrador/i` | header Master — frágil |
| BA-NAV-05 | − | PAGE-03..08 | **fora de escopo** |

## O que não entra nesta matriz

- Registro feliz de contrato BA (exige persistência).
- Duplicidade de chassi no DETRAN.
- 19× cenários Novo/Usado genéricos.
- CE/RO/MA/SE como cópia da BA.
- Qualquer cenário cujo oráculo seja o mock homogêneo antigo.
