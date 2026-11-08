import 'server-only';
import { createHash } from 'node:crypto';
import { LEGAL_TEMPLATES, LEGAL_KEYS } from '@/data/legal-templates';

export function legalSource(s, key) {
  const v = String(s[key] || '').trim();
  return v || LEGAL_TEMPLATES[key];
}

export function legalVars(s) {
  return {
    ...s,
    legal_name: s.legal_name || s.brand_name,
    vat_mention: s.vat_regime === 'franchise' ? 'TVA non applicable, art. 293 B du CGI.' : 'Ils sont indiqués hors taxes et toutes taxes comprises (TVA au taux en vigueur).',
  };
}

// Remplace {{var}} ; les lignes dont toutes les variables sont vides sont retirées.
export function fillLegal(text, s) {
  const vars = legalVars(s);
  return text
    .split('\n')
    .map((line) => {
      let empty = false;
      const out = line.replace(/\{\{(\w+)\}\}/g, (_, k) => {
        const v = String(vars[k] ?? '').trim();
        if (!v) empty = true;
        return v;
      });
      return empty && /^- /.test(line) ? null : out.replace(/\s{2,}/g, ' ').replace(/,\s*(?=[:.;])/g, '').replace(/ ([.,;:])/g, '$1');
    })
    .filter((l) => l !== null)
    .join('\n');
}

export function legalHash(s) {
  return createHash('sha256').update(LEGAL_KEYS.map((k) => legalSource(s, k)).join('\u0000')).digest('hex').slice(0, 16);
}
