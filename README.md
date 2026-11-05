# VBConnection Quality Engineering

Quality engineering and end-to-end test automation for VBConnection using Playwright and TypeScript, featuring automated regression testing, CI/CD integration, test reporting, and continuous quality assurance.

This repository is the independent home of the VBConnection Playwright suite. It does not contain the application source and it does not participate in the VBConnection deploy.

## Project overview

The suite exercises the VBConnection frontend in a browser. Login, navigation and contract registration scenarios mock the backend responses they need, so the default run does not persist a contract and does not require a personal password in git.

Each supported DETRAN state (UF) has its own spec. Shared registration behavior lives in one flow so the assertions stay the same across states.

## Tech stack

- Node.js 20 or newer
- TypeScript 5
- Playwright Test (Chromium, Desktop Chrome profile, 1440×900)
- GitHub Actions for an independent test workflow

## Repository structure

The layout follows the suite that already existed. Specs stay under `e2e/` so the relative imports between page objects, fixtures and flows do not need to move.

```text
├── .github/workflows/playwright-tests.yml
├── actions/
├── config/
├── docs/qa-mapping/          UF inventories, Gates 0–3, Etapa 6
├── e2e/
│   ├── acessibilidade/
│   ├── cadastros/
│   ├── contratos/
│   │   ├── registro/         mocked registration by UF
│   │   └── page02/           structural PAGE-02 (BA pilot)
│   ├── gate0/ … gate3/       live-readonly inspection (gated)
│   ├── home/
│   ├── login/
│   ├── navegacao/
│   └── telas-padrao/
├── factories/
├── fixtures/
│   └── matriz/               20 Java-matrix UF fixtures (+ CE/RO off-suite)
├── pages/
│   └── fragments/            VeiculoSection
├── scripts/
├── support/                  matrizLoader, ufUiProfile, persistGuard
├── tests/
├── utils/
├── playwright.config.ts
├── playwright.unit.config.ts
├── package.json
└── .env.example
```

## Prerequisites

- Node.js 20+
- npm 10+
- For end-to-end tests, either a local VBConnection on port 8080 or network access to an allowlisted frontend
- Chromium installed through Playwright (`npm run install:browsers`)

## Installation

```bash
npm ci
npm run install:browsers
```

`npm ci` uses the committed lockfile. Do not copy `node_modules` from another checkout.

## Environment configuration

Copy the example file and edit only the values you need:

```bash
cp .env.example .env
```

| Variable | Default | Use |
| --- | --- | --- |
| `PLAYWRIGHT_LOCAL_URL` / `PLAYWRIGHT_DOCKER_URL` | `http://localhost:8080` | Local application (`vbconnection-docker`) |
| `PLAYWRIGHT_NEWFRONT_URL` / `PLAYWRIGHT_BASE_URL` | `https://newfront.vbconnection.info` | Published frontend (`vbconnection-newfront`, default `npm test`) |
| `PLAYWRIGHT_HMG_URL` | `https://hmg.vbconnection.info` | Homologation host (`vbconnection-hmg`) |
| `PLAYWRIGHT_AUTH_URL` | `https://hmg.vbconnection.info/vbauto.api/auth` | Auth API |
| `PLAYWRIGHT_API_URL` | `https://hmg.vbconnection.info/vbauto.api/api` | Application API |
| `PLAYWRIGHT_TARGET_URL` | unset | Optional probe/CI target. Host must be allowlisted |
| `PLAYWRIGHT_USER` / `PLAYWRIGHT_PASSWORD` | unset | Optional overrides of the mock admin persona |

`.env` is gitignored. Do not commit passwords, tokens, cookies or Playwright storage state.

The mock personas in `fixtures/login.mass.json` are synthetic. Real credentials, when a scenario needs them, belong only in the local `.env` or in GitHub Actions secrets. This repository does not ship either.

