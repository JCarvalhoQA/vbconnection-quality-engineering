import { expect, Locator, Page } from '@playwright/test';
import type { UfUiProfile } from '../../support/ufUiProfile';

export type ZeroKmValor = 'Sim' | 'Não';

/**
 * Linha expansível de veículo na PAGE-02 (não é dialog).
 *
 * Locators ancorados em `article` + heading Veículos.
 * Não usa IDs `*-veic-{timestamp}-n`. Não persiste: não há método de Salvar.
 */
export class VeiculoSection {
  readonly secao: Locator;
  readonly adicionar: Locator;
  readonly chassi: Locator;
  readonly gravame: Locator;
  readonly zeroKm: Locator;
  readonly motor: Locator;
  readonly novoUsado: Locator;
  readonly anoFabricacao: Locator;
  readonly especie: Locator;
  readonly cor: Locator;
  readonly ufPlaca: Locator;
  readonly placa: Locator;
  readonly renavam: Locator;
  readonly excluir: Locator;
  readonly salvar: Locator;

  constructor(private readonly page: Page) {
    this.secao = page.locator('article').filter({
      has: page.getByRole('heading', { name: 'Veículos', exact: true }),
    });
    this.adicionar = this.secao.getByRole('button', { name: /Adicionar veículo/i }).or(
      page.getByRole('button', { name: /Adicionar veículo/i }),
    );
    this.chassi = this.secao.getByRole('textbox', { name: /^Chassi/i }).or(this.secao.getByPlaceholder('Chassi'));
    this.gravame = this.secao.getByRole('textbox', { name: /gravame|restrição/i });
    this.zeroKm = this.secao.getByRole('combobox', { name: /Veículo zero km/i });
    this.motor = this.secao.getByRole('textbox', { name: /Número motor/i });
    this.novoUsado = this.secao.getByRole('combobox', { name: /Novo\s*\/\s*usado/i });
    this.anoFabricacao = this.secao.getByRole('textbox', { name: /Ano fabricação/i });
    this.especie = this.secao.getByRole('combobox', { name: /esp[eé]cie/i });
    this.cor = this.secao.getByRole('combobox', { name: /^Cor\b/i }).or(this.secao.getByRole('textbox', { name: /^Cor\b/i }));
    this.ufPlaca = this.secao.getByRole('combobox', { name: /UF da placa/i });
    this.placa = this.secao.getByRole('textbox', { name: /^Placa/i }).or(this.secao.getByPlaceholder('Placa'));
    this.renavam = this.secao.getByRole('textbox', { name: /RENAVAM/i }).or(this.secao.getByPlaceholder('RENAVAM'));
    this.excluir = this.secao.getByRole('button', { name: /Excluir veículo/i });
    this.salvar = this.secao.getByRole('button', { name: /^Salvar$/i });
  }

  async identificarSecao(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Veículos', exact: true })).toBeVisible();
    await expect(this.secao).toBeVisible();
    await expect(this.adicionar).toBeVisible();
  }

  async abrirLinha(): Promise<void> {
    await this.secao.scrollIntoViewIfNeeded();
    await this.adicionar.click();
    await expect(this.chassi).toHaveCount(1);
    await expect(this.chassi).toBeVisible({ timeout: 15_000 });
  }

  async expectLinhaAberta(): Promise<void> {
    await expect(this.chassi).toHaveCount(1);
    await expect(this.chassi).toBeVisible();
    await expect(this.gravame).toHaveCount(1);
    await expect(this.salvar).toBeVisible();
    await expect(this.excluir).toBeVisible();
    await expect(this.secao.getByRole('dialog')).toHaveCount(0);
  }

