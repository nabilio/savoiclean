// Petit format de texte : paragraphes, "## Titre", "- liste".
export function parseRich(text) {
  const blocks = [];
  const src = String(text || '').replace(/\r\n/g, '\n').trim();
  if (!src) return blocks;
  for (const chunk of src.split(/\n{2,}/)) {
    const lines = chunk.split('\n').map((l) => l.trimEnd());
    let list = null;
    let para = [];
    const flushPara = () => {
      if (para.length) blocks.push({ t: 'p', text: para.join(' ') });
      para = [];
    };
    const flushList = () => {
      if (list) blocks.push({ t: 'ul', items: list });
      list = null;
    };
    for (const line of lines) {
      if (/^##\s+/.test(line)) {
        flushPara();
        flushList();
        blocks.push({ t: 'h2', text: line.replace(/^##\s+/, '') });
      } else if (/^[-•]\s+/.test(line)) {
        flushPara();
        (list ||= []).push(line.replace(/^[-•]\s+/, ''));
      } else if (line.trim()) {
        flushList();
        para.push(line.trim());
      }
    }
    flushPara();
    flushList();
  }
  return blocks;
}

export function plain(text, max = 160) {
  const s = String(text || '').replace(/^##\s+/gm, '').replace(/^[-•]\s+/gm, '').replace(/\s+/g, ' ').trim();
  return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s;
}

export function slugify(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}
