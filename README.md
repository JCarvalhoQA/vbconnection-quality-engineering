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
├── actions/                  contract actions
├── config/                   DETRAN rules and environment URLs
├── e2e/
│   ├── acessibilidade/
│   ├── cadastros/
│   ├── contratos/            consult and per-UF registration
│   ├── home/
│   ├── login/
│   ├── navegacao/
│   └── telas-padrao/
├── factories/
├── fixtures/                 mock personas and DETRAN data
├── pages/                    page objects
├── scripts/                  probe, summary and local pipeline checks
├── support/                  auth, navigation and API mocks
├── tests/                    target-policy unit tests (no browser)
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
npm run test:ui
npm run test:unit
npm run typecheck
```

`test:unit` checks URL allowlisting in process. It does not open a browser and it does not call VBConnection.

## Running tests by module or state

```bash
npx playwright test --project=vbconnection-newfront e2e/login
npx playwright test --project=vbconnection-newfront e2e/contratos
npx playwright test --project=vbconnection-newfront e2e/contratos/registro/ba.spec.ts
npx playwright test --project=vbconnection-newfront --grep @sp
npx playwright test --project=vbconnection-hmg --grep @ba
```

Registration specs exist for AC, AP, BA, DF, ES, MG, MS, MT, PB, PE, PR, RJ, RN, RR, RS, SC, SE, SP and TO. Each state runs two scenarios: required fields, then a successful mocked registration. Grep tags use the lower-case UF (`@ba`, `@sp`).

Replace the project name with `vbconnection-docker` or `vbconnection-hmg` to point the same spec at another environment.

## Test reports

A run writes:

- HTML: `playwright-report/index.html` (`npm run report`)
- JSON: `test-results/e2e-results.json`
- JUnit: `test-results/e2e-junit.xml`
- Markdown summary: `test-results/e2e-summary.md` after `npm run report:summary`

Traces, screenshots and videos are kept on failure. Those folders are gitignored.

## CI/CD integration

`.github/workflows/playwright-tests.yml` runs in this repository only.

- Pull requests to `main` run the `@smoke` suite against `https://newfront.vbconnection.info`.
- `workflow_dispatch` can run `smoke` or `regression` against the published frontend or `https://hmg.vbconnection.info`.
- The job installs dependencies, installs Chromium, typechecks, runs the target-policy unit tests, probes the allowlisted origin, then runs Playwright.
- HTML, JUnit, JSON and the markdown summary are uploaded as artifacts.
- Passed, failed and skipped counts are written to the job summary.
- A failed probe or a failed test fails the workflow. The result is not converted into a success.

There is no schedule. The suite depends on a shared external frontend, this repository does not store a dedicated CI user, and a cron would add load without a release signal. Manual dispatch and pull requests are the triggers.

This workflow does not build, publish or block the VBConnection application. Do not add it as a required check on the application repository.

The probe accepts only `newfront.vbconnection.info` and `hmg.vbconnection.info` over HTTPS, with no userinfo, query or fragment. Production and any other host are rejected.

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
