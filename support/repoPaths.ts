import { resolve } from 'path';

/** Root of this quality-engineering repository (parent of `support/`). */
export const REPO_ROOT = resolve(__dirname, '..');

export const DOCS_QA_MAPPING = resolve(REPO_ROOT, 'docs', 'qa-mapping');

export const LIVE_INVENTORY_PATH = resolve(DOCS_QA_MAPPING, 'etapa-5', 'LIVE-FIELD-INVENTORY.json');

export const MATRIZ_FORM_PATH = resolve(DOCS_QA_MAPPING, 'evidence', 'matriz-form.json');

export const LIVE_EVIDENCE_DIR = resolve(DOCS_QA_MAPPING, 'evidence', 'live');
