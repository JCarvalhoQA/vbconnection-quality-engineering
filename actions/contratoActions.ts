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
    await this.contratoPage.preencherVeiculo(mass.veiculo, config.uf);
    await this.contratoPage.preencherContrato(mass);
    await this.contratoPage.preencherDevedor(mass.devedor, config);
    await this.contratoPage.preencherCredorEComplemento(mass);
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

  async registrarContratoComPayload(
    uf: DetranUf,
    config: DetranConfig,
    protocolo: string,
  ): Promise<ContratoRegistroMass> {
    const mass = this.gerarDadosContrato(uf);
    await this.contratoPage.acessar();
    await this.contratoPage.selecionarDetran(config);
    await this.preencherRegistro(mass, config);
    await this.contratoPage.esperarRegistroFuncional(protocolo, {
      chassi: mass.veiculo.chassi,
      numero: mass.contrato.numero,
    });
    return mass;
  }
}
