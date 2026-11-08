import { parseRich } from '@/lib/text';

export default function Rich({ text, className = '' }) {
  const blocks = parseRich(text);
  return (
    <div className={`rich ${className}`}>
      {blocks.map((b, i) => {
        if (b.t === 'h2') return <h2 key={i}>{b.text}</h2>;
        if (b.t === 'ul')
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}
