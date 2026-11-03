import { test, expect } from '@playwright/test';
import { ContratoActions } from '../../../actions/contratoActions';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';
import { DetranUf, detranConfig } from '../../../config/detransIds';

export function definirTestesRegistroContrato(uf: DetranUf): void {
  const config = detranConfig(uf);

  test.describe(`Registro contrato - ${uf} @contrato @registro @${uf.toLowerCase()}`, () => {
    test.describe.configure({ timeout: 90_000 });
    let protocolo = '';

    test.beforeEach(async ({ page }) => {
      await mockLoginApis(page);
      protocolo = await mockContratoCadastroApis(page, uf);
      await seedAuthenticatedSession(page);
    });

    test(`Registro contrato - ${uf} - validar campos obrigatórios`, async ({ page }) => {
      const contrato = new ContratoActions(page);
      await contrato.validarCamposObrigatorios(config);
    });

    test(`Registro contrato - ${uf} - registrar contrato com sucesso`, async ({ page }) => {
      const contrato = new ContratoActions(page);
      const mass = await contrato.registrarContratoNovo(uf, config, protocolo);

      expect(mass.veiculo.chassi).toHaveLength(17);
      expect(mass.contrato.numero).toMatch(new RegExp(`^E2E${uf}`));
    });
  });
}