  async expectCamposIniciais(profile: UfUiProfile): Promise<void> {
    await this.expectLinhaAberta();
    await expect(this.gravame).toBeVisible();
    await expect(this.zeroKm).toBeVisible();
    if (profile.veiculo.zeroKm.default) {
      await expect(this.zeroKm).toContainText(profile.veiculo.zeroKm.default);
    }
    if (profile.veiculo.novoUsado.visivel) {
      await expect(this.novoUsado).toBeVisible();
    } else {
      await expect(this.novoUsado).toHaveCount(0);
    }
    const motorEsperado = profile.veiculo.camposZeroKmSim.some((campo) => campo.formControl === 'numeroMotor');
    if (motorEsperado) {
      await expect(this.motor).toBeVisible();
    }
    await this.expectAnoFabricacao(profile);
    await this.expectCampoInventario(profile, 'tipoEspecie', this.especie, true);
    await this.expectCampoInventario(profile, 'descricaoCorVeiculo', this.cor, false);
    await this.expectCamposPlaca(false);
  }

  async definirZeroKm(valor: ZeroKmValor): Promise<void> {
    await this.zeroKm.click();
    const option = this.page.locator('.cdk-overlay-pane').getByText(valor, { exact: true }).last();
    await expect(option).toBeVisible();
    await option.click();
    await expect(this.zeroKm).toContainText(valor);
  }

  async expectCamposPlaca(visivel: boolean): Promise<void> {
    if (visivel) {
      await expect(this.ufPlaca).toBeVisible();
      await expect(this.placa).toHaveCount(1);
      await expect(this.placa).toBeVisible();
      await expect(this.renavam).toHaveCount(1);
      await expect(this.renavam).toBeVisible();
      return;
    }
    await expect(this.ufPlaca).toBeHidden();
    await expect(this.placa).toBeHidden();
    await expect(this.renavam).toBeHidden();
  }

  async expectCampoInventario(
    profile: UfUiProfile,
    formControl: string,
    locator: Locator,
    detectarAusencia = false,
  ): Promise<void> {
    const campo = profile.veiculo.camposZeroKmSim.find((item) => item.formControl === formControl);
    if (!campo) {
      if (detectarAusencia) {
        await expect(locator).toHaveCount(0);
      }
      return;
    }
    await expect(locator).toHaveCount(1);
    await expect(locator).toBeVisible();
    if (campo.requiredVisual) {
      const rotulo = campo.label.replace(/\*+\s*$/, '').trim();
      await expect(this.marcaObrigatorio(new RegExp(rotulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))).toBeVisible();
    }
  }

  async expectAnoFabricacao(profile: UfUiProfile): Promise<void> {
    const campo = profile.veiculo.camposZeroKmSim.find((item) => item.formControl === 'ano');
    if (!campo) {
      return;
    }
    await expect(this.anoFabricacao).toBeVisible();
    if (campo.requiredVisual) {
      await expect(this.marcaObrigatorio(/Ano fabricação/i)).toBeVisible();
    }
  }

  async expectNovoUsado(visivel: boolean, obrigatorioVisual = false): Promise<void> {
    if (!visivel) {
      await expect(this.novoUsado).toHaveCount(0);
      return;
    }
    await expect(this.novoUsado).toBeVisible();
    if (obrigatorioVisual) {
      await expect(this.marcaObrigatorio(/Novo\s*\/\s*usado/i)).toBeVisible();
    }
  }

  async descartarLinha(): Promise<void> {
    await expect(this.excluir).toBeVisible();
    await this.excluir.click();
    const dialog = this.page.getByRole('dialog');
    if ((await dialog.count()) > 0) {
      const confirmar = dialog.getByRole('button', { name: /Sim|Confirmar|Excluir/i });
      if (await confirmar.first().isVisible().catch(() => false)) {
        await confirmar.first().click();
      }
    }
    await expect(this.chassi).toBeHidden({ timeout: 10_000 });
    await expect(this.secao.getByText(/Nenhum veículo/i)).toBeVisible({ timeout: 10_000 });
  }

  marcaObrigatorio(label: string | RegExp): Locator {
    return this.secao.locator('label').filter({ hasText: label }).getByText('*');
  }
}
