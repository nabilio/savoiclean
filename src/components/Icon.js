// Pictogrammes originaux (traits simples). Le balisage est statique et interne.
const PATHS = {
  brush: '<path d="M17 3l-6 9"/><path d="M7 12h8l2 8H5z"/><path d="M9 16v4M13 16v4"/>',
  building: '<path d="M5 21V4a1 1 0 011-1h12a1 1 0 011 1v17"/><path d="M3 21h18M9 7h2M13 7h2M9 11h2M13 11h2"/><path d="M10 21v-5h4v5"/>',
  car: '<path d="M5 17H3.5a.5.5 0 01-.5-.5V13l2-5a2 2 0 011.9-1.4h10.2A2 2 0 0119 8l2 5v3.5a.5.5 0 01-.5.5H19"/><path d="M3 13h18"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/>',
  box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  window: '<path d="M4 4h16v16H4zM12 4v16M4 12h16"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  key: '<circle cx="8" cy="14" r="4"/><path d="M11 11l9-8M17 6l3 3M15 8l2 2"/>',
  bed: '<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 00-3-3h-7v6"/><circle cx="7" cy="11.5" r="1.6"/>',
  spray: '<path d="M8 10h6v10H8z"/><path d="M9 10V7h4v3M13 7h3l2-2M18 9h2M18 12h2"/>',
  factory: '<path d="M3 21V10l5 3v-3l5 3V6h4l.01 15z"/><path d="M3 21h18"/>',
  chef: '<path d="M6 13a4 4 0 01.5-7.8A4.5 4.5 0 0112 3a4.5 4.5 0 015.5 2.2A4 4 0 0118 13"/><path d="M7 13v8h10v-8M7 17h10"/>',
  sparkle: '<path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  mountain: '<path d="M2 20l7-12 4 6 3-4 6 10z"/><path d="M9 8l1.6 2.6"/>',
  chat: '<path d="M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1H10l-5 4v-4H4a1 1 0 01-1-1V6a1 1 0 011-1z"/><path d="M8 10h8M8 13h5"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/>',
  mail: '<path d="M3 5h18v14H3z"/><path d="M3 6l9 7 9-7"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/>',
  calendar: '<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>',
  euro: '<path d="M17 7a6 6 0 100 10M5 10h8M5 14h8"/>',
};

export default function Icon({ name, size = 22, className = '', title }) {
  const inner = PATHS[name] || PATHS.sparkle;
  return (
    <svg
      className={`ico ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

export const ICON_NAMES = Object.keys(PATHS);
