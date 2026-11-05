# Riscos e bloqueios

| ID | Tipo | Descrição | Impacto | Mitigação |
|---|---|---|---|---|
| BLK-01 | Auth | Não há credencial **Master** nas configs do projeto | PAGE-02..08 live e menus Master | Provisionar Master de homologação em `.env` local |
| BLK-02 | Auth | Persona ADMINISTRADOR da massa e2e cai em **Alterar senha** no newfront | Impede storageState real | Rotacionar senha fora desta auditoria; não usar a senha nova em git |
| BLK-03 | Fonte | `auto.ui/migracao/vbconnection` vazio / não rastreado | Locators Nova UX só via POM e bundle publicado | Versionar a UX ou gerar mapa no CI de publish |
| BLK-04 | Mock | Mesma matriz de campos para todas as UFs | Falso verde em CE/RO/TG/ano fab | Derivar mock da matriz Java |
| BLK-05 | SE | Fora do enum `DETRAN`; `fromUf` no `FormRestController` não resolve | GET `/api/form/detran/{id}` pode falhar | Confirmar se SE existe como fornecedor no HMG |
| BLK-06 | Persistência | newfront fala com API HMG (`hmg.vbconnection.info/vbauto.api`) | Registro real se o mock não interceptar | Manter intercept; nunca smoke real sem autorização |
| BLK-07 | Apache 404 | Deep link quebra teste e usuário que cola URL | Falso negativo de “página não existe” | Sempre `gotoApp` |
| BLK-08 | Blip | Overlay intercepta clique | Flaky submit | abort + hide já existentes |
| BLK-09 | Web PKI | PR, RJ, TO | Automação de certificado **não** no escopo | Tag `@webpki` skip/manual |
| BLK-10 | Lote | Upload real processa contratos | Proibido nesta etapa | Só validar `beforeUpload` / nome de arquivo |
| RSK-01 | Divergência v2 vs Nova UX | Aditivo/lote/imagens mapeados no legado | Locator pode não existir na UX nova | Reinspecionar DOM após auth |
| RSK-02 | Envio B3 | Pedido cita etapa; não há `DadosForm` B3 | Cenário hipotético | Confirmar com produto |
| RSK-03 | Senha em `login.mass.json` | Arquivo versionado | Exposição | `.env` overlay; massa mock para fluxos mockados |
| BLK-11 | 40 cenários novo/usado vs matriz | `INDICA_NOVO_USADO` só BA | Falsa cobertura UF | [etapa-2/SCENARIO-REVIEW.md](./etapa-2/SCENARIO-REVIEW.md) |
| BLK-12 | `TIPO_CONTRATO` obrigatório no mock/POM e oculto na Java (SP…) | SoT indefinido | Teste verde mentiroso | Gate 0b BA/SP |
| RSK-04 | `DetranUfNumeroEnum.RN` aponta para ID de RR no v2 | IDs errados se reutilizado | Não usar essa enum na suíte | `detransIds.ts` HMG 228 |

Nenhuma operação irreversível foi feita. A tentativa de login com a massa e2e **não** alterou a senha.
