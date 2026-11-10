# Matriz de testabilidade dos 15

Um cenário pode ter **várias** causas. Status primário em negrito.

| ID | Página | UF | Regra | UI | API | POM | Mock | Segurança | Status | Próxima ação |
|---|---|---|---|---|---|---|---|---|---|---|
| CT-050 | PAGE-02 | — | Intenção não confirmada; maxlength 21 BA | Live BA parcial | UNKNOWN | `VeiculoSection` existe | Sim (sem copy) | Sem persistir Salvar veículo no live | **RULE_NOT_CONFIRMED**; PARTIALLY_CONFIRMED campo | Perguntar min/max/copy; não spec 17 chars |
| CT-051 | PAGE-02 | — | Não | Campo sim | GET cnpj mock `null` | `#devedorCnpj` | Sim | — | **RULE_NOT_CONFIRMED**; **API_CONTRACT_REQUIRED** | Copy + regra DV |
| CT-054 | PAGE-02 | — | Não | Não | UNKNOWN | PAGE-02 sim | Delay possível | — | **RULE_NOT_CONFIRMED**; **API_CONTRACT_REQUIRED** | Confirmar VA-1585 e copy |
| CT-055 | PAGE-02 | — | v2 inferido | Não | N/A rota | PAGE-02 sim | Roles mock | Guard produto | **RULE_NOT_CONFIRMED** | Oráculo NX sem a role |
| CT-060 | PAGE-02 | — | Hipótese | Não | UNKNOWN | parcial | 409 inventado = proibido | DETRAN / política | **RULE_NOT_CONFIRMED**; **API_CONTRACT_REQUIRED**; **BLOCKED_SECURITY** (órgão) | Contrato de erro sem órgão real |
| CT-061 | PAGE-02 | — | Não | Campos financeiros matriz | UNKNOWN | parcial | Sim | — | **RULE_NOT_CONFIRMED** | Lista de inconsistências por UF |
| CT-064 | PAGE-03 | — | v2 documentada | NX não | UNKNOWN | **pendente** | Leitura mockável | persistGuard no submit | **UI_MAPPING_REQUIRED**; **POM_REQUIRED**; **API_CONTRACT_REQUIRED** | Snapshot NX readonly após credencial |
| CT-070 | PAGE-05 | — | v2 documentada | NX não | N/A se recusa local | **pendente** | Arquivo sintético | Abort POST | **UI_MAPPING_REQUIRED**; **POM_REQUIRED** | Confirmar orientação na NX |
| CT-072 | PAGE-05 | — | Não | NX não | — | **pendente** | 0 bytes local | Abort POST | **RULE_NOT_CONFIRMED**; **UI_MAPPING_REQUIRED**; **POM_REQUIRED** | Regra de 0 bytes |
| CT-073 | PAGE-05 | — | Não | NX não | — | **pendente** | .zip local | Abort POST | **RULE_NOT_CONFIRMED**; **UI_MAPPING_REQUIRED**; **POM_REQUIRED** | Accept NX |
| CT-075 | PAGE-06 | — | Inferida | NX não | — | **pendente** | sintético | Abort POST | **RULE_NOT_CONFIRMED**; **UI_MAPPING_REQUIRED**; **POM_REQUIRED** | Paridade com PAGE-05 |
| CT-077 | PAGE-07 | — | v2 documentada | NX não | — | **pendente** | ZIP fake | Role `IMAGEM_UPLOAD` ausente no mock | **UI_MAPPING_REQUIRED**; **POM_REQUIRED** | Role + DOM |
| CT-080 | PAGE-08 | MT | v2 documentada; Java diverge | NX não | — | **pendente** | PDF local | Sem upload real | **UI_MAPPING_REQUIRED**; **POM_REQUIRED** | Qual limite a NX usa |
| CT-081 | PAGE-08 | SC | v2 | NX não | — | **pendente** | PDF local | Sem upload real | **UI_MAPPING_REQUIRED**; **POM_REQUIRED** | Copy NX |
| CT-082 | PAGE-08 | MS | v2 | NX não | — | **pendente** | PDF local | Sem upload real | **UI_MAPPING_REQUIRED**; **POM_REQUIRED** | Copy NX |

**READY_FOR_AUTOMATION:** nenhum dos 15.
**OUT_OF_SCOPE:** nenhum (VA-1585 pode virar se o PO descontinuar).
