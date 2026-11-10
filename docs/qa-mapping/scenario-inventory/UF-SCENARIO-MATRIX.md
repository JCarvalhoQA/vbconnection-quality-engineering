# Matriz de cenários por UF

Só associa regra à UF com evidência (inventário live, matriz Java, `DetranUf`, spec).
Estrutural = inspeção visual. Funcional = registro mockado. Integração DETRAN/B3 = nenhuma UF com spec aprovada.

Recorte estrutural: **21** UFs com spec e teste mocked; **21** specs live no código; evidência live histórica de **19** UFs; MA e TO sem aprovação live (`MA_TO_LIVE_PENDING`); SE sem formulário. Registro funcional mocked: **18** UFs (`DetranUf`, sem CE/RO/MA). Live no SHA `60afe11`: **0**. Não declarar 21/21 live.

Legenda: `A` automatizado mocked · `H` live histórico · `P` live pendente · `S` skip · `—` sem evidência de aplicar · `N` não aplicável · `M` apenas mapeado

| UF | Form | Java | TG | Novo/usado | tipoEspecie | Casca estr. | Veículo/0km | Registro obrig. | Registro feliz | Trava UF | Limite PDF | Live SHA atual |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AC | sim | sim | não | não | não | A+H | A+H | A | A | — | M | não |
| AP | sim | sim | não | não | não | A+H | A+H | A | A | — | M | não |
| BA | sim | sim | não | **sim** | não | A+H | A+H | A | A | — | M | não |
| CE | sim | sim | **sim** | não | **sim** | A+H | A+H | — (fora registro) | — | — | M | não |
| DF | sim | sim | não | não | não | A+H | A+H | A | A | — | M | não |
| ES | sim | sim | **sim** | não | não | A+H | A+H | A | A | — | M | não |
| MA | sim | **não** | **sim** | não | **sim** | A+P | A+P | — (fora registro) | — | — | M | não |
| MG | sim | sim | não | não | não | A+H | A+H | A | A | — | M | não |
| MS | sim | sim | não | não | não | A+H | A+H | A | A | — | **5 MB mapeado** | não |
| MT | sim | sim | não | não | não | A+H | A+H | A | A | — | **3,5 MB mapeado** | não |
| PB | sim | sim | não | não | não | A+H | A+H | A | A | **A** (alerta) | M | não |
| PE | sim | sim | não | não | não | A+H | A+H | A | A | — | M | não |
| PR | sim | sim | **sim** | não | **sim** | A+H | A+H | A | A | **A** (alerta) | M | não |
| RJ | sim | sim | **sim** | não | **sim** | A+H | A+H | A | A | — | M | não |
| RN | sim | sim | não | não | não | A+H | A+H | A | A | — | M | não |
| RO | sim | sim | não | não | não | A+H | A+H | — (fora registro) | — | — | M | não |
| RR | sim | sim | não | não | não | A+H | A+H | A | A | — | M | não |
| RS | sim | sim | não | não | não | A+H | A+H | A | A | — | M | não |
| SC | sim | sim | não | não | não | A+H | A+H | A | A | — | **5 MB mapeado** | não |
| SP | sim | sim | não | não | não | A+H | A+H | A | A | — | M | não |
| TO | sim | sim | não | não | não | A+P | A+P | A | A | — | M | não |
| SE | **não** | não | — | — | — | N | N | S | S | — | — | N |

## Contagem de instâncias (não são 21 regras distintas)

| Família lógica | UFs com evidência | Automatizado mocked | Live comprovado |
|---|---:|---:|---:|
| Casca estrutural CT-029 | 21 | 21 | 19 |
| Veículo / Zero km / placa CT-030 | 21 | 21 | 19 |
| Novo/usado visível CT-031 | 1 (BA) | 1 | 1 hist |
| TG visível CT-033 | 5 | 5 | 4 hist (MA pendente) |
| Registro obrigatórios CT-046 | 18 | 18 | 0 |
| Registro feliz CT-047 | 18 | 18 | 0 |
| Trava UF CT-048/049 | 2 (PR, PB) | 2 (parcial) | 0 |
| Limite PDF imagem CT-080–082 | 3 (MT, SC, MS) | 0 | 0 |
| Aditivo tipo visível CT-066 | 6 | 0 | 0 |
| WebPKI CT-056 | 3 (PR, RJ, TO) | 0 | 0 |

Os 40 `SCN-CTR-{UF}-NOVO/USADO` da matriz antiga **não** foram replicados: só BA tem a regra na Java/UI.
