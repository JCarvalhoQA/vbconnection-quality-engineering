import { expect, Locator, Page } from '@playwright/test';
import type { ContratoRegistroMass } from '../fixtures/contrato';
import type { DetranConfig } from '../config/detransIds';
import { FormPage } from './common/formPage';
import { gotoApp, hideThirdPartyOverlays } from '../support/navigation';

export class ContratoPage extends FormPage {
  readonly heading: Locator;
  readonly destino: Locator;
  readonly submit: Locator;
  readonly adicionarVeiculo: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Registrar contrato' });
    this.destino = page.getByRole('combobox', { name: 'Destino' });
    this.submit = page.getByRole('button', { name: 'Registrar contrato' });
    this.adicionarVeiculo = page.getByRole('button', { name: 'Adicionar veículo' });
  }

  async acessar(): Promise<void> {
    await gotoApp(this.page, '/vbconnection/contrato/inserir');
    await expect(this.heading).toBeVisible();
    await expect(this.destino).toBeVisible();
    await this.aguardarCarregamento();
  }

  async selecionarDetran(config: DetranConfig): Promise<void> {
    await this.selectOption(this.destino, config.nomeFantasia);
    await expect(this.page.getByText('Carregando configuração do destino…')).toHaveCount(0);
    await expect(this.page.getByRole('heading', { name: 'Agente financeiro' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Veículos' })).toBeVisible();
    await expect(this.submit).toBeVisible();
    await hideThirdPartyOverlays(this.page);
  }

  async selecionarAgenteFinanceiro(label: string): Promise<void> {
    await this.selectOption(this.page.getByRole('combobox', { name: 'Agente financeiro' }), label);
  }

  async preencherVeiculo(dados: ContratoRegistroMass['veiculo']): Promise<void> {
    await this.adicionarVeiculo.click();
    await expect(this.page.getByPlaceholder('Chassi')).toBeVisible();
    await this.page.getByPlaceholder('Chassi').fill(dados.chassi);
    await this.fillByLabel('Ano fabricação', dados.ano);
    await this.fillByLabel('Ano modelo', dados.modelo);

    await this.page.getByRole('button', { name: 'Salvar' }).click();
    await expect(this.toast()).toContainText('Veículo salvo.');
  }

  async preencherContrato(dados: ContratoRegistroMass['contrato']): Promise<void> {
    await this.selectOption(this.page.locator('nz-select#tipoContrato'), dados.tipo);
    await this.page.getByRole('textbox', { name: 'Número do Contrato' }).fill(dados.numero);
    await this.fillDate('#dataContrato', dados.data);
  }

  async preencherDevedor(dados: ContratoRegistroMass['devedor'], config: DetranConfig): Promise<void> {
    const secao = this.page.locator('app-contrato-cadastro-devedor-section');
    await secao.getByRole('heading', { name: 'Devedor' }).scrollIntoViewIfNeeded();
    await secao.locator('#devedorCnpj').fill(dados.documento);
    await secao.locator('#devedorCnpj').blur();
    await secao.locator('#devedorNome').fill(dados.nome);

    const cep = secao.locator('#devedorCep');
    await expect(cep).toBeVisible();
    await cep.fill(dados.cep);
    await cep.blur();
    await expect(secao.locator('#devedorLogradouro')).not.toHaveValue('');
    await secao.locator('#devedorNumero').fill(dados.numero);

    if (!config.travaUfDevedor) {
      await expect(secao.getByRole('combobox', { name: 'UF' })).toContainText(dados.uf);
    }

    const cidade = secao.getByRole('combobox', { name: 'Cidade' });
    await expect(cidade).toBeEnabled();
    if (!(await cidade.innerText()).includes(dados.cidade)) {
      await this.selectOption(cidade, dados.cidade);
    }
  }

  async validarCamposObrigatorios(config: DetranConfig): Promise<void> {
    await expect(this.requiredMark('Agente financeiro')).toBeVisible();
    await expect(this.requiredMark('Tipo de Contrato')).toBeVisible();
    await expect(this.requiredMark('Número do Contrato')).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Número do Contrato' })).toHaveAttribute(
      'aria-required',
      'true',
    );
    await expect(this.requiredMark('Data do contrato')).toBeVisible();
    await expect(this.requiredMark('CPF / CNPJ')).toBeVisible();
    await expect(this.requiredMark('Nome completo')).toBeVisible();

    if (config.alertaDevedor) {
      await expect(this.page.getByText(config.alertaDevedor)).toBeVisible();
    }

    await this.enviarContrato();

    await expect(this.toast()).toContainText('Pelo menos 1 veículo deve ser informado.');
    await expect(this.toast()).toContainText('Há campos obrigatórios a serem preenchidos.');
    await expect(this.page).toHaveURL(/\/vbconnection\/contrato\/inserir/);
  }

  async enviarContrato(): Promise<void> {
    await this.submit.click({ force: true });
  }

  async esperarRegistroComSucesso(protocolo: string): Promise<void> {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) => res.url().includes('contratos/registrar') && res.request().method() === 'POST',
        { timeout: 15_000 },
      ),
      this.enviarContrato(),
    ]);

    expect(response.ok()).toBeTruthy();
    const body = (await response.json()) as { protocolo?: string; status?: string };

    expect(body.protocolo).toBe(protocolo);
    expect(body.status).toBe('RECEBIDO');
    await expect(this.page.getByText('Contrato registrado com sucesso.')).toBeVisible();
  }

  private requiredMark(label: string): Locator {
    return this.page.locator('label').filter({ hasText: label }).getByText('*');
  }
}

export { ContratoPage as ContratoCadastroPage };
