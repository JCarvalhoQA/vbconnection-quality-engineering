# Cenários funcionais — envio de imagens

## Bloqueio

VA-1719/VA-1718 marcam as telas como concluídas no Jira, **sem** detalhar campos, tipos ou limites.

Sonda mocked: `/vbconnection/registrar/imagem/tela` e `/lote` renderizam a **Home**. `input[type=file]=0`. Atalho “Imagem de Contrato” não abre upload. Sem locators NX, **nenhum POM** foi criado.

O Gherkin Confluence usa protocolo `20240531988461409` — identificador de cliente, **não** usado.

## O que foi implementado

| Item | Papel |
|---|---|
| `fixtures/imagens/arquivosSinteticos.ts` | PDF, ZIP, vazio, .exe, oversized em memória |
| `e2e/imagens/imagem-excecoes.spec.ts` | Navegação das rotas pedidas **não** dispara POST de upload |
| persistGuard | POST `imagens/upload` continua abortado (unitário pré-existente) |

CT-077–CT-083 permanecem **Apenas mapeado**. O spec de navegação **não** conta como automação desses IDs (não exercem busca, anexo nem API de imagem).