The published frontend and the homologation host are different origins. `npm test` keeps the published frontend as the default so the existing suite does not change target on its own. Homologation is explicit via `npm run test:hmg`.

## Running tests

Default project (published frontend):

```bash
npm test
```

Local application:

```bash
npm run test:local
```

Homologation host:

```bash
npm run test:hmg
```

Other entry points:

```bash
npm run test:smoke
npm run test:login
npm run test:contrato
npm run test:page02:ba
npm run test:ui
npm run test:unit
npm run typecheck
npm run matriz:generate
npm run matriz:compare
```

`test:unit` is process-level (allowlist, matriz, persistGuard, UF UI profile). It does not open a browser and it does not call VBConnection.

`test:page02:ba` is the Bahia PAGE-02 structural spec in `@mocked` mode. It never clicks Registrar.

Live-readonly specs (`@live-readonly`) stay skipped unless `PLAYWRIGHT_PAGE02_STRUCTURAL_LIVE=1` (or the Gate flags) and Master credentials are set. They never run on pull requests.

## Running tests by module or state

```bash
npx playwright test --project=vbconnection-newfront e2e/login
npx playwright test --project=vbconnection-newfront e2e/contratos
npx playwright test --project=vbconnection-newfront e2e/contratos/registro/ba.spec.ts
npx playwright test --project=vbconnection-newfront --grep @sp
npx playwright test --project=vbconnection-hmg --grep @ba
```

Registration specs exist for AC, AP, BA, DF, ES, MG, MS, MT, PB, PE, PR, RJ, RN, RR, RS, SC, SE, SP and TO. Each in-suite state runs two mocked scenarios: required fields, then a successful intercepted registration (`contratos/registrar` is mocked; `persistGuard` blocks other writes). SE is skipped (`formularioIndisponivel`). CE, RO and MA stay out of the registration suite.

Grep tags use the lower-case UF (`@ba`, `@sp`). Structural PAGE-02 uses `@page02`. Live inspections use `@live-readonly`.

Replace the project name with `vbconnection-docker` or `vbconnection-hmg` to point the same spec at another environment.

## Test reports

A run writes:

- HTML: `playwright-report/index.html` (`npm run report`)
- JSON: `test-results/e2e-results.json`
- JUnit: `test-results/e2e-junit.xml`
- Markdown summary: `test-results/e2e-summary.md` after `npm run report:summary`

Traces, screenshots and videos are kept on failure. Those folders are gitignored.

## CI/CD integration

`.github/workflows/playwright-tests.yml` is the only automation workflow in this repository. It does not call Jenkins and it does not deploy VBConnection. A failed run fails this workflow only. Do not add it as a required check on the application repository.

There is no schedule. Manual dispatch and pull requests are the triggers.

### Modes

| Mode | Who can run it | What it does |
| --- | --- | --- |
| `mocked` | Pull requests (default) and manual dispatch (default) | Typecheck, deterministic matriz fixtures, mock × Java compare, unit tests, then E2E with mocked auth/API. No Master secrets. `persistGuard` in mocked mode. `@live-readonly` specs are inverted out. |
| `live-readonly` | Manual dispatch only, GitHub Environment `live-readonly` | Real Master login. Only `@live-readonly` specs. `persistGuard` aborts business POST/PUT/PATCH/DELETE. No Registrar, Salvar, upload or mocked auth. |

Suites: `smoke` (`@smoke`), `regression` (full mocked E2E or all live-readonly specs), `structural` (PAGE-02 BA). Target `newfront` is the only authorized SPA. `hmg` is rejected (institutional site).

Pull requests always force `mocked` + `regression` + `newfront`. They never receive Master credentials.

### Run manually in GitHub Actions

GitHub shows **Run workflow** for a workflow file that already exists on the default branch. After this change lands on `main`:

