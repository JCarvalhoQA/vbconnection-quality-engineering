# Matriz funcional PAGE-02 — 22 UFs live

**Fonte:** LIVE_DOM + LIVE_UI · 2026-11-05  
**Campos/\\*:** casca (linha de veículo **não** entra na contagem da casca).  
**Combo ≠ form.**

| UF | id | Combo | Form | Campos | `*` | Exclusivos / destaques | Novo/usado | Zero km | Placa+RENAVAM | TG | Credor | Docs | Java | Mock/suíte | Bloqueio |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AC | 17 | sim | sim | 49 | 25 | veículo “catálogo” (marca bem, combustível, cor, UF lic.) | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| AP | 225 | sim | sim | 49 | 25 | mesmo cluster AC/MG/RR | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| BA | 14 | sim | sim | 47 | 23 | **Novo/usado\\***; motor; sem ano | **obrigatório** | Sim | condicional | não | sim | sim | sim | suíte 19 | Gate 1 |
| CE | 236 | sim | sim | 68 | 25 | pagamento local, celular\\*, TG | ausente | Sim | condicional | **sim** | sim | sim | sim | **fora da suíte** | Gate 2 |
| DF | 232 | sim | sim | 50 | 20 | veículo enxuto + marca/modelo | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| ES | 230 | sim | sim | 58 | 21 | TG; gravame sem `*` | ausente | Sim | condicional | **sim** | sim | sim | sim · TG true | suíte 19 | funcional BLOQUEADO |
| MA | 238 | sim | **sim** | 68 | 25 | **labels = CE**; sem Java | ausente | Sim | condicional | **sim** | sim | sim | **não** | **não** | decisão produto |
| MG | 9 | sim | sim | 49 | 25 | cluster AC | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| MS | 226 | sim | sim | 48 | 27 | `*` alto; HMG Cypress “não contratado” | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 (mock ignora flag) | risco falso verde |
| MT | 233 | sim | sim | 45 | 17 | casca mais curta | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| PB | 13 | sim | sim | 47 | 25 | trava UF (não exercitada) | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | alerta residência PENDENTE |
| PE | 3 | sim | sim | 47 | 24 | cluster PB/SC (sem marca/modelo único) | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| PR | 10 | sim | sim | 64 | 22 | TG; WebPKI **não** exigido na PAGE-02 | ausente | Sim | condicional | **sim** | sim | sim | sim · TG true | suíte 19 | certificado PAGE-03+ BLOQUEADO |
| RJ | 16 | sim | sim | 70 | 25 | maior casca; Cor\\*; TG; WebPKI | ausente | Sim | condicional | **sim** | sim | sim | sim · TG true | suíte 19 | certificado BLOQUEADO |
| RN | 228 | sim | sim | 47 | **30** | maior `*` | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| RO | 234 | sim | sim | 52 | **11** | menor `*`; sem TG | ausente | Sim | condicional | não | sim | sim | sim | **fora da suíte** | Gate 2 |
| RR | 11 | sim | sim | 49 | 25 | cluster AC | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| RS | 231 | sim | sim | 54 | 24 | veículo médio | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| SC | 4 | sim | sim | 47 | 20 | cluster PE | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| SE | 229 | sim | **não** | 1 | 1 | só Destino + heading Documentos | n/a | n/a | n/a | não | não | heading só | **não** | skip mock | **SEM_FORMULARIO** |
| SP | 1 | sim | sim | 50 | 26 | sem UF licenciamento no veículo | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | funcional BLOQUEADO |
| TO | 122 | sim | sim | 48 | 16 | veículo enxuto; WebPKI | ausente | Sim | condicional | não | sim | sim | sim | suíte 19 | certificado BLOQUEADO |

Locators validados em todas as 21 com form: heading Registrar contrato, combobox Destino, heading Agente/Veículos, botão Adicionar veículo, Chassi, Excluir veículo, combobox zero km. Ver [LOCATOR-CATALOG.md](./LOCATOR-CATALOG.md).

Detalhe por UF: [ufs/](./ufs/).
