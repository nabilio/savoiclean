'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNav({ items, newLeads }) {
  const path = usePathname();
  return (
    <nav className="adm-nav" aria-label="Administration">
      {items.map((it) => {
        const on = it.href === '/admin' ? path === '/admin' : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} className={on ? 'on' : ''}>
            {it.label}
            {it.href === '/admin/demandes' && newLeads > 0 ? <span className="badge red">{newLeads}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function SubTabs({ items }) {
  const path = usePathname();
  const active = [...items].sort((a, b) => b.href.length - a.href.length).find((i) => path === i.href || path.startsWith(i.href + '/'));
  return (
    <div className="subtabs">
      {items.map((it) => (
        <Link key={it.href} href={it.href} className={active?.href === it.href ? 'on' : ''}>
          {it.label}
        </Link>
      ))}
    </div>
  );
}

export function ConfirmButton({ children, message = 'Confirmer cette action ?', className = 'btn btn-danger', confirmLabel, ...rest }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const danger = className.includes('danger');
  const label = confirmLabel || (danger ? 'Supprimer' : 'Confirmer');

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const confirm = () => {
    setOpen(false);
    const btn = ref.current;
    if (btn && btn.form) btn.form.requestSubmit();
  };

  return (
    <>
      <button type="button" ref={ref} className={className} onClick={() => setOpen(true)} {...rest}>
        {children}
      </button>
      {open &&
        createPortal(
          <div className="modal-back" onClick={() => setOpen(false)}>
            <div className="modal-card" role="alertdialog" aria-modal="true" aria-labelledby="mc-title" onClick={(e) => e.stopPropagation()}>
              <h3 id="mc-title">Confirmation</h3>
              <p>{message}</p>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                  Annuler
                </button>
                <button type="button" className={danger ? 'btn btn-danger' : 'btn btn-primary'} onClick={confirm} autoFocus>
                  {label}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export function DocEditor({ initialLines, regime, vatRates, units }) {
  const blank = { desc: '', qty: '1', unit: 'forfait', price: '', vat: String(vatRates[0]) };
  const [lines, setLines] = useState(initialLines.length ? initialLines : [blank]);
  const upd = (i, k, v) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, [k]: v } : l)));
  const num = (v) => {
    const n = parseFloat(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };
  const lineHT = (l) => Math.round(num(l.qty) * num(l.price) * 100);
  const ht = lines.reduce((a, l) => a + lineHT(l), 0);
  const byRate = {};
  for (const l of lines) {
    const r = regime === 'franchise' ? 0 : num(l.vat);
    byRate[r] = (byRate[r] || 0) + lineHT(l);
  }
  const vat = Object.entries(byRate).reduce((a, [r, b]) => a + Math.round((b * Number(r)) / 100), 0);
  const eur = (c) => (c / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  const json = JSON.stringify(lines);

  return (
    <div>
      <input type="hidden" name="items_json" value={json} readOnly />
      <table className="lines">
        <thead>
          <tr>
            <th>Désignation</th>
            <th>Qté</th>
            <th>Unité</th>
            <th>Prix HT (€)</th>
            {regime !== 'franchise' && <th>TVA %</th>}
            <th>Total HT</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <tr key={i}>
              <td className="desc" data-l="Désignation">
                <input value={l.desc} onChange={(e) => upd(i, 'desc', e.target.value)} placeholder="Ex. Nettoyage fin de chantier – appartement 80 m²" aria-label="Désignation" />
              </td>
              <td data-l="Qté">
                <input value={l.qty} inputMode="decimal" onChange={(e) => upd(i, 'qty', e.target.value)} aria-label="Quantité" />
              </td>
              <td data-l="Unité">
                <select value={l.unit} onChange={(e) => upd(i, 'unit', e.target.value)} aria-label="Unité">
                  {units.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </td>
              <td data-l="Prix HT">
                <input value={l.price} inputMode="decimal" onChange={(e) => upd(i, 'price', e.target.value)} aria-label="Prix unitaire HT" />
              </td>
              {regime !== 'franchise' && (
                <td data-l="TVA %">
                  <select value={l.vat} onChange={(e) => upd(i, 'vat', e.target.value)} aria-label="Taux de TVA">
                    {vatRates.map((r) => (
                      <option key={r} value={String(r)}>
                        {String(r).replace('.', ',')}
                      </option>
                    ))}
                  </select>
                </td>
              )}
              <td data-l="Total HT" style={{ whiteSpace: 'nowrap', paddingTop: 12 }}>
                {eur(lineHT(l))}
              </td>
              <td className="rm">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLines((ls) => (ls.length > 1 ? ls.filter((_, j) => j !== i) : ls))} aria-label="Supprimer la ligne">
                  Retirer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => setLines((ls) => [...ls, { ...blank }])}>
        + Ajouter une ligne
      </button>
      <div className="totals">
        <div>
          <span>Total HT</span>
          <b>{eur(ht)}</b>
        </div>
        {regime === 'franchise' ? (
          <div className="muted">
            <span>TVA non applicable</span>
            <span>art. 293 B du CGI</span>
          </div>
        ) : (
          <div>
            <span>TVA</span>
            <b>{eur(vat)}</b>
          </div>
        )}
        <div className="grand">
          <span>Total TTC</span>
          <span>{eur(ht + vat)}</span>
        </div>
      </div>
    </div>
  );
}