1. Open the repository on GitHub and select the **Actions** tab.
2. Select **Playwright tests**.
3. Select **Run workflow**.
4. Choose the branch. Use `main` for the published suite.
5. Choose `mode` (`mocked` or `live-readonly`), `suite` and `target`.
6. Start the run.

Until the updated workflow is on `main`, a manual run from `main` still uses the previous file. Use the working branch in **Run workflow** to exercise this version, or merge the pull request first.

### Secrets

`mocked` does not read `secrets.*`.

`live-readonly` reads only from the GitHub Environment `live-readonly`:

- `PLAYWRIGHT_MASTER_USER`
- `PLAYWRIGHT_MASTER_PASSWORD`

Configure the environment with required reviewers before treating manual live runs as operational. Do not attach those secrets to the pull-request job.

Login and contract calls in `mocked` mode use intercepts. These optional names override the mock personas in local `.env` only:

- `PLAYWRIGHT_USER`
- `PLAYWRIGHT_PASSWORD`
- `PLAYWRIGHT_ADMIN_NAME`
- `PLAYWRIGHT_ADMIN_EMAIL`
- `PLAYWRIGHT_ADMIN_PERFIL`
- `PLAYWRIGHT_USER_INVALID`
- `PLAYWRIGHT_PASSWORD_INVALID`
- `PLAYWRIGHT_USER_2FA`
- `PLAYWRIGHT_PASSWORD_2FA`
- `PLAYWRIGHT_USER_2FA_EMAIL`
- `PLAYWRIGHT_USER_EXPIRED`
- `PLAYWRIGHT_PASSWORD_EXPIRED`
- `PLAYWRIGHT_USER_OFFLINE`
- `PLAYWRIGHT_PASSWORD_OFFLINE`

Do not put real passwords in the workflow file or in a commit.

### Reports in Actions

The job summary lists **Aprovados**, **Reprovados** and **Ignorados**, plus flaky and not-run counts. The same markdown is stored at `test-results/e2e-summary.md`.

Each run uploads one artifact named `playwright-<run_id>-<suite>`, kept for 14 days:

- HTML report: `playwright-report/index.html`
- JUnit: `test-results/e2e-junit.xml`
- JSON: `test-results/e2e-results.json`
- Traces, screenshots and videos, only when a test fails

A failed probe or a failed test leaves the workflow red. The summary and the artifact are still published. That result is not sent to the VBConnection deploy.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `TARGET_ORIGIN_DENIED` | `PLAYWRIGHT_TARGET_URL` uses a host outside the allowlist, or it is not HTTPS. |
| Probe retries then exits 3 | The origin did not return HTTP 200 with a VB Connection document title. Confirm the URL is reachable over HTTPS. |
| Homologation tests time out on the login heading | `https://hmg.vbconnection.info/` currently renders the institutional site, with "Acessar" and "Quero ser cliente". The scenarios in this repository target the newfront login. Keep `npm test` on `https://newfront.vbconnection.info` until that host serves the same shell. |
| Browser executable missing | Run `npm run install:browsers`. |
| Tests time out on contract registration | The registration describe uses a 90 second timeout. Confirm the frontend is up and that API mocks were not bypassed. |
| Login uses an unexpected user | `PLAYWRIGHT_USER` and `PLAYWRIGHT_PASSWORD` override the mock persona. Unset them to return to `fixtures/login.mass.json`. |
| `npm ci` fails | Use Node 20+ and do not edit `package-lock.json` by hand. |

## Contribution guidelines

- Open a pull request to `main`. Do not force-push and do not rewrite published history.
- Use Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `docs:`).
- Keep selectors, assertions and per-UF scenarios intact unless a product change requires an update.
- Add or update the spec next to the module it covers. Reuse `pages/`, `support/` and `fixtures/` instead of copying a flow.
- Do not commit `.env`, storage state, traces, videos or real credentials.
- Run `npm run typecheck`, `npm run test:unit` and `node scripts/validate-pipeline-local.mjs` before opening a pull request.
