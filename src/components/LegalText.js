function inline(t) {
  return t.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : p));
}
export default function LegalText({ text }) {
  const blocks = [];
  let list = null;
  for (const raw of text.split('\n')) {
    const line = raw.trimEnd();
    if (line.startsWith('## ')) { list = null; blocks.push(<h2 key={blocks.length}>{line.slice(3)}</h2>); }
    else if (line.startsWith('- ')) {
      if (!list) { list = []; blocks.push({ list }); }
      list.push(line.slice(2));
    } else if (line.trim()) { list = null; blocks.push(<p key={blocks.length}>{inline(line)}</p>); }
  }
  return blocks.map((b, i) => (b.list ? <ul key={i}>{b.list.map((x, j) => <li key={j}>{inline(x)}</li>)}</ul> : b));
}
