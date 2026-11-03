import { Page } from '@playwright/test';
import { ContratoFactory } from '../factories/contratoFactory';
import type { ContratoRegistroMass } from '../fixtures/contrato';
import type { DetranConfig, DetranUf } from '../config/detransIds';
import { ContratoPage } from '../pages/contratoPage';

export class ContratoActions {
  readonly contratoPage: ContratoPage;

  constructor(page: Page) {
    this.contratoPage = new ContratoPage(page);
  }

  gerarDadosContrato(uf: DetranUf): ContratoRegistroMass {
    return ContratoFactory.registro(uf);
  }

  async iniciarFluxoContrato(config: DetranConfig, agente: string): Promise<void> {
    await this.contratoPage.acessar();
    await this.contratoPage.selecionarDetran(config);
    await this.contratoPage.selecionarAgenteFinanceiro(agente);
  }

  async preencherRegistro(mass: ContratoRegistroMass, config: DetranConfig): Promise<void> {
    await this.contratoPage.selecionarAgenteFinanceiro(mass.agente.label);
    await this.contratoPage.preencherVeiculo(mass.veiculo);
    await this.contratoPage.preencherContrato(mass.contrato);
    await this.contratoPage.preencherDevedor(mass.devedor, config);
  }

  async validarCamposObrigatorios(config: DetranConfig): Promise<void> {
    await this.contratoPage.acessar();
    await this.contratoPage.selecionarDetran(config);
    await this.contratoPage.validarCamposObrigatorios(config);
  }

  async registrarContratoNovo(uf: DetranUf, config: DetranConfig, protocolo: string): Promise<ContratoRegistroMass> {
    const mass = this.gerarDadosContrato(uf);
    await this.contratoPage.acessar();
    await this.contratoPage.selecionarDetran(config);
    await this.preencherRegistro(mass, config);
    await this.contratoPage.esperarRegistroComSucesso(protocolo);
    return mass;
  }
}
