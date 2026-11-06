import fs from 'node:fs';
import path from 'node:path';

function sanitizeLiveText(text) {
  return String(text || '')
    .replace(/Bearer\s+[A-Za-z0-9._\-]+/gi, 'Bearer [REDACTED]')
    .replace(/([?&](token|access_token|password|senha)=)[^&\s]+/gi, '$1[REDACTED]')
    .replace(
      /"(access_token|refresh_token|token|password|senha|cookie|authorization)"\s*:\s*"[^"]*"/gi,
      '"$1":"[REDACTED]"',
    )
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]')
    .replace(/(- textbox "[^"]*[Ss]enha[^"]*"[\s\S]*?- text: )[^\n]+/g, '$1[REDACTED]')
    .replace(/(- textbox "[^"]*Usuário[^"]*"[\s\S]*?- text: )[^\n]+/g, '$1[REDACTED]')
    .replace(/(- textbox "[^"]*password[^"]*"[\s\S]*?- text: )[^\n]+/gi, '$1[REDACTED]');
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (/\.(md|txt|json|xml|html)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

export function sanitizeLiveArtifactFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const sanitized = sanitizeLiveText(original);
  if (sanitized !== original) {
    fs.writeFileSync(filePath, sanitized, 'utf8');
  }
  return sanitized !== original;
}

const roots = ['test-results', 'playwright-report'];
let changed = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    if (sanitizeLiveArtifactFile(file)) {
      changed += 1;
    }
  }
}
console.log(`sanitize-live-artifacts files-rewritten=${changed}`);
