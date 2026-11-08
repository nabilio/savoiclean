'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

export default function MobileNav({ links, waHref }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (
    <>
      <button className="burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <Icon name={open ? 'close' : 'menu'} size={26} />
      </button>
      {open && (
        <nav className="mnav" aria-label="Menu principal">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <a className="btn btn-wa" href={waHref} target="_blank" rel="noopener noreferrer">
            <Icon name="chat" size={20} /> Écrire sur WhatsApp
          </a>
        </nav>
      )}
    </>
  );
}
