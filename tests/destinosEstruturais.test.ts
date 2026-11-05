import { test, expect } from '@playwright/test';
import { DETRAN_UFS } from '../config/detransIds';
import {
  DESTINOS_ESTRUTURAIS,
  destinosEstruturaisCombo,
  destinoEstrutural,
  UFS_ESTRUTURAIS,
} from '../config/destinosEstruturais';

test.describe('Destinos estruturais @mocked', () => {
  test('BA/CE/RO existem para inspeção e CE/RO ficam fora da suíte de registro', () => {
    expect(UFS_ESTRUTURAIS).toEqual(['BA', 'CE', 'RO']);
    expect(DESTINOS_ESTRUTURAIS.CE.id).toBe(236);
    expect(DESTINOS_ESTRUTURAIS.RO.id).toBe(234);
    expect(DESTINOS_ESTRUTURAIS.BA.nomeFantasia).toBe('DETRAN-BA');
    expect(DETRAN_UFS).not.toContain('CE');
    expect(DETRAN_UFS).not.toContain('RO');
    expect(DETRAN_UFS).toContain('BA');
    expect(destinosEstruturaisCombo()).toHaveLength(3);
    expect(destinoEstrutural('CE').nomeFantasia).toBe('DETRAN-CE');
  });
});
