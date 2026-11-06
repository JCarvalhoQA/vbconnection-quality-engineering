import { test, expect } from '@playwright/test';
import { DETRAN_UFS } from '../config/detransIds';
import {
  DESTINOS_ESTRUTURAIS,
  destinosEstruturaisCombo,
  destinoEstrutural,
  LOTE_01,
  LOTE_02,
  LOTE_03,
  LOTE_04,
  loteEstruturalDe,
  UFS_ESTRUTURAIS,
} from '../config/destinosEstruturais';

test.describe('Destinos estruturais @mocked', () => {
  test('baseline e lotes 1–4 existem para inspeção; CE/RO ficam fora do registro', () => {
    expect(UFS_ESTRUTURAIS).toEqual([
      'BA',
      'CE',
      'RO',
      'AC',
      'AP',
      'DF',
      'ES',
      'MG',
      'MS',
      'MT',
      'PB',
      'PE',
      'PR',
      'RJ',
      'RN',
      'RR',
      'RS',
      'SC',
      'SP',
    ]);
    expect(DESTINOS_ESTRUTURAIS.CE.id).toBe(236);
    expect(DESTINOS_ESTRUTURAIS.RO.id).toBe(234);
    expect(DESTINOS_ESTRUTURAIS.AC.id).toBe(17);
    expect(DESTINOS_ESTRUTURAIS.AP.id).toBe(225);
    expect(DESTINOS_ESTRUTURAIS.DF.id).toBe(232);
    expect(DESTINOS_ESTRUTURAIS.ES.id).toBe(230);
    expect(DESTINOS_ESTRUTURAIS.MG.id).toBe(9);
    expect(DESTINOS_ESTRUTURAIS.MS.id).toBe(226);
    expect(DESTINOS_ESTRUTURAIS.MT.id).toBe(233);
    expect(DESTINOS_ESTRUTURAIS.PB.id).toBe(13);
    expect(DESTINOS_ESTRUTURAIS.PE.id).toBe(3);
    expect(DESTINOS_ESTRUTURAIS.PR.id).toBe(10);
    expect(DESTINOS_ESTRUTURAIS.RJ.id).toBe(16);
    expect(DESTINOS_ESTRUTURAIS.RN.id).toBe(228);
    expect(DESTINOS_ESTRUTURAIS.RR.id).toBe(11);
    expect(DESTINOS_ESTRUTURAIS.RS.id).toBe(231);
    expect(DESTINOS_ESTRUTURAIS.SC.id).toBe(4);
    expect(DESTINOS_ESTRUTURAIS.SP.id).toBe(1);
    expect(DESTINOS_ESTRUTURAIS.BA.nomeFantasia).toBe('DETRAN-BA');
    expect(DETRAN_UFS).not.toContain('CE');
    expect(DETRAN_UFS).not.toContain('RO');
    expect(DETRAN_UFS).toContain('BA');
    expect(DETRAN_UFS).toContain('PE');
    expect(destinosEstruturaisCombo()).toHaveLength(19);
    expect(destinoEstrutural('RN').nomeFantasia).toBe('DETRAN-RN');
    expect(destinoEstrutural('SP').nomeFantasia).toBe('DETRAN-SP');
    expect([...LOTE_01]).toEqual(['AC', 'AP', 'DF', 'ES']);
    expect([...LOTE_02]).toEqual(['MG', 'MS', 'MT', 'PB']);
    expect([...LOTE_03]).toEqual(['PE', 'PR', 'RJ', 'RN']);
    expect([...LOTE_04]).toEqual(['RR', 'RS', 'SC', 'SP']);
    expect(loteEstruturalDe('AC')).toBe('01');
    expect(loteEstruturalDe('MG')).toBe('02');
    expect(loteEstruturalDe('PR')).toBe('03');
    expect(loteEstruturalDe('SC')).toBe('04');
    expect(loteEstruturalDe('BA')).toBe('baseline');
    expect(loteEstruturalDe('SE')).toBe('excecao');
  });
});
