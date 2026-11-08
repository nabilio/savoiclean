import Link from 'next/link';
import { notFound } from 'next/navigation';
import { one, todayStr } from '@/lib/db';
import { fmtEUR, fmtDate, lineTotal, computeTotals } from '@/lib/money';
import { DOC_STATUSES } from '@/lib/admin-schema';
import { ConfirmButton } from '@/components/admin/Bits';
import { Flash, StatusBadge, PageTitle, Fold } from '@/components/admin/Fields';
import DocForm from '@/components/admin/DocForm';
import { displayStatus } from '@/components/admin/DocsTable';
import { docSignature, waPhone } from '@/lib/share';
import { absUrl, getSettings } from '@/lib/site';
import { setDocStatus, markPaid, convertToInvoice, deleteDocument } from '../../../actions';

export const dynamic = 'force-dynamic';

const EDITABLE = { devis: ['brouillon', 'envoyé'], facture: ['brouillon', 'envoyée'] };
const METHODS = ['Virement', 'Chèque', 'Espèces', 'Carte bancaire', 'Prélèvement'];

export default async function DocPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const doc = await one('SELECT * FROM documents WHERE id = ?', [Number(id)]);
  if (!doc) notFound();
  const client = doc.client_id ? await one('SELECT * FROM clients WHERE id = ?', [doc.client_id]) : null;
  const source = doc.source_id ? await one('SELECT id, number FROM documents WHERE id = ?', [doc.source_id]) : null;
  const lines = JSON.parse(doc.items);
  const totals = computeTotals(lines, doc.vat_regime);
  const franchise = doc.vat_regime === 'franchise';
  const today = todayStr();
  const editable = EDITABLE[doc.type].includes(doc.status);
  const editing = editable && sp?.edit === '1';
  const label = doc.type === 'devis' ? 'Devis' : 'Facture';
  const settings = await getSettings();
  const shareUrl = absUrl(`/d/${doc.id}/${docSignature(doc)}`);
  const who = client ? client.name || client.company || '' : '';
  const kind = doc.type === 'devis' ? 'devis' : 'facture';
  const amount = fmtEUR(totals.ttc);
  const msg = `Bonjour${who ? ' ' + who : ''},\n\nVeuillez trouver ci-dessous votre ${kind} n° ${doc.number}${doc.title ? ' (' + doc.title + ')' : ''} d’un montant de ${amount} TTC :\n${shareUrl}\n\nCordialement,\n${settings.legal_name || settings.brand_name}`;
  const waHref = `https://wa.me/${waPhone(client?.phone)}?text=${encodeURIComponent(msg)}`;
  const subject = `${label} ${doc.number} – ${settings.legal_name || settings.brand_name}`;
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(client?.email || '')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
  const back = doc.type === 'devis' ? '/admin/facturation' : '/admin/facturation/factures';
  const nextStatuses = DOC_STATUSES[doc.type].filter((x) => x !== doc.status && x !== 'payée' && x !== 'facturé' && !(doc.status === 'payée'));

  return (
    <>
      <PageTitle
        actions={
          <>
            <a className="btn btn-primary" href={`/admin/facturation/doc/${doc.id}/pdf`} target="_blank" rel="noopener noreferrer">
              Visualiser
            </a>
            <a className="btn btn-wa" href={waHref} target="_blank" rel="noopener noreferrer">
              Envoyer par WhatsApp
            </a>
            <a className="btn btn-ghost" href={gmailHref} target="_blank" rel="noopener noreferrer">
              Envoyer par Gmail
            </a>
            <Link className="btn btn-ghost" href={back}>
              ← Liste
            </Link>
          </>
        }
      >
        {label} {doc.number} <StatusBadge s={displayStatus(doc, today)} />
      </PageTitle>
      <Flash sp={sp} />

      {editing ? (
        <DocForm doc={doc} type={doc.type} regime={doc.vat_regime} cancelHref={`/admin/facturation/doc/${doc.id}`} />
      ) : (
        <>
          <div className="box">
            <div className="form-grid">
              <div>
                <h3>Client</h3>
                {client ? (
                  <p style={{ marginBottom: 0 }}>
                    <Link href={`/admin/facturation/clients/${client.id}`}>
                      <b>{client.company || client.name}</b>
                    </Link>
                    {client.company ? <><br />{client.name}</> : null}
                    {client.address ? <><br />{client.address}</> : null}
                    {client.postal_code || client.city ? <><br />{[client.postal_code, client.city].filter(Boolean).join(' ')}</> : null}
                    {client.email ? <><br />{client.email}</> : null}
                    {client.phone ? <><br />{client.phone}</> : null}
                  </p>
                ) : (
                  <p className="muted">—</p>
                )}
              </div>
              <div>
                <h3>Document</h3>
                <p style={{ marginBottom: 0 }}>
                  Date : {fmtDate(doc.issue_date)}
                  <br />
                  {doc.type === 'devis' ? 'Valable jusqu’au' : 'Échéance'} : {fmtDate(doc.due_date)}
                  {doc.paid_at ? <><br />Payée le {fmtDate(doc.paid_at)}{doc.payment_method ? ` (${doc.payment_method})` : ''}</> : null}
                  {source ? <><br />Issue du devis <Link href={`/admin/facturation/doc/${source.id}`}>{source.number}</Link></> : null}
                  {doc.title ? <><br />Objet : <b>{doc.title}</b></> : null}
                </p>
              </div>
            </div>
          </div>
          <div className="box">
            <table className="t" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Désignation</th>
                  <th className="num">Qté</th>
                  <th className="num">PU HT</th>
                  {!franchise && <th className="num">TVA</th>}
                  <th className="num">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i}>
                    <td>{l.desc}</td>
                    <td className="num">
                      {String(l.qty).replace('.', ',')} {l.unit}
                    </td>
                    <td className="num">{fmtEUR(l.price)}</td>
                    {!franchise && <td className="num">{String(l.vat).replace('.', ',')} %</td>}
                    <td className="num">{fmtEUR(lineTotal(l))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="totals">
              <div>
                <span>Total HT</span>
                <b>{fmtEUR(totals.ht)}</b>
              </div>
              {franchise ? (
                <div className="muted">
                  <span>TVA non applicable</span>
                  <span>art. 293 B du CGI</span>
                </div>
              ) : (
                totals.vatLines.map((v) => (
                  <div key={v.rate} className="muted">
                    <span>TVA {String(v.rate).replace('.', ',')} %</span>
                    <span>{fmtEUR(v.amount)}</span>
                  </div>
                ))
              )}
              <div className="grand">
                <span>Total TTC</span>
                <span>{fmtEUR(totals.ttc)}</span>
              </div>
            </div>
            {doc.notes ? (
              <p className="muted" style={{ whiteSpace: 'pre-wrap', marginTop: 18 }}>
                {doc.notes}
              </p>
            ) : null}
          </div>

          <div className="box">
            <h2>Actions</h2>
            <div className="row-actions">
              {editable && (
                <Link className="btn btn-ghost" href={`/admin/facturation/doc/${doc.id}?edit=1`}>
                  Modifier
                </Link>
              )}
              {doc.type === 'devis' && ['accepté', 'envoyé', 'brouillon'].includes(doc.status) && (
                <form action={convertToInvoice}>
                  <input type="hidden" name="id" value={doc.id} />
                  <ConfirmButton className="btn btn-accent" message="Créer une facture à partir de ce devis ?">
                    Transformer en facture
                  </ConfirmButton>
                </form>
              )}
              {nextStatuses.map((x) => (
                <form action={setDocStatus} key={x}>
                  <input type="hidden" name="id" value={doc.id} />
                  <input type="hidden" name="status" value={x} />
                  <button className="btn btn-ghost">Marquer « {x} »</button>
                </form>
              ))}
              {doc.type === 'devis' && ['brouillon', 'refusé'].includes(doc.status) && (
                <form action={deleteDocument}>
                  <input type="hidden" name="id" value={doc.id} />
                  <ConfirmButton message="Supprimer ce devis ?">Supprimer</ConfirmButton>
                </form>
              )}
            </div>
            {doc.type === 'facture' && !['payée', 'annulée'].includes(doc.status) && (
              <div style={{ marginTop: 16 }}>
                <Fold title="Enregistrer le paiement">
                  <form action={markPaid} className="form-grid">
                    <input type="hidden" name="id" value={doc.id} />
                    <div className="field">
                      <label htmlFor="paid_at">Date de paiement</label>
                      <input id="paid_at" name="paid_at" type="date" defaultValue={today} />
                    </div>
                    <div className="field">
                      <label htmlFor="payment_method">Mode de règlement</label>
                      <select id="payment_method" name="payment_method">
                        {METHODS.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="full">
                      <button className="btn btn-primary">Marquer comme payée</button>
                    </div>
                  </form>
                </Fold>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
