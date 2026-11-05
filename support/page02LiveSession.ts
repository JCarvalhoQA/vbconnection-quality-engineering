import { expect, Page } from '@playwright/test';
import { ContratoPage } from '../pages/contratoPage';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { destinoEstrutural } from '../config/destinosEstruturais';
import {
  assertMasterProfile,
  AuthCapture,
  extractDestinoUfs,
  installAuthCapture,
  installDestinosCapture,
  requireMasterCredentials,
  summarizeAuthBody,
} from './liveInspect';

export async function autenticarMasterLive(page: Page): Promise<AuthCapture> {
  const credenciais = requireMasterCredentials();
  const login = new LoginPage(page);
  const home = new HomePage(page);
  const capture: AuthCapture = {};

  await installAuthCapture(page, capture);
  await login.goto();
  await login.fillCredentials({ username: credenciais.username, password: credenciais.password });
  await login.submitLogin();
  await login.loader.waitUntilHidden();
  await expect.poll(() => capture.tokens?.status, { timeout: 30_000 }).toBe(200);
  const tokensResumo = summarizeAuthBody(capture.tokens?.body);
  if (tokensResumo.autenticaEmDuasEtapas || tokensResumo.passwordExpirado || !tokensResumo.hasToken) {
    throw new Error(`Live-readonly bloqueado: tokens ${JSON.stringify(tokensResumo)}`);
  }
  await expect.poll(() => capture.prefs2?.status, { timeout: 30_000 }).toBe(200);
  assertMasterProfile(capture.prefs2?.body);
  await home.expectLoaded();
  return capture;
}

export async function abrirPage02DestinoLive(page: Page, capture: AuthCapture, uf: string): Promise<ContratoPage> {
  const contrato = new ContratoPage(page);
  await installDestinosCapture(page, capture);
  await contrato.acessar();
  await expect.poll(() => capture.destinos, { timeout: 20_000 }).toBeTruthy();
  expect(extractDestinoUfs(capture.destinos)).toContain(uf);
  await contrato.selecionarDestino(destinoEstrutural(uf).nomeFantasia);
  return contrato;
}
