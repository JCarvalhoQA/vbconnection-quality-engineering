# Locators — login e home

| ID | Página | Etapa | UF | Nome | Tipo | Locator | Alternativo | Obrigatório | Visibilidade | Confiança |
|---|---|---|---|---|---|---|---|---|---|---|
| LOC-LGN-01 | PAGE-01 | Login | — | Usuário | textbox | page.locator("#login-username") | getByRole("textbox", { name: "Usuário *" }) | Sim | Sempre | CONFIRMADO_DOM |
| LOC-LGN-02 | PAGE-01 | Login | — | Senha | password | page.locator("#login-password") | getByRole("textbox", { name: "Digite sua senha *" }) | Sim | Sempre | CONFIRMADO_DOM |
| LOC-LGN-03 | PAGE-01 | Login | — | Entrar | button | getByRole("button", { name: "Entrar" }) | type=submit | — | Habilitado se form tocado; validação no submit vazio | CONFIRMADO_DOM |
| LOC-LGN-04 | PAGE-01 | Login | — | Esqueceu a senha? | button | getByRole("button", { name: "Esqueceu a senha?" }) |  | Não | Sempre | CONFIRMADO_DOM |
| LOC-LGN-05 | PAGE-01 | Login | — | Certificado digital | button | getByRole("button", { name: "Acessar com certificado digital" }) |  | Não | Sempre | CONFIRMADO_DOM |
| LOC-LGN-06 | PAGE-01 | Login | — | Heading | heading | getByRole("heading", { name: "Olá! Muito bom ter você aqui novamente." }) |  | — | Sempre | CONFIRMADO_DOM |
| LOC-LGN-07 | PAGE-01 | Login | — | Pular para o conteúdo | link | getByRole("link", { name: "Pular para o conteúdo" }) |  | Não | Sempre | CONFIRMADO_DOM |
| LOC-LGN-08 | PAGE-01 | Login | — | Toggle senha | button | sem nome acessível — recomendar testid | posição no form | Não | Sempre | CONFIRMADO_DOM (fraco) |
| LOC-LGN-09 | PAGE-01 | Senha expirada | — | Senha atual | password | page.locator("#expirada-password") | placeholder genérico | Sim | Condicional | CONFIRMADO_UI |
| LOC-LGN-10 | PAGE-01 | Senha expirada | — | Nova senha | password | page.locator("#expirada-new-password") |  | Sim | Condicional | CONFIRMADO_UI |
| LOC-LGN-11 | PAGE-01 | Senha expirada | — | Confirmação | password | page.locator("#expirada-confirm-password") |  | Sim | Condicional | CONFIRMADO_UI |
| LOC-LGN-12 | PAGE-01 | Senha expirada | — | Alterar Senha | button | getByRole("button", { name: "Alterar Senha" }) | disabled até política ok | — | Condicional | CONFIRMADO_UI |
| LOC-LGN-13 | PAGE-01 | 2FA | — | Código | textbox | page.locator("#codigo-segunda-etapa") |  | Sim | Condicional | CONFIRMADO_TESTE |
| LOC-LGN-14 | PAGE-01 | Recuperação | — | Usuário | textbox | page.locator("#recuperacao-usuario") |  | Sim | Condicional | CONFIRMADO_TESTE |
| LOC-HOME-01 | PAGE-01 | Home | — | Bem-vindo | heading | getByRole("heading", { name: /Bem-vindo,/ }) |  | — | Autenticado | CONFIRMADO_TESTE |
| LOC-HOME-02 | PAGE-01 | Home | — | Atalho Registro de Contrato | button | button.filter(has strong /^Registro de Contrato$/) |  | — | Autenticado | CONFIRMADO_TESTE |
| LOC-HOME-03 | PAGE-01 | Home | — | Menu Sair | menuitem | getByText("Sair", { exact: true }) | modal Sim/Não | — | Autenticado | CONFIRMADO_TESTE |

`formcontrolname`: `username`, `password` no login. **CONFIRMADO_DOM**.
