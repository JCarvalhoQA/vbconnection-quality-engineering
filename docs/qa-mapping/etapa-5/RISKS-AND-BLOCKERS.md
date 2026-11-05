# Gate 3 — riscos e bloqueios

## Encerrado

| ID | Item | Estado |
|---|---|---|
| G3-19 | 19 UFs restantes inspecionadas | 18 form OK + SE SEM_FORMULARIO |
| G3-SE | SE form | **confirmado ausente** LIVE_UI |
| G3-MA | MA form | **confirmado presente** (clone CE) |
| G3-TG | TG além de CE | ES, PR, RJ (+ MA) |
| G3-ZK | zero km nas 21 | LIVE_UI |

## Bloqueios permanentes desta autorização

| ID | Item | Classe |
|---|---|---|
| BLK-REG | Registrar / Salvar veículo / upload | BLOQUEADO |
| BLK-FUNC | `*` funcional vs visual | BLOQUEADO |
| BLK-CEP | ViaCEP no focusout | não exercitado |
| BLK-PKI | certificado PR/RJ/TO | PAGE-02 não exigiu; restante BLOQUEADO |
| BLK-TG-EMPTY | TG vazio no backend | BLOQUEADO |
| BLK-POM | Page Objects desatualizados | não alterar agora |

## Riscos de produto

| ID | Risco | UFs |
|---|---|---|
| P-MA | Destino operacional sem matriz Java | MA |
| P-SE | Combo oferece UF sem form | SE |
| P-MS | Form live vs “serviço não contratado” | MS |
| P-ZK | Matriz mente sobre placa sempre visível | 21 |
| P-CREDOR | Java obriga, UX Master não marca `*` | várias |
| P-CLONE | Massa CE aplicada em MA persiste em destino sem enum | MA |

## Riscos de automação se avançar sem arquitetura nova

1. 19 specs mockadas continuam verdes e **não** cobrem Nova UX.
2. Incluir CE/RO/MA em `DetranUf` sem locators de zero km/TG gera flaky ou POST acidental.
3. `getByRole('dialog')` e Cancelar falham nas 21.
4. RN (30 `*`) quebra massa mínima copiada de RO (11 `*`).
5. persistGuard precisa permanecer em qualquer spec apontada ao newfront.

## Não é bloqueio de inspeção

PAGE-02 de PR/RJ/TO/MS/PB carregou sem certificado e sem preencher endereço. O cadastro **visual** está mapeado; o envio DETRAN não.
