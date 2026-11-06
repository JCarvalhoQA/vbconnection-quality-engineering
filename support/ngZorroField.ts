import { expect, Locator, Page } from '@playwright/test';
import { rotuloExato } from './ufUiProfile';

/** Hosts NG-ZORRO que repetem o `id` no input interno. */
export const NG_ZORRO_HOST_TAGS = new Set([
  'nz-date-picker',
  'nz-select',
  'nz-input-number',
  'nz-radio-group',
  'nz-time-picker',
  'nz-cascader',
]);

export type CampoInventario = {
  readonly id: string | null;
  readonly label: string;
  readonly tag?: string | null;
  readonly secao?: string;
};

export function isNgZorroHostTag(tag: string | null | undefined): boolean {
  return !!tag && NG_ZORRO_HOST_TAGS.has(tag);
}

export function ngZorroHostSelector(tag: string, id: string): string {
  if (!isNgZorroHostTag(tag) || !id) {
    throw new Error(`Seletor de host NG-ZORRO inválido: tag=${tag} id=${id}`);
  }
  return `${tag}#${id}`;
}

export function campoEscopo(page: Page, secao?: string): Page | Locator {
  if (!secao) {
    return page;
  }
  return page.locator('article').filter({
    has: page.getByRole('heading', { name: secao, exact: true }),
  });
}

/**
 * Controle único do inventário live.
 * Date-picker / input-number / radio: host `${tag}#id` (o input interno repete o id).
 * Select: combobox + rótulo no article da seção (o host muitas vezes não leva o id).
 * Input nativo: textbox + rótulo no mesmo article.
 * Não usa `.first()` / `.nth()`.
 */
export function campoControle(page: Page, field: CampoInventario): Locator {
  const root = campoEscopo(page, field.secao);
  const nome = rotuloExato(field.label);

  if (field.tag === 'nz-date-picker' && field.id) {
    return page.locator(ngZorroHostSelector(field.tag, field.id));
  }
  if ((field.tag === 'nz-input-number' || field.tag === 'nz-radio-group' || field.tag === 'nz-time-picker') && field.id) {
    return page.locator(ngZorroHostSelector(field.tag, field.id));
  }
  if (field.tag === 'nz-select' || field.tag === 'nz-cascader') {
    return root.getByRole('combobox', { name: nome });
  }
  return root.getByRole('textbox', { name: nome });
}

export async function assertCampoUnicoVisivel(page: Page, field: CampoInventario): Promise<void> {
  const controle = campoControle(page, field);
  await expect(controle, `campo ambíguo: ${field.id ?? field.label}`).toHaveCount(1);
  await expect(controle).toBeVisible();
}
