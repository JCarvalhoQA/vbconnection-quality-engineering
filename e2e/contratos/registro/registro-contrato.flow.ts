import { test, expect } from '@playwright/test';
import { ContratoActions } from '../../../actions/contratoActions';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';
import { DetranUf, detranConfig } from '../../../config/detransIds';

const SE_SKIP =
  'SE: formularioIndisponivel — sem coluna na matriz Java (MatrizDados*) e sem fixture fixtures/matriz/SE.json. Não simular cadastro como DETRAN suportado.';

export function definirTestesRegistroContrato(uf: DetranUf): void {
  if (uf === 'SE') {
    test.describe(`Registro contrato - SE @contrato @registro @se @mocked`, () => {
      test(`Registro contrato - SE - validar campos obrigatórios`, () => {
        test.skip(true, SE_SKIP);
      });

      test(`Registro contrato - SE - registrar contrato com sucesso`, () => {
        test.skip(true, SE_SKIP);
      });
    });
    return;
  }

  const config = detranConfig(uf);

  test.describe(`Registro contrato - ${uf} @contrato @registro @${uf.toLowerCase()} @mocked`, () => {
    test.describe.configure({ timeout: 90_000 });
    let protocolo = '';

    test.beforeEach(async ({ page }) => {
      annotateMockedExecution();
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
      if (uf === 'BA') {
        expect(mass.veiculo.indicaNovoUsado).toBe('Novo');
        expect(mass.veiculo.ano).toBeUndefined();
      } else {
        expect(mass.veiculo.indicaNovoUsado).toBeUndefined();
      }
    });
  });
}
