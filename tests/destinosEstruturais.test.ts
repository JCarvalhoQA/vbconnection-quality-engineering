import { test, expect } from '@playwright/test';
import { DETRAN_UFS } from '../config/detransIds';
import {
  DESTINOS_ESTRUTURAIS,
  destinosEstruturaisCombo,
  destinoEstrutural,
  LOTE_01,
  loteEstruturalDe,
  UFS_ESTRUTURAIS,
} from '../config/destinosEstruturais';

test.describe('Destinos estruturais @mocked', () => {
  test('baseline e lote 1 existem para inspeção; CE/RO ficam fora do registro', () => {
    expect(UFS_ESTRUTURAIS).toEqual(['BA', 'CE', 'RO', 'AC', 'AP', 'DF', 'ES']);
    expect(DESTINOS_ESTRUTURAIS.CE.id).toBe(236);
    expect(DESTINOS_ESTRUTURAIS.RO.id).toBe(234);
    expect(DESTINOS_ESTRUTURAIS.AC.id).toBe(17);
    expect(DESTINOS_ESTRUTURAIS.AP.id).toBe(225);
    expect(DESTINOS_ESTRUTURAIS.DF.id).toBe(232);
    expect(DESTINOS_ESTRUTURAIS.ES.id).toBe(230);
    expect(DESTINOS_ESTRUTURAIS.BA.nomeFantasia).toBe('DETRAN-BA');
    expect(DETRAN_UFS).not.toContain('CE');
    expect(DETRAN_UFS).not.toContain('RO');
    expect(DETRAN_UFS).toContain('BA');
    expect(DETRAN_UFS).toContain('AC');
    expect(destinosEstruturaisCombo()).toHaveLength(7);
    expect(destinoEstrutural('ES').nomeFantasia).toBe('DETRAN-ES');
    expect([...LOTE_01]).toEqual(['AC', 'AP', 'DF', 'ES']);
    expect(loteEstruturalDe('AC')).toBe('01');
    expect(loteEstruturalDe('BA')).toBe('baseline');
    expect(loteEstruturalDe('SE')).toBe('excecao');
  });
});
