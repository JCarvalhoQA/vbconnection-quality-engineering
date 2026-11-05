import { expect, Locator, Page } from '@playwright/test';
import type { ContratoRegistroMass } from '../fixtures/contrato';
import type { DetranConfig } from '../config/detransIds';
import { FormPage } from './common/formPage';
import { VeiculoSection } from './fragments/veiculoSection';
import { gotoApp, hideThirdPartyOverlays } from '../support/navigation';
import { UFS } from '../config/ufsConfig';
import { isStableFieldId, rotuloExato, type LiveField } from '../support/ufUiProfile';
import {
  campoObrigatorio,
  campoVisivel,
  loadMatrizFixture,
  MatrizFixture,
  SECAO_AGENTE,
  SECAO_COMPLEMENTARES,
  SECAO_CONTRATO,
  SECAO_CREDOR,
  SECAO_DEVEDOR,
  SECAO_TERCEIRO_GARANTIDOR,
  SECAO_VEICULO,
  secaoVisivel,
} from '../support/matrizLoader';

export class ContratoPage extends FormPage {
  readonly heading: Locator;
  readonly destino: Locator;
  readonly submit: Locator;
  readonly adicionarVeiculo: Locator;
  readonly veiculos: VeiculoSection;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Registrar contrato' });
    this.destino = page.getByRole('combobox', { name: 'Destino' });
    this.submit = page.getByRole('button', { name: 'Registrar contrato' });
    this.adicionarVeiculo = page.getByRole('button', { name: 'Adicionar veículo' });
    this.veiculos = new VeiculoSection(page);
  }

  matrizDaUf(uf: string): MatrizFixture {
    return loadMatrizFixture(uf);
  }

  async acessar(): Promise<void> {
    await gotoApp(this.page, '/vbconnection/contrato/inserir');
    await expect(this.heading).toBeVisible();
    await expect(this.destino).toBeVisible();
    await this.aguardarCarregamento();
  }

  async selecionarDestino(nomeFantasia: string): Promise<void> {
    await this.selectOption(this.destino, nomeFantasia);
    await expect(this.page.getByText('Carregando configuração do destino…')).toHaveCount(0);
    await expect(this.page.getByRole('heading', { name: 'Agente financeiro' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Veículos' })).toBeVisible();
    await expect(this.submit).toBeVisible();
    await hideThirdPartyOverlays(this.page);
  }

  async selecionarDetran(config: DetranConfig): Promise<void> {
    const matriz = this.matrizDaUf(config.uf);
    await this.selecionarDestino(config.nomeFantasia);
    if (secaoVisivel(matriz, SECAO_TERCEIRO_GARANTIDOR)) {
      const tg = this.page.getByRole('heading', { name: /terceiro garantidor/i });
      if ((await tg.count()) > 0) {
        await expect(tg.first()).toBeVisible();
      }
    }
  }

  async selecionarAgenteFinanceiro(label: string): Promise<void> {
    await this.selectOption(this.page.getByRole('combobox', { name: 'Agente financeiro' }), label);
  }

  async preencherVeiculo(dados: ContratoRegistroMass['veiculo'], uf: string): Promise<void> {
    const matriz = this.matrizDaUf(uf);
    await this.adicionarVeiculo.click();
    const chassi = this.page.getByPlaceholder('Chassi');
    await expect(chassi).toBeVisible();
    await chassi.fill(dados.chassi);

    if (campoVisivel(matriz, SECAO_VEICULO, 'REMARCADO') && dados.situacaoChassi) {
      await this.selectOption(
        this.page.getByRole('combobox', { name: 'Situação do chassi', exact: true }),
        dados.situacaoChassi,
      );
    }

    if (campoVisivel(matriz, SECAO_VEICULO, 'NUMERO_RESTRICAO') && dados.restricao) {
      await this.page.getByRole('textbox', { name: 'N° gravame/restrição', exact: true }).fill(dados.restricao);
    }

    if (campoVisivel(matriz, SECAO_VEICULO, 'ANO_FABRICACAO') && dados.ano) {
      await this.page.getByRole('textbox', { name: /Ano fabricação/i }).fill(dados.ano);
    }

    if (campoVisivel(matriz, SECAO_VEICULO, 'ANO_MODELO') && dados.modelo) {
      await this.page.getByRole('textbox', { name: /Ano modelo/i }).fill(dados.modelo);
    }

    if (campoVisivel(matriz, SECAO_VEICULO, 'INDICA_NOVO_USADO') && dados.indicaNovoUsado) {
      await this.selectOption(
        this.page.getByRole('combobox', { name: /Novo \/ usado/i }),
        dados.indicaNovoUsado,
      );
    }

    if (campoVisivel(matriz, SECAO_VEICULO, 'UF_LICENCIAMENTO')) {
      const ufLicenciamento = this.page.getByRole('combobox', { name: /UF (do )?licenciamento/i }).first();
      if (
        (await ufLicenciamento.count()) > 0 &&
        (await ufLicenciamento.locator('input').first().isEnabled().catch(() => false))
      ) {
        await this.selectOption(ufLicenciamento, uf);
      }
    }

    if (campoVisivel(matriz, SECAO_VEICULO, 'DESCRICAO_COR_VEICULO')) {
      const cor = this.page.getByRole('textbox', { name: /^Cor$/i }).or(
        this.page.getByRole('textbox', { name: /Descrição Cor/i }),
      );
      if ((await cor.count()) > 0 && (await cor.first().isEnabled().catch(() => false))) {
        await cor.first().fill('Prata');
      }
    }

    await this.page.getByRole('button', { name: 'Salvar' }).click();
    await expect(this.toast()).toContainText('Veículo salvo.');
  }

  async preencherContrato(mass: ContratoRegistroMass): Promise<void> {
    const dados = mass.contrato;
    const uf = mass.uf;
    const matriz = this.matrizDaUf(uf);
    const secao = this.articleByHeading('Contrato');

    if (campoVisivel(matriz, SECAO_CONTRATO, 'TIPO_CONTRATO') && dados.tipo) {
      const tipo = this.page.locator('nz-select#tipoContrato');
      if ((await tipo.count()) > 0) {
        await this.selectOption(tipo, dados.tipo);
      } else {
        await this.fillNamed(secao, /Tipo de Contrato/i, dados.tipo, 'combobox');
      }
    }

    if (campoVisivel(matriz, SECAO_CONTRATO, 'TIPO_RESTRICAO') && dados.tipoRestricao) {
      await this.fillNamed(secao, /Tipo de restrição/i, dados.tipoRestricao, 'combobox');
    }

    await this.page.getByRole('textbox', { name: 'Número do Contrato' }).fill(dados.numero);

    if (campoVisivel(matriz, SECAO_CONTRATO, 'DATA_CONTRATO') && dados.data) {
      const filled = await this.fillNamed(secao, /Data do contrato/i, dados.data);
      if (!filled) {
        await this.fillDate('#dataContrato', dados.data);
      }
    }

    if (dados.liberacaoCredito) {
      await this.fillNamed(secao, /Liberação de crédito/i, dados.liberacaoCredito);
    }
    if (dados.inicioVigencia) {
      await this.fillNamed(secao, /Início vigência/i, dados.inicioVigencia);
    }
    if (dados.fimVigencia) {
      await this.fillNamed(secao, /Fim vigência/i, dados.fimVigencia);
    }
    if (dados.parcelas) {
      await this.fillNamed(secao, /Número de parcelas/i, dados.parcelas);
    }
    if (dados.valorTotal) {
      await this.fillNamed(secao, /Valor total financiamento/i, dados.valorTotal);
    }
    if (dados.valorParcela) {
      await this.fillNamed(secao, /Valor da parcela/i, dados.valorParcela);
    }
    if (dados.vencPrimeira) {
      await this.fillNamed(secao, /Venc\. 1ª parcela/i, dados.vencPrimeira);
    }
    if (dados.vencUltima) {
      await this.fillNamed(secao, /Venc\. última parcela/i, dados.vencUltima);
    }
    if (dados.iof) {
      await this.fillNamed(secao, /^IOF$/i, dados.iof);
    }
    if (dados.jurosMes) {
      await this.fillNamed(secao, /Taxa juros mês/i, dados.jurosMes);
    }
    if (dados.jurosAno) {
      await this.fillNamed(secao, /Taxa juros ano/i, dados.jurosAno);
    }
    if (dados.penalidade) {
      await this.fillNamed(secao, /^Penalidade$/i, dados.penalidade);
    }
    if (dados.dataPagamento) {
      await this.page.keyboard.press('Escape').catch(() => undefined);
      const picker = secao.locator('nz-date-picker#dataPagamento').or(
        secao.locator('app-consult-filter-field').filter({ hasText: /Data de pagamento/i }).locator('nz-date-picker'),
      );
      if ((await picker.count()) > 0) {
        await this.fillNzDatePicker(picker.first(), dados.dataPagamento);
      } else {
        await this.fillNamed(secao, /Data de pagamento/i, dados.dataPagamento);
      }
    }

    if (campoObrigatorio(matriz, SECAO_CONTRATO, 'UF_LIBERACAO_CREDITO')) {
      await this.selecionarUf(secao, /UF liberação crédito/i, uf);
    }
    if (campoObrigatorio(matriz, SECAO_CONTRATO, 'MUNICIPIO_LIBERACAO_CREDITO')) {
      await this.fillNamed(secao, /Cidade liberação crédito/i, mass.devedor.cidade, 'combobox');
    }
    if (campoObrigatorio(matriz, SECAO_CONTRATO, 'UF_LOCAL_PAGAMENTO')) {
      await this.selecionarUf(secao, /UF local de pagamento/i, uf);
    }
    if (campoObrigatorio(matriz, SECAO_CONTRATO, 'MUNICIPIO_LOCAL_PAGAMENTO')) {
      await this.fillNamed(secao, /Cidade local de pagamento/i, mass.devedor.cidade, 'combobox');
    }
  }

  async preencherDevedor(dados: ContratoRegistroMass['devedor'], config: DetranConfig): Promise<void> {
    const matriz = this.matrizDaUf(config.uf);
    const secao = this.page.locator('app-contrato-cadastro-devedor-section');
    const usaIds = (await secao.count()) > 0;

    if (usaIds) {
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

      if (campoObrigatorio(matriz, SECAO_DEVEDOR, 'END_COMPLEMENTO') && dados.complemento) {
        await this.fillNamed(secao, /^Complemento$/i, dados.complemento);
      }
      if (campoObrigatorio(matriz, SECAO_DEVEDOR, 'TEL_NUMERO') && dados.telefone) {
        await this.fillNamed(secao, /^Telefone$/i, dados.telefone);
      }
      return;
    }

    const artigo = this.articleByHeading('Devedor');
    await artigo.scrollIntoViewIfNeeded();
    await this.fillNamed(artigo, /CPF \/ CNPJ/i, dados.documento);
    await this.fillNamed(artigo, /Nome completo/i, dados.nome);
    await this.fillNamed(artigo, /^CEP$/i, dados.cep);
    await expect(artigo.getByRole('textbox', { name: 'Logradouro' })).not.toHaveValue('');
    await this.fillNamed(artigo, /^Número$/i, dados.numero);
    if (campoObrigatorio(matriz, SECAO_DEVEDOR, 'END_COMPLEMENTO') && dados.complemento) {
      await this.fillNamed(artigo, /^Complemento$/i, dados.complemento);
    }
    if (campoObrigatorio(matriz, SECAO_DEVEDOR, 'TEL_NUMERO') && dados.telefone) {
      await this.fillNamed(artigo, /^Telefone$/i, dados.telefone);
    }
  }

  async preencherCredorEComplemento(mass: ContratoRegistroMass): Promise<void> {
    const matriz = this.matrizDaUf(mass.uf);

    if (secaoVisivel(matriz, SECAO_CREDOR) && campoObrigatorio(matriz, SECAO_CREDOR, 'END_CEP')) {
      const credor = this.articleByHeading('Credor');
      if ((await credor.count()) > 0) {
        await credor.scrollIntoViewIfNeeded();
        await this.fillNamed(credor, /^CEP$/i, mass.devedor.cep);
        await expect(credor.getByRole('textbox', { name: 'Logradouro' })).not.toHaveValue('');
        await this.fillNamed(credor, /^Número$/i, mass.devedor.numero);
        if (campoObrigatorio(matriz, SECAO_CREDOR, 'TEL_NUMERO') && mass.devedor.telefone) {
          await this.fillNamed(credor, /^Telefone$/i, mass.devedor.telefone);
        }
        if (campoObrigatorio(matriz, SECAO_CREDOR, 'EMAIL') && mass.devedor.email) {
          await this.fillNamed(credor, /^E-mail$/i, mass.devedor.email);
        }
      }
    }

    if (mass.contrato.indice && campoObrigatorio(matriz, SECAO_COMPLEMENTARES, 'INDICE_SIGLA')) {
      const complemento = this.articleByHeading(/Dados complementares/i);
      await complemento.scrollIntoViewIfNeeded();
      await this.fillNamed(complemento, /^Índice$/i, mass.contrato.indice);
    }
    if (mass.contrato.multa && campoObrigatorio(matriz, SECAO_COMPLEMENTARES, 'MULTA_VALOR')) {
      const complemento = this.articleByHeading(/Dados complementares/i);
      await complemento.scrollIntoViewIfNeeded();
      await this.fillNamed(complemento, /^Multa$/i, mass.contrato.multa);
    }
  }

  async validarCamposObrigatorios(config: DetranConfig): Promise<void> {
    const matriz = this.matrizDaUf(config.uf);

    if (campoObrigatorio(matriz, SECAO_AGENTE, 'NOME') || campoObrigatorio(matriz, SECAO_AGENTE, 'NUMERO_DOCUMENTO')) {
      await expect(this.marcaObrigatorio('Agente financeiro')).toBeVisible();
    }

    if (campoObrigatorio(matriz, SECAO_CONTRATO, 'TIPO_CONTRATO')) {
      await expect(this.marcaObrigatorio('Tipo de Contrato')).toBeVisible();
    } else if (!campoVisivel(matriz, SECAO_CONTRATO, 'TIPO_CONTRATO')) {
      const tipo = this.page.locator('nz-select#tipoContrato');
      if ((await tipo.count()) > 0) {
        await expect(tipo).toBeHidden();
      }
    }

    if (campoObrigatorio(matriz, SECAO_CONTRATO, 'NUMERO')) {
      await expect(this.marcaObrigatorio('Número do Contrato')).toBeVisible();
      await expect(this.page.getByRole('textbox', { name: 'Número do Contrato' })).toHaveAttribute(
        'aria-required',
        'true',
      );
    }

    if (campoObrigatorio(matriz, SECAO_CONTRATO, 'DATA_CONTRATO')) {
      await expect(this.marcaObrigatorio('Data do contrato')).toBeVisible();
    } else if (!campoVisivel(matriz, SECAO_CONTRATO, 'DATA_CONTRATO')) {
      const data = this.page.locator('#dataContrato');
      if ((await data.count()) > 0) {
        await expect(data).toBeHidden();
      }
    }

    if (campoObrigatorio(matriz, SECAO_DEVEDOR, 'NUMERO_DOCUMENTO')) {
      await expect(this.marcaObrigatorio('CPF / CNPJ')).toBeVisible();
    }
    if (campoObrigatorio(matriz, SECAO_DEVEDOR, 'NOME')) {
      await expect(this.marcaObrigatorio('Nome completo')).toBeVisible();
    }

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

  marcaObrigatorio(label: string | RegExp, secao?: string | RegExp): Locator {
    const texto = typeof label === 'string' ? rotuloExato(label) : label;
    const noEscopo = (raiz: Page | Locator) => raiz.locator('label').filter({ hasText: texto }).getByText('*');
    if (!secao) {
      return noEscopo(this.page);
    }
    return noEscopo(this.articleByHeading(secao));
  }

  marcaObrigatorioCampo(field: Pick<LiveField, 'label' | 'secao' | 'id'>): Locator {
    if (isStableFieldId(field.id)) {
      return this.page.locator(`#${field.id}-label`).getByText('*');
    }
    return this.marcaObrigatorio(field.label, field.secao);
  }

  private async selecionarUf(scope: Locator, name: string | RegExp, uf: string): Promise<void> {
    const campo = scope.getByRole('combobox', { name }).first();
    if ((await campo.count()) === 0) {
      return;
    }
    await campo.click();
    const pane = this.page.locator('.cdk-overlay-pane').last();
    const estado = UFS[uf]?.estado;
    const option = pane.getByText(uf, { exact: true }).or(pane.getByText(estado ?? uf, { exact: true }));
    if ((await option.count()) === 0) {
      const search = campo.locator('input').first();
      if (await search.isEnabled().catch(() => false)) {
        await search.fill(uf);
      }
    }
    await expect(option.last()).toBeVisible();
    await option.last().click();
  }
}

export { ContratoPage as ContratoCadastroPage };
