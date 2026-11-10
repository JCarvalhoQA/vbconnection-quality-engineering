import { test, expect } from '@playwright/test';
import { ContratoActions } from '../../../actions/contratoActions';
import { CONTRATO_AGENTE_PILOTO } from '../../../fixtures/contrato';
import { mockLoginApis, seedAuthenticatedSession } from '../../../support/auth';
import { annotateMockedExecution, mockContratoCadastroApis } from '../../../support/contratoCadastroMocks';
import { detranConfig } from '../../../config/detransIds';

const UF = 'BA';
const CONFLUENCE_BA = 'https://qualitydigital.atlassian.net/wiki/spaces/VA/pages/2106490952';

test.describe('PAGE-02 funcionais negativos @contrato @funcional @negativo @mocked', () => {
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    annotateMockedExecution();
    test.info().annotations.push({ type: 'negative-class', description: 'FRONTEND_VALIDATION' });
    test.info().annotations.push({ type: 'confluence', description: CONFLUENCE_BA });
    await mockLoginApis(page);
    await mockContratoCadastroApis(page, UF);
    await seedAuthenticatedSession(page);
  });

  test('CT-084 - deve recusar nono dígito no gravame (maxLength 8)', async ({ page }) => {
    test.info().annotations.push({ type: 'ct', description: 'CT-084' });
    test.info().annotations.push({ type: 'prioridade', description: 'P1' });

    const contrato = new ContratoActions(page);
    await contrato.contratoPage.acessar();
    await contrato.contratoPage.selecionarDetran(detranConfig(UF));
    await contrato.contratoPage.selecionarAgenteFinanceiro(CONTRATO_AGENTE_PILOTO.label);
    await contrato.contratoPage.adicionarVeiculo.click();

    const gravame = page.getByRole('textbox', { name: 'N° gravame/restrição', exact: true });
    await expect(gravame).toBeVisible();
    await expect(gravame).toHaveAttribute('maxlength', '8');
    await gravame.fill('123456789');
    await expect(gravame).toHaveValue('12345678');
    await expect(page.getByText('Contrato registrado com sucesso.')).toHaveCount(0);
  });

  test('CT-085 - deve impedir quantidade de parcelas negativa', async ({ page }) => {
    test.info().annotations.push({ type: 'ct', description: 'CT-085' });
    test.info().annotations.push({ type: 'prioridade', description: 'P1' });

    const contrato = new ContratoActions(page);
    await contrato.contratoPage.acessar();
    await contrato.contratoPage.selecionarDetran(detranConfig(UF));

    const parcelas = page.getByRole('textbox', { name: /Número de parcelas/i });
    await expect(parcelas).toBeVisible();
    await parcelas.fill('-5');
    await parcelas.blur();
    const valor = await parcelas.inputValue();
    expect(valor, 'Confluence CT008: não permitir parcelas negativas').not.toMatch(/-/);
    expect(Number.parseInt(valor || '0', 10)).toBeGreaterThanOrEqual(0);
    await expect(page.getByText('Contrato registrado com sucesso.')).toHaveCount(0);
  });

  test('CT-086 - deve impedir total de financiamento negativo', async ({ page }) => {
    test.info().annotations.push({ type: 'ct', description: 'CT-086' });
    test.info().annotations.push({ type: 'prioridade', description: 'P1' });

    const contrato = new ContratoActions(page);
    await contrato.contratoPage.acessar();
    await contrato.contratoPage.selecionarDetran(detranConfig(UF));

    const total = page.getByRole('textbox', { name: /Valor total financiamento/i });
    await expect(total).toBeVisible();
    await total.fill('-10000');
    await total.blur();
    const valor = await total.inputValue();
    expect(valor, 'Confluence CT011: não permitir financiamento negativo').not.toMatch(/-/);
    await expect(page.getByText('Contrato registrado com sucesso.')).toHaveCount(0);
  });
});
