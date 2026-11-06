import { test, expect } from '@playwright/test';
import {
  campoObrigatorio,
  hasMatrizFixture,
  loadMatrizFixture,
  SECAO_TERCEIRO_GARANTIDOR,
  SECAO_VEICULO,
  secaoVisivel,
} from '../support/matrizLoader';
import {
  camposObrigatoriosVisuais,
  hasUfUiProfile,
  isStableFieldId,
  labelSemAsterisco,
  liveInventoryPath,
  rotuloExato,
  loadUfUiProfile,
  sourcedLiveRule,
  UfUiProfileError,
} from '../support/ufUiProfile';

test.describe('Perfil visual de UF @mocked', () => {
  test('lê o inventário live versionado e não mistura com a matriz Java', () => {
    expect(liveInventoryPath()).toMatch(/LIVE-FIELD-INVENTORY\.json$/);

    const baLive = loadUfUiProfile('BA');
    const baJava = loadMatrizFixture('BA');

    expect(baLive.origem).toBe('LIVE_FIELD_INVENTORY');
    expect(baLive.confianca).toBe('CONFIRMADA_LIVE');
    expect(baJava.fonteJava).toContain('MatrizDados');
    expect(baLive.origem).not.toBe(baJava.origem);

    expect(baLive.formularioDisponivel).toBe(true);
    expect(baLive.matrizJava).toBe(true);
    expect(baLive.veiculo.novoUsado.visivel).toBe(true);
    expect(baLive.veiculo.novoUsado.obrigatorioVisual).toBe(true);
    expect(baLive.veiculo.zeroKm.visivel).toBe(true);
    expect(baLive.veiculo.zeroKm.default).toBe('Sim');
    expect(baLive.terceiroGarantidor.visivel).toBe(false);
    expect(camposObrigatoriosVisuais(baLive)).toHaveLength(baLive.requiredVisualCount);

    expect(campoObrigatorio(baJava, SECAO_VEICULO, 'INDICA_NOVO_USADO')).toBe(true);
    expect(secaoVisivel(baJava, SECAO_TERCEIRO_GARANTIDOR)).toBe(false);
  });

  test('SE não disponibiliza formulário; MA tem UI sem matriz Java', () => {
    const se = loadUfUiProfile('SE');
    expect(se.formularioDisponivel).toBe(false);
    expect(se.matrizJava).toBe(false);
    expect(se.headings).toEqual(['Registrar contrato', 'Destino', 'Documentos']);
    expect(hasMatrizFixture('SE')).toBe(false);

    const ma = loadUfUiProfile('MA');
    expect(ma.formularioDisponivel).toBe(true);
    expect(ma.matrizJava).toBe(false);
    expect(ma.terceiroGarantidor.visivel).toBe(true);
    expect(hasMatrizFixture('MA')).toBe(false);
    expect(ma.suitePlaywright).toBe(false);
  });

  test('CE/ES/MA/PR/RJ expõem Terceiro Garantidor só no perfil live', () => {
    for (const uf of ['CE', 'ES', 'MA', 'PR', 'RJ'] as const) {
      expect(loadUfUiProfile(uf).terceiroGarantidor.visivel).toBe(true);
    }
    expect(loadUfUiProfile('BA').terceiroGarantidor.visivel).toBe(false);
    expect(loadUfUiProfile('RO').terceiroGarantidor.visivel).toBe(false);
    expect(loadUfUiProfile('CE').terceiroGarantidor.campoCount).toBe(12);
    expect(loadUfUiProfile('CE').terceiroGarantidor.campos).toHaveLength(12);
    expect(loadUfUiProfile('CE').terceiroGarantidor.campos.every((campo) => campo.requiredVisual === false)).toBe(true);
  });

  test('lote 3 PE/RN sem TG; PR/RJ com TG de 12 campos sem asterisco visual', () => {
    for (const uf of ['PE', 'RN'] as const) {
      const profile = loadUfUiProfile(uf);
      expect(profile.formularioDisponivel).toBe(true);
      expect(profile.matrizJava).toBe(true);
      expect(profile.terceiroGarantidor.visivel).toBe(false);
      expect(profile.veiculo.novoUsado.visivel).toBe(false);
      expect(profile.veiculo.zeroKm.default).toBe('Sim');
      expect(profile.credor).toBe(true);
      expect(profile.documentos).toBe(true);
      expect(profile.veiculo.camposZeroKmSim.some((campo) => campo.formControl === 'tipoEspecie')).toBe(false);
      expect(secaoVisivel(loadMatrizFixture(uf), SECAO_TERCEIRO_GARANTIDOR)).toBe(false);
    }
    for (const uf of ['PR', 'RJ'] as const) {
      const profile = loadUfUiProfile(uf);
      expect(profile.formularioDisponivel).toBe(true);
      expect(profile.terceiroGarantidor.visivel).toBe(true);
      expect(profile.terceiroGarantidor.campoCount).toBe(12);
      expect(profile.terceiroGarantidor.campos).toHaveLength(12);
      expect(profile.terceiroGarantidor.campos.every((campo) => campo.requiredVisual === false)).toBe(true);
      expect(profile.headings).toContain('Terceiro garantidor');
      expect(profile.veiculo.camposZeroKmSim.some((campo) => campo.formControl === 'tipoEspecie')).toBe(true);
      expect(secaoVisivel(loadMatrizFixture(uf), SECAO_TERCEIRO_GARANTIDOR)).toBe(true);
    }
    expect(loadUfUiProfile('PE').idCombo).toBe(3);
    expect(loadUfUiProfile('PR').idCombo).toBe(10);
    expect(loadUfUiProfile('RJ').idCombo).toBe(16);
    expect(loadUfUiProfile('RN').idCombo).toBe(228);
    expect(loadUfUiProfile('PE').requiredVisualCount).toBe(24);
    expect(loadUfUiProfile('PR').requiredVisualCount).toBe(22);
    expect(loadUfUiProfile('RJ').requiredVisualCount).toBe(25);
    expect(loadUfUiProfile('RN').requiredVisualCount).toBe(30);
    const corRj = loadUfUiProfile('RJ').veiculo.camposZeroKmSim.find((campo) => campo.formControl === 'descricaoCorVeiculo');
    expect(corRj?.requiredVisual).toBe(true);
  });

  test('lote 4 RR/RS/SC/SP sem TG e sem Novo/usado na UI live', () => {
    for (const uf of ['RR', 'RS', 'SC', 'SP'] as const) {
      const profile = loadUfUiProfile(uf);
      expect(profile.formularioDisponivel).toBe(true);
      expect(profile.matrizJava).toBe(true);
      expect(profile.terceiroGarantidor.visivel).toBe(false);
      expect(profile.terceiroGarantidor.campoCount).toBe(0);
      expect(profile.veiculo.novoUsado.visivel).toBe(false);
      expect(profile.veiculo.zeroKm.default).toBe('Sim');
      expect(profile.credor).toBe(true);
      expect(profile.documentos).toBe(true);
      expect(profile.veiculo.camposZeroKmSim.some((campo) => campo.formControl === 'tipoEspecie')).toBe(false);
      expect(hasMatrizFixture(uf)).toBe(true);
      expect(secaoVisivel(loadMatrizFixture(uf), SECAO_TERCEIRO_GARANTIDOR)).toBe(false);
      expect(campoObrigatorio(loadMatrizFixture(uf), SECAO_VEICULO, 'INDICA_NOVO_USADO')).toBe(false);
    }
    expect(loadUfUiProfile('RR').idCombo).toBe(11);
    expect(loadUfUiProfile('RS').idCombo).toBe(231);
    expect(loadUfUiProfile('SC').idCombo).toBe(4);
    expect(loadUfUiProfile('SP').idCombo).toBe(1);
    expect(loadUfUiProfile('RR').fieldCount).toBe(49);
    expect(loadUfUiProfile('RS').fieldCount).toBe(54);
    expect(loadUfUiProfile('SC').fieldCount).toBe(47);
    expect(loadUfUiProfile('SP').fieldCount).toBe(50);
    expect(loadUfUiProfile('RR').requiredVisualCount).toBe(25);
    expect(loadUfUiProfile('RS').requiredVisualCount).toBe(24);
    expect(loadUfUiProfile('SC').requiredVisualCount).toBe(20);
    expect(loadUfUiProfile('SP').requiredVisualCount).toBe(26);
    expect(loadUfUiProfile('RR').fields.some((field) => field.id === 'devedorComplemento' && field.requiredVisual)).toBe(
      true,
    );
    expect(loadUfUiProfile('RS').fields.some((field) => field.id === 'tipoContrato')).toBe(true);
    expect(loadUfUiProfile('RS').fields.some((field) => field.id === 'formaContrato')).toBe(true);
    expect(loadUfUiProfile('RS').fields.some((field) => field.id === 'dataCadastro')).toBe(true);
    expect(loadUfUiProfile('SC').fields.some((field) => field.id === 'registroSIRCOF')).toBe(true);
    expect(loadUfUiProfile('SC').fields.some((field) => field.id === 'codigoAgenteFinanceiro')).toBe(false);
    expect(loadUfUiProfile('SP').fields.some((field) => field.id === 'inicioVigencia' && field.requiredVisual)).toBe(true);
    expect(loadUfUiProfile('SP').fields.some((field) => field.id === 'finalVigencia' && field.requiredVisual)).toBe(true);
    const gravameRs = loadUfUiProfile('RS').veiculo.camposZeroKmSim.find((campo) => campo.formControl === 'restricao');
    expect(gravameRs?.requiredVisual).toBe(false);
    const gravameSp = loadUfUiProfile('SP').veiculo.camposZeroKmSim.find((campo) => campo.formControl === 'restricao');
    expect(gravameSp?.requiredVisual).toBe(true);
    expect(loadUfUiProfile('SP').veiculo.camposZeroKmSim.some((campo) => campo.formControl === 'ufLicenciamento')).toBe(
      false,
    );
  });

  test('lote 2 MG/MS/MT/PB sem TG e sem Novo/usado na UI live', () => {
    for (const uf of ['MG', 'MS', 'MT', 'PB'] as const) {
      const profile = loadUfUiProfile(uf);
      expect(profile.formularioDisponivel).toBe(true);
      expect(profile.matrizJava).toBe(true);
      expect(profile.terceiroGarantidor.visivel).toBe(false);
      expect(profile.veiculo.novoUsado.visivel).toBe(false);
      expect(profile.veiculo.zeroKm.default).toBe('Sim');
      expect(profile.credor).toBe(true);
      expect(profile.documentos).toBe(true);
      expect(hasMatrizFixture(uf)).toBe(true);
      expect(secaoVisivel(loadMatrizFixture(uf), SECAO_TERCEIRO_GARANTIDOR)).toBe(false);
    }
    expect(loadUfUiProfile('MG').idCombo).toBe(9);
    expect(loadUfUiProfile('MS').idCombo).toBe(226);
    expect(loadUfUiProfile('MT').idCombo).toBe(233);
    expect(loadUfUiProfile('PB').idCombo).toBe(13);
  });

  test('lote 1 AC/AP/DF sem TG; ES com TG; todos com formulário live', () => {
    for (const uf of ['AC', 'AP', 'DF'] as const) {
      const profile = loadUfUiProfile(uf);
      expect(profile.formularioDisponivel).toBe(true);
      expect(profile.terceiroGarantidor.visivel).toBe(false);
      expect(profile.veiculo.novoUsado.visivel).toBe(false);
      expect(profile.credor).toBe(true);
      expect(profile.documentos).toBe(true);
    }
    const es = loadUfUiProfile('ES');
    expect(es.formularioDisponivel).toBe(true);
    expect(es.terceiroGarantidor.visivel).toBe(true);
    expect(es.veiculo.novoUsado.visivel).toBe(false);
    expect(loadUfUiProfile('SE').formularioDisponivel).toBe(false);
  });

  test('UF ausente falha de forma explícita', () => {
    expect(hasUfUiProfile('XX')).toBe(false);
    expect(() => loadUfUiProfile('XX')).toThrow(UfUiProfileError);
  });

  test('preserva procedência da regra live', () => {
    const ba = loadUfUiProfile('BA');
    const regra = sourcedLiveRule(ba, 'veiculoZeroKm condicional');
    expect(regra.origem).toBe('LIVE_DOM');
    expect(regra.confianca).toBe('CONFIRMADA_LIVE');
    expect(labelSemAsterisco('Novo / usado*')).toBe('Novo / usado');
    expect(rotuloExato('CNPJ*').test('CNPJ*')).toBe(true);
    expect(rotuloExato('CNPJ').test('CPF / CNPJ*')).toBe(false);
    expect(isStableFieldId('cnpjAgenteFinanceiro')).toBe(true);
    expect(isStableFieldId('chassi-veic-1762345678901-0')).toBe(false);
  });
});
